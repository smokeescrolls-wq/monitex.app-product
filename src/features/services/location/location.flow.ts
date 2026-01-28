export const LOCATION_FLOW = {
  startCost: 60,
  accelerateCost: 30,
  steps: [
    "Connecting to secure server...",
    "Generating sharing invitation...",
    "Waiting for contact consent...",
    "Receiving shared location...",
    "Mapping frequent locations and patterns...",
    "Generating final report...",
  ],
  estimateDays: 4,
} as const;