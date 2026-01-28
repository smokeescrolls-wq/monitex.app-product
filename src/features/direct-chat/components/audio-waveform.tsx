"use client";

import { useMemo } from "react";
import { Play } from "lucide-react";

type Props = {
  durationLabel: string;
  locked?: boolean;
  onPlay: () => void;
};

export function AudioWaveform({ durationLabel, locked, onPlay }: Props) {
  const bars = useMemo(() => {
    const n = 34;
    return Array.from({ length: n }).map(
      () => 10 + Math.floor(Math.random() * 22),
    );
  }, []);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${
        locked ? "bg-white/5" : "bg-white/10"
      }`}
    >
      <button
        type="button"
        onClick={onPlay}
        aria-label="Reproduzir áudio"
        className={`grid place-items-center w-9 h-9 rounded-full ${
          locked ? "bg-white/10 text-white/60" : "bg-white/15 text-white"
        }`}
      >
        <Play className="w-4 h-4" />
      </button>

      <div className="flex items-end gap-[3px] flex-1 h-8">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-[2px] ${
              locked ? "bg-white/25" : "bg-white"
            }`}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <span className={`text-xs ${locked ? "text-white/50" : "text-white/80"}`}>
        {durationLabel}
      </span>
    </div>
  );
}
