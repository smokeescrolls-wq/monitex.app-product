export function canSearch(args: { searchCount: number; isVip: boolean }) {
  if (args.isVip) return true;
  return args.searchCount < 1;
}

export function getRemainingMs(args: {
  accessStartedAt: number | undefined;
  accessDurationMs: number;
  nowMs: number;
}) {
  if (args.accessStartedAt == null) return args.accessDurationMs;
  const elapsed = args.nowMs - args.accessStartedAt;
  return Math.max(0, args.accessDurationMs - Math.max(0, elapsed));
}
