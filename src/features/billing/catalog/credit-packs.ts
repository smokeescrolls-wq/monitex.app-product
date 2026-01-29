export type CreditPack = {
  id: string;
  credits: number;
  bonusCredits: number;
  price: number;
  currencySymbol: "$";
  badge?: "MOST_POPULAR" | "BEST_VALUE";
};

export const CREDIT_PACKS: CreditPack[] = [
  { id: "credits_100", credits: 100, bonusCredits: 0, price: 29.9, currencySymbol: "$" },
  { id: "credits_600", credits: 600, bonusCredits: 100, price: 79.9, currencySymbol: "$" },
  { id: "credits_1500", credits: 1500, bonusCredits: 300, price: 149.9, currencySymbol: "$", badge: "MOST_POPULAR" },
  { id: "credits_5000", credits: 5000, bonusCredits: 1000, price: 299.9, currencySymbol: "$" },
  { id: "credits_10000", credits: 10000, bonusCredits: 5000, price: 499.9, currencySymbol: "$", badge: "BEST_VALUE" },
];

export function getPackById(id: string) {
  return CREDIT_PACKS.find((p) => p.id === id) ?? null;
}
