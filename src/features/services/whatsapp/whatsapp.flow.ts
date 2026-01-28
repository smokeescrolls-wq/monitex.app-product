export const WA_FLOW = {
  startCost: 40,
  accelerateCost: 30,
  placeholder: "(47) 99999-9999",
  examples: ["(47) 99181-9122", "+55 47 99181-9122", "5547991819122"],
  steps: [
    "Conectando ao servidor seguro...",
    "Acessando conversas autorizadas...",
    "Sincronizando mensagens e histórico...",
    "Baixando mídias (fotos, vídeos, áudios)...",
    "Analisando contatos e grupos...",
    "Gerando relatório final...",
  ],
  estimateDays: 4,
} as const;

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length >= 11 && digits.startsWith("55")) return digits;
  if (digits.length >= 10) return `55${digits}`;
  return digits;
}

export function formatBRPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length < 12) return d;
  const cc = d.slice(0, 2);
  const area = d.slice(2, 4);
  const rest = d.slice(4);
  const p1 = rest.slice(0, rest.length - 4);
  const p2 = rest.slice(-4);
  return `+${cc} (${area}) ${p1}-${p2}`;
}
