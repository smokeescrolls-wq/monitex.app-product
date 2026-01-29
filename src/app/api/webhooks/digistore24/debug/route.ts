import { NextResponse } from "next/server";
import { listOrderEvents } from "@/features/billing/orders/order.store";

export async function GET() {
  const events = await listOrderEvents();
  return NextResponse.json({ ok: true, events });
}
