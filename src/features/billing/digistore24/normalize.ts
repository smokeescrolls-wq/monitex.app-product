export type Digistore24EventKind =
  | "payment_success"
  | "refund"
  | "chargeback"
  | "unknown";

export type Digistore24Event = {
  kind: Digistore24EventKind;
  orderId: string;
  email: string;
  productId: string;
  amount: number | null;
  currency: string | null;
  idempotencyKey: string;
};

function pick(payload: Record<string, string>, keys: string[]) {
  for (const k of keys) {
    const v = payload[k];
    if (v && String(v).trim().length > 0) return String(v).trim();
  }
  return "";
}

export function normalizeDigistore24Event(payload: Record<string, string>): Digistore24Event {
  const kindRaw = pick(payload, ["event", "event_type", "status", "type"]).toLowerCase();

  const orderId = pick(payload, ["order_id", "orderId", "transaction_id", "transactionId", "invoice_id"]);
  const email = pick(payload, ["email", "customer_email", "buyer_email"]);
  const productId = pick(payload, ["product_id", "productId", "product"]);

  const amountStr = pick(payload, ["amount", "price", "total"]);
  const currency = pick(payload, ["currency", "currency_code"]) || null;

  const amount = amountStr ? Number(amountStr.replace(",", ".")) : null;

  let kind: Digistore24EventKind = "unknown";
  if (kindRaw.includes("success") || kindRaw.includes("paid") || kindRaw.includes("approved")) kind = "payment_success";
  else if (kindRaw.includes("refund")) kind = "refund";
  else if (kindRaw.includes("chargeback")) kind = "chargeback";

  if (!orderId) throw new Error("missing_order_id");
  if (!email) throw new Error("missing_email");
  if (!productId) throw new Error("missing_product_id");

  return {
    kind,
    orderId,
    email,
    productId,
    amount: Number.isFinite(amount as number) ? (amount as number) : null,
    currency,
    idempotencyKey: `${kind}:${orderId}`,
  };
}
