export const IG_FLOW = {
  startCost: 45,
  accelerateCost: 30,
  placeholder: "@username",
  examples: ["@exemple", "exemple", "instagram.com/exemple"],
  steps: [
    "Profile found",
    "Accessing feed and stories...",
    "Retrieving authorized data...",
    "Analyzing interactions...",
    "Indexing patterns...",
    "Generating full report...",
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
