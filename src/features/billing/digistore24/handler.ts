import { normalizeDigistore24Event } from "./normalize";
import { ensureIdempotency, recordOrderEvent } from "../orders/order.store";
import { applyEntitlement } from "../services/entitlement.service";

export async function handleDigistore24Webhook(payload: Record<string, string>) {
  const evt = normalizeDigistore24Event(payload);

  const already = await ensureIdempotency(evt.idempotencyKey);
  if (already) {
    return { skipped: true, reason: "duplicate", idempotencyKey: evt.idempotencyKey };
  }

  await recordOrderEvent(evt, payload);

  if (evt.kind === "payment_success") {
    await applyEntitlement({
      email: evt.email,
      productId: evt.productId,
      orderId: evt.orderId,
      amount: evt.amount,
      currency: evt.currency,
    });
  }

  return { skipped: false, kind: evt.kind, orderId: evt.orderId };
}
