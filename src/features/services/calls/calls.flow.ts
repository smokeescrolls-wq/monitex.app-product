export const CALLS_FLOW = {
  startCost: 25,
  accelerateCost: 30,
  steps: [
"Connecting to secure server...",
"Validating export/authorization...",
"Loading call history...",
"Indexing duration and types...",
"Correlating most frequent contacts...",
"Generating final report..."
  ],
} as const;

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length >= 10) return `55${digits}`;
  return digits;
}
