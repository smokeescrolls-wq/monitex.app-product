export const SMS_FLOW = {
  startCost: 30,
  accelerateCost: 30,
  steps: [
    "Conectando ao servidor seguro...",
    "Validando número e consentimento...",
    "Carregando mensagens exportadas/autorizadas...",
    "Indexando mensagens e remetentes...",
    "Extraindo códigos e padrões...",
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
