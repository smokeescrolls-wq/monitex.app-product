import { getPackById } from "../catalog/credit-packs";

type ApplyEntitlementInput = {
  email: string;
  productId: string;
  orderId: string;
  amount: number | null;
  currency: string | null;
};

const balances = new Map<string, number>();

export async function applyEntitlement(input: ApplyEntitlementInput) {
  const pack = getPackById(input.productId);
  const creditsToAdd = pack ? pack.credits + pack.bonusCredits : 0;

  const prev = balances.get(input.email) ?? 0;
  balances.set(input.email, prev + creditsToAdd);

  return {
    creditsAdded: creditsToAdd,
    newBalance: balances.get(input.email) ?? 0,
  };
}

export async function getMockBalance(email: string) {
  return balances.get(email) ?? 0;
}
