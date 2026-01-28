export const FB_FLOW = {
  startCost: 45,
  accelerateCost: 30,
  placeholder: "Cole a URL do perfil (facebook.com/username)",
  examples: [
    "facebook.com/username",
    "https://www.facebook.com/username",
    "fb.com/username",
    "m.facebook.com/username",
  ],
  steps: [
    "Conectando ao servidor seguro...",
    "Validando link e permissões...",
    "Coletando dados públicos/autorizados...",
    "Indexando informações e relações...",
    "Analisando padrões e inconsistências...",
    "Gerando relatório final...",
  ],
  estimateDays: 5,
} as const;

export function normalizeFacebookUrl(input: string) {
  const v = input.trim();
  if (!v) return "";

  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  if (v.startsWith("fb.com/") || v.startsWith("facebook.com/") || v.startsWith("m.facebook.com/")) {
    return `https://${v}`;
  }

  return v;
}
