"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Zap } from "lucide-react";

function formatMMSS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

type Props = {
  storageKey?: string;
  durationSeconds?: number;
  onUpgrade: () => void;

  onOpenPaywall?: () => void;
};

export function PreviewUpgradeCard({
  storageKey = "stalkeaPreviewEndsAt",
  durationSeconds = 10 * 60,
  onUpgrade,
}: Props) {
  const [now, setNow] = useState(() => Date.now());
  const [endsAt, setEndsAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      const parsed = raw ? Number(raw) : NaN;

      if (Number.isFinite(parsed) && parsed > Date.now() - 60_000) {
        setEndsAt(parsed);
        return;
      }

      const next = Date.now() + durationSeconds * 1000;
      sessionStorage.setItem(storageKey, String(next));
      setEndsAt(next);
    } catch {
      setEndsAt(Date.now() + durationSeconds * 1000);
    }
  }, [storageKey, durationSeconds]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const remainingSeconds = useMemo(() => {
    if (!endsAt) return durationSeconds;
    return Math.max(0, Math.ceil((endsAt - now) / 1000));
  }, [endsAt, now, durationSeconds]);

  const timeLabel = useMemo(
    () => formatMMSS(remainingSeconds),
    [remainingSeconds],
  );

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-4 shadow-[0_18px_60px_rgba(124,58,237,0.35)] border border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>

          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">
                Preview available for {timeLabel}
              </span>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Clock3 className="w-3.5 h-3.5" />
              </div>
            </div>

            <p className="mt-1 text-white/85 text-xs">
              You earned {Math.floor(durationSeconds / 60)} minutes to test the
              tool for free, but to unlock all features and get permanent access
              you need to be a VIP member.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="shrink-0 cursor-pointer bg-white text-[#5B21B6] font-bold text-xs px-4 py-2 rounded-full hover:bg-white/90 active:scale-[0.99]"
        >
          Become VIP
        </button>
      </div>
    </div>
  );
}
