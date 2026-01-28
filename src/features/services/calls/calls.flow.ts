export const CALLS_FLOW = {
  startCost: 25,
  accelerateCost: 30,
  steps: [
    "Conectando ao servidor seguro...",
    "Validando exportação/autorização...",
    "Carregando histórico de chamadas...",
    "Indexando duração e tipos...",
    "Correlacionando contatos mais frequentes...",
    "Gerando relatório final...",
  ],
} as const;

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length >= 10) return `55${digits}`;
  return digits;
}
