"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Key, Lock } from "phosphor-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { instagramUsernameSchema } from "@/features/instagram/instagram.schemas";
import { canSearch, useSessionStore } from "@/features/session/session.store";
import EyeIconAnimated from "@/components/eye-icon-animated";
import { MatrixCanvas } from "@/components/matrix-canvas";

type Seg = { text: string; className?: string };

function useTypewriter(
  total: number,
  opts?: { enabled?: boolean; startDelayMs?: number },
) {
  const enabled = opts?.enabled ?? true;
  const startDelayMs = opts?.startDelayMs ?? 150;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    setCount(0);

    const nextDelay = () => 55 + Math.floor(Math.random() * 45);

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
  }, [enabled, startDelayMs, total]);

  return count;
}

function TypedText({
  segments,
  count,
  showCaret,
  caretClassName,
}: {
  segments: Seg[];
  count: number;
  showCaret?: boolean;
  caretClassName?: string;
}) {
  let remaining = count;

  return (
    <>
      {segments.map((seg, idx) => {
        if (remaining <= 0) return null;
        const take = Math.min(seg.text.length, remaining);
        remaining -= take;

        return (
          <span key={idx} className={seg.className}>
            {seg.text.slice(0, take)}
          </span>
        );
      })}

      {showCaret ? (
        <span
          className={
            caretClassName ??
            "ml-1 inline-block w-[0.5ch] animate-pulse text-white/70"
          }
        >
          |
        </span>
      ) : null}
    </>
  );
}

function useLiveCounter(startValue: number) {
  const [value, setValue] = useState(startValue);

  useEffect(() => {
    let mounted = true;
    setValue(startValue);

    const nextDelay = () => 400 + Math.floor(Math.random() * 107);

    const nextDelta = () => {
      const r = Math.random();
      if (r < 0.6) return 1;
      if (r < 0.85) return 2 + Math.floor(Math.random() * 2);
      if (r < 0.95) return 4 + Math.floor(Math.random() * 4);
      return 8 + Math.floor(Math.random() * 10);
    };

    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!mounted) return;
      setValue((v) => v + nextDelta());
      timer = setTimeout(tick, nextDelay());
    };

    timer = setTimeout(tick, nextDelay());

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [startValue]);

  return value;
}

export default function HomeClient() {
  const router = useRouter();
  const searchCount = useSessionStore((s) => s.searchCount);
  const isVip = useSessionStore((s) => s.isVip);

  const okToSearch = useMemo(
    () => canSearch({ searchCount, isVip }),
    [searchCount, isVip],
  );

  const [step, setStep] = useState<"cta" | "input">("cta");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!okToSearch) {
      router.push("/cta");
      return;
    }

    const parsed = instagramUsernameSchema.safeParse(username);
    if (!parsed.success) {
      setError("Please enter a valid Instagram username.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(
        `/api/instagram?username=${encodeURIComponent(parsed.data)}`,
      );
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("API /api/instagram failed:", res.status, body);
        throw new Error("request_failed");
      }
      router.push(`/analysis?username=${encodeURIComponent(parsed.data)}`);
    } catch {
      setError("We couldn't run the lookup right now. Please try again soon.");
    } finally {
      setBusy(false);
    }
  }

  const todayCountBase = 81705;
  const liveCount = useLiveCounter(todayCountBase);

  const titleSegments = useMemo<Seg[]>(
    () => [
      { text: "What does your " },
      {
        text: "partner",
        className:
          "bg-linear-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent",
      },
      { text: " do when they're on Instagram?" },
    ],
    [],
  );

  const subtitleSegments = useMemo<Seg[]>(
    () => [
      { text: "Discover the truth about " },
      { text: "anyone", className: "font-bold text-white" },
      { text: " by accessing their Instagram activity." },
    ],
    [],
  );

  const titleTotal = useMemo(
    () => titleSegments.reduce((acc, s) => acc + s.text.length, 0),
    [titleSegments],
  );

  const subtitleTotal = useMemo(
    () => subtitleSegments.reduce((acc, s) => acc + s.text.length, 0),
    [subtitleSegments],
  );

  const titleCount = useTypewriter(titleTotal, { startDelayMs: 200 });

  const [subtitleEnabled, setSubtitleEnabled] = useState(false);

  useEffect(() => {
    if (titleCount >= titleTotal) setSubtitleEnabled(true);
  }, [titleCount, titleTotal]);

  const subtitleCount = useTypewriter(subtitleTotal, {
    enabled: subtitleEnabled,
    startDelayMs: 120,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <MatrixCanvas opacity={0.3} />
      <div className="pointer-events-none absolute inset-0 opacity-70 mask-[radial-gradient(ellipse_at_center,rgba(0,0,0,1),rgba(0,0,0,0.25)_55%,rgba(0,0,0,0))]">
        <div className="matrix-bg absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.16),transparent_48%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-125 flex-col items-center justify-center px-6 py-10">
        <Card className="w-full rounded-3xl border-white/10 bg-black/55 py-2 backdrop-blur-xl opacity-75">
          <CardContent className="p-7 sm:p-8">
            <div className="mb-7 flex flex-col items-center justify-center gap-2">
              <div className="relative h-16 w-16">
                <Image
                  src="/assets/logo-vert-transparente.png"
                  alt="Monitex"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <span className="font-black tracking-widest text-xl text-white/80">
                MONITEX.APP
              </span>
            </div>

            <h1 className="text-center text-3xl font-semibold leading-tight text-white drop-shadow-[0_2px_12px_rgba(124,58,237,0.35)] sm:text-[38px]">
              <TypedText
                segments={titleSegments}
                count={titleCount}
                showCaret={titleCount < titleTotal}
              />
            </h1>

            <p className="mx-auto mt-4 max-w-[30ch] text-center text-sm leading-relaxed text-white/70 sm:text-[18px]">
              <TypedText
                segments={subtitleSegments}
                count={subtitleCount}
                showCaret={subtitleEnabled && subtitleCount < subtitleTotal}
                caretClassName="ml-1 inline-block w-[0.5ch] animate-pulse text-white/50"
              />
            </p>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3">
              {!okToSearch ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  You've already used the free lookup on this device. If you
                  continue, you'll be redirected to plan.
                </div>
              ) : null}

              {step === "cta" ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => setStep("input")}
                  className="group mt-1 h-15 w-full cursor-pointer rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-xl font-semibold shadow-[0_18px_60px_rgba(124,58,237,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(124,58,237,0.45)]"
                >
                  <span className="mr-2 inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <EyeIconAnimated className="size-6 text-white/95" />
                  </span>
                  Spy now
                </Button>
              ) : (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="grid gap-2">
                    <label
                      className="text-xs font-medium text-white/75"
                      htmlFor="ig-username"
                    >
                      Instagram username
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45">
                        @
                      </span>

                      <Input
                        id="ig-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        inputMode="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="h-11 border-white/10 bg-white/5 pl-8 text-white placeholder:text-white/35 focus-visible:ring-violet-500/40"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error ? (
                    <p className="text-sm text-red-400">{error}</p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={busy}
                    className="group h-12 w-full cursor-pointer rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-base font-semibold shadow-[0_18px_60px_rgba(124,58,237,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(124,58,237,0.45)]"
                  >
                    {busy ? "Checking..." : "Analyze profile"}
                  </Button>
                </div>
              )}
              <div className="mt-8 grid grid-cols-3 items-start justify-items-center gap-10 text-[12px] text-white/70">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Lock size={16} weight="bold" className="text-violet-400" />
                  <div className="leading-[1.05]">
                    <div>100%</div>
                    <div>Anonymous</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                  <Key size={16} weight="bold" className="text-violet-400" />
                  <div className="leading-[1.05]">No password</div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                  <CheckCircle
                    size={16}
                    weight="bold"
                    className="text-violet-400"
                  />
                  <div className="leading-[1.05]">Free trial</div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-3 text-center text-xs text-violet-300/80 tabular-nums">
          +{liveCount.toLocaleString("en-US")} profiles analyzed today
        </p>
      </div>
    </main>
  );
}
