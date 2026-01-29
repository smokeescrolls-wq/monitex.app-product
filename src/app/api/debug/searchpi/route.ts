import { NextResponse } from "next/server";

export async function GET() {
  const key = (process.env.SEARCHAPI_API_KEY ?? "").trim();
  const base = process.env.SEARCHAPI_BASE_URL ?? null;

  return NextResponse.json({
    hasKey: Boolean(key),
    keyPrefix: key ? key.slice(0, 6) : null,
    baseUrl: base,
  });
}
