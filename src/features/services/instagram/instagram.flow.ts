export const IG_FLOW = {
  startCost: 45,
  accelerateCost: 30,
  placeholder: "@username",
  examples: ["@leonardoalbano", "leonardoalbano", "instagram.com/leonardoalbano"],
  steps: [
    "Perfil encontrado",
    "Acessando feed e stories...",
    "Recuperando dados autorizados...",
    "Analisando interações...",
    "Indexando padrões...",
    "Gerando relatório completo...",
  ],
} as const;

export function normalizeInstagramTarget(input: string) {
  const v = input.trim();
  if (!v) return "";
  if (v.includes("instagram.com/")) {
    const parts = v.split("instagram.com/")[1] ?? "";
    return parts.replaceAll("/", "").replace("@", "").trim();
  }
  return v.replace("@", "").trim();
}
