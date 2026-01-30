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
    .filter(([k, v]) => k.toLowerCase() !== "sha_sign" && k.toLowerCase() !== "shasign" && v !== "")
    .sort(([a], [b]) => a.toUpperCase().localeCompare(b.toUpperCase()));

  let base = "";
  for (const [k, v] of entries) {
    base += `${k.toUpperCase()}=${v}${passphrase}`;
  }

  return crypto.createHash("sha512").update(base, "utf8").digest("hex").toUpperCase();
}

function getStableEventId(data: Record<string, string>) {
  const apiMode = data.api_mode || "live";
  const event = data.event || "unknown";

  const orderId = data.order_id || "";
  const productId = data.product_id || "";
  const paySeq = data.pay_sequence_no || "";

  const base =
    [orderId, productId, paySeq].filter(Boolean).join(":") ||
    data.transaction_id ||
    data.payment_id ||
    "";

  return base ? `${apiMode}:${event}:${base}` : null;
}

function extractUserId(data: Record<string, string>) {
  const custom = (data.custom || "").trim();
  if (custom.startsWith("userId=")) return custom.slice("userId=".length).trim();
  if (custom) return custom;

  const subid = (data.subid || "").trim();
  if (subid.startsWith("userId:")) return subid.slice("userId:".length).trim();
  if (subid) return subid;

  const uid = (data.uid || "").trim();
  if (uid) return uid;

  return null;
}

function parseAmountCents(v: string) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export async function POST(req: Request) {
  const passphrase = process.env.DIGISTORE24_SHA_PASSPHRASE;
  if (!passphrase) return new NextResponse("missing_passphrase", { status: 500 });

  const form = await req.formData();
  const data: Record<string, string> = {};
  for (const [k, v] of form.entries()) data[k] = normalize(v);

  const event = data.event || "";

  if (event === "connection_test") {
    console.log("D24 connection_test", data);
    return new NextResponse("OK", { status: 200 });
  }

  const receivedSign = (data.sha_sign || (data as any).SHASIGN || "").toUpperCase();
  const expectedSign = computeShaSign(data, passphrase);

  if (!receivedSign || receivedSign !== expectedSign) {
    console.log("D24 invalid_signature", {
      event,
      order_id: data.order_id,
      product_id: data.product_id,
      pay_sequence_no: data.pay_sequence_no,
      receivedSign,
      expectedSign,
    });
    return new NextResponse("invalid_signature", { status: 401 });
  }

  const eventId = getStableEventId(data);
  if (!eventId) return new NextResponse("missing_event_id", { status: 400 });

  const orderId = data.order_id || null;
  const paymentId = data.payment_id || null;
  const transactionId = data.transaction_id || null;

  const planCode = data.product_id || data.product_name || null;
  const userId = extractUserId(data);

  const amountCents = data.transaction_amount ? parseAmountCents(data.transaction_amount) : null;
  const currency = data.transaction_currency || null;

  const shouldCredit = event === "on_payment" || event === "on_payment_complete";

  await prisma.$transaction(async (tx) => {
    const existing = await tx.purchase.findUnique({ where: { eventId } });
    if (existing) return;

    const plan = planCode ? await tx.plan.findUnique({ where: { code: planCode } }) : null;

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

    if (!shouldCredit) return;
    if (!userId) return;
    if (!plan) return;

    const wallet = await tx.creditWallet.upsert({
      where: { userId },
      update: { balance: { increment: plan.credits } },
      create: { userId, balance: plan.credits },
    });

    await tx.creditLedger.create({
      data: {
        walletId: wallet.id,
        delta: plan.credits,
        reason: "digistore24_payment",
        meta: { orderId, paymentId, transactionId, planCode } as any,
      },
    });
  });

  return new NextResponse("OK", { status: 200 });
}

export async function GET() {
  return new NextResponse("OK", { status: 200 });
}
