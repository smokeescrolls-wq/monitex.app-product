import crypto from "crypto";
import { NextResponse } from "next/server";
import { handleDigistore24Webhook } from "@/features/billing/digistore24/handler";

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const fd = await request.formData();
    const obj: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === "string") obj[k] = v;
    });
    return obj;
  }

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as Record<string, unknown>;
    const obj: Record<string, string> = {};
    for (const [k, v] of Object.entries(json ?? {})) obj[k] = String(v ?? "");
    return obj;
  }

  const text = await request.text();
  return { raw: text };
}

export async function POST(request: Request) {
  const secret = process.env.DIGISTORE24_WEBHOOK_SECRET ?? "";
  if (!secret) {
    return NextResponse.json({ ok: false, error: "missing_webhook_secret" }, { status: 500 });
  }

  const provided = request.headers.get("x-digistore24-secret") ?? "";
  if (!provided || !timingSafeEqual(provided, secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = await readPayload(request);

  try {
    const result = await handleDigistore24Webhook(payload);
    return NextResponse.json({ ok: true, ...result }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
