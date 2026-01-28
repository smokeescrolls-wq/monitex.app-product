"use client";

import { useEffect, useState } from "react";

type UseTypewriterOpts = {
  enabled?: boolean;
  startDelayMs?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
};

export function useTypewriter(total: number, opts?: UseTypewriterOpts) {
  const enabled = opts?.enabled ?? true;
  const startDelayMs = opts?.startDelayMs ?? 180;
  const minDelayMs = opts?.minDelayMs ?? 18;
  const maxDelayMs = opts?.maxDelayMs ?? 38;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    setCount(0);

    const nextDelay = () =>
      minDelayMs +
      Math.floor(Math.random() * Math.max(1, maxDelayMs - minDelayMs));

    const tick = (i: number) => {
      if (cancelled) return;
      setCount(i);
      if (i >= total) return;
      timer = setTimeout(() => tick(i + 1), nextDelay());
    };

    timer = setTimeout(() => tick(1), startDelayMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [enabled, startDelayMs, minDelayMs, maxDelayMs, total]);

  return count;
}

export function TypewriterText({
  text,
  count,
  showCaret,
  caretClassName,
}: {
  text: string;
  count: number;
  showCaret?: boolean;
  caretClassName?: string;
}) {
  const safe = Math.max(0, Math.min(text.length, count));
  return (
    <>
      {text.slice(0, safe)}
      {showCaret ? (
        <span
          className={
            caretClassName ??
            "ml-1 inline-block w-[0.5ch] animate-pulse text-white/50"
          }
        >
          |
        </span>
      ) : null}
    </>
  );
}
