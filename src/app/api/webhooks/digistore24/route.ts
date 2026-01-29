import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


function normalize(v: FormDataEntryValue | null) {
  if (v == null) return "";
  return typeof v === "string" ? v : "";
}

function computeShaSign(params: Record<string, string>, passphrase: string) {
  const entries = Object.entries(params)
    .filter(([k]) => k.toLowerCase() !== "sha_sign")
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const toHash = entries.map(([k, v]) => `${k}=${v}`).join(passphrase);
  return crypto.createHash("sha512").update(toHash, "utf8").digest("hex").toUpperCase();
}

export async function POST(req: Request) {
  const passphrase = process.env.DIGISTORE24_SHA_PASSPHRASE;
  if (!passphrase) return new NextResponse("missing_passphrase", { status: 500 });

  const form = await req.formData();

  const data: Record<string, string> = {};
  for (const [k, v] of form.entries()) data[k] = normalize(v);

  const event = data.event;
  if (event === "connection_test") return new NextResponse("OK", { status: 200 });

  const receivedSign = (data.sha_sign || "").toUpperCase();
  const expectedSign = computeShaSign(data, passphrase);

  if (!receivedSign || receivedSign !== expectedSign) {
    return new NextResponse("invalid_signature", { status: 401 });
  }

  const apiMode = data.api_mode || "live";
  const orderId = data.order_id || null;
  const paymentId = data.payment_id || null;
  const transactionId = data.transaction_id || null;

  const eventId = `${apiMode}:${event}:${transactionId || paymentId || orderId || crypto.randomUUID()}`;

  const planCode = data.product_id || data.product_name || null;
  const custom = data.custom || null;
  const userId = custom && custom.trim().length > 0 ? custom.trim() : null;

  const amountCents =
    data.transaction_amount && !Number.isNaN(Number(data.transaction_amount))
      ? Math.round(Number(data.transaction_amount) * 100)
      : null;

  const currency = data.transaction_currency || null;

  await prisma.$transaction(async (tx) => {
    const existing = await tx.purchase.findUnique({ where: { eventId } });
    if (existing) return;

    const plan = planCode
      ? await tx.plan.findUnique({ where: { code: planCode } })
      : null;

    await tx.purchase.create({
      data: {
        eventId,
        provider: "digistore24",
        orderId,
        status: event,
        amountCents,
        currency,
        raw: data as any,
        userId: userId || null,
        planId: plan?.id ?? null,
      },
    });

    if (event === "on_payment" && userId && plan) {
      const wallet = await tx.creditWallet.upsert({
        where: { userId },
        update: { balance: { increment: plan.credits } },
        create: { userId, balance: plan.credits },
      });

      await tx.creditLedger.create({
        data: {
          walletId: wallet.id,
          delta: plan.credits,
          reason: "digistore24_on_payment",
          meta: { orderId, paymentId, transactionId, planCode } as any,
        },
      });
    }
  });

  return new NextResponse("OK", { status: 200 });
}
