"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangleIcon, ChevronRight, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MatrixCanvas } from "@/components/matrix-canvas";
import { canSearch, useSessionStore } from "@/features/session/session.store";
import { instagramUsernameSchema } from "@/features/instagram/instagram.schemas";
import type { InstagramProfileResponse } from "@/features/instagram/instagram.types";

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function useLiveCounter(startValue: number) {
  const [value, setValue] = useState(startValue);

  useEffect(() => {
    let mounted = true;
    setValue(startValue);

    const nextDelay = () => 450 + Math.floor(Math.random() * 950);

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

export default function AnalysisClient() {
  const router = useRouter();
  const params = useSearchParams();
  const usernameRaw = params.get("username") ?? "";

  const searchCount = useSessionStore((s) => s.searchCount);
  const isVip = useSessionStore((s) => s.isVip);
  const consumeSearch = useSessionStore((s) => s.consumeSearch);
  const startAccess = useSessionStore((s) => s.startAccess);

  const okToSearch = useMemo(
    () => canSearch({ searchCount, isVip }),
    [searchCount, isVip],
  );

  const [data, setData] = useState<InstagramProfileResponse | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsed = instagramUsernameSchema.safeParse(usernameRaw);
    if (!parsed.success) {
      setError("Invalid username.");
      setBusy(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/instagram?username=${encodeURIComponent(parsed.data)}`,
        );
        const text = await res.text().catch(() => "");
        if (!res.ok) throw new Error(text || "request_failed");
        const json = JSON.parse(text) as InstagramProfileResponse;
        if (cancelled) return;
        setData(json);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to load data.";
        setError(
          msg.includes("Acesso negado") ||
            msg.toLowerCase().includes("access denied")
            ? "Service unavailable right now. Please try again."
            : "Failed to load data.",
        );
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [usernameRaw]);

  function onConfirm() {
    const parsed = instagramUsernameSchema.safeParse(usernameRaw);
    if (!parsed.success) {
      router.push("/");
      return;
    }

    if (!okToSearch) {
      router.push("/plans");
      return;
    }

    consumeSearch(parsed.data);
    startAccess();
    router.push(`/instagram-login?username=${encodeURIComponent(parsed.data)}`);
  }

  const todayCountBase = 268588;
  const liveCount = useLiveCounter(todayCountBase);

  const weekdayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date(),
    );
  }, []);

  const neonSoft = "drop-shadow-[0_0_10px_rgba(124,77,255,0.22)]";

  const p = data?.data?.profileDetails;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B0E] text-white">
      <MatrixCanvas />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.14),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.12),transparent_48%)]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[500px]">
          <Card className="rounded-4xl border-white/10 bg-[#0F0F13]/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl opacity-85">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <h2 className="mb-3 text-3xl font-bold text-[#7C4DFF]">
                Confirmation
              </h2>

              <p className="mb-1 text-base text-white/80">
                Do you want to spy on the profile
              </p>
              <p className="mb-6 text-lg font-bold text-[#7C4DFF]">
                @{usernameRaw}?
              </p>

              {busy ? (
                <div className="mb-6 flex w-full items-center gap-6 px-4">
                  <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-[#2D2D33]" />
                  <div className="grid flex-1 grid-cols-3 gap-2 text-center">
                    {["posts", "followers", "following"].map((k) => (
                      <div key={k} className="flex flex-col items-center">
                        <div className="mb-1 h-6 w-10 animate-pulse rounded bg-[#2D2D33]" />
                        <p className="text-xs text-[#9A9AA6]">{k}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : error || !p ? (
                <div className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  {error ?? "Failed to load the profile."}
                </div>
              ) : (
                <div className="mb-6 flex w-full items-center gap-6 px-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#2D2D33] ring-2 ring-[#7C4DFF]/20">
                    {p.pictureUrl ? (
                      <img
                        src={`/api/image-proxy?url=${encodeURIComponent(p.pictureUrl)}`}
                        alt={p.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        <User className="h-10 w-10 text-[#52525C]" />
                      </div>
                    )}
                  </div>

                  <div className="grid flex-1 grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <p className="mb-1 text-xl font-bold leading-none text-white tabular-nums">
                        {formatNumber(p.postsCount)}
                      </p>
                      <p className="text-xs font-medium text-white/65">posts</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="mb-1 text-xl font-bold leading-none text-white tabular-nums">
                        {formatNumber(p.followersCount)}
                      </p>
                      <p className="text-xs font-medium text-white/65">
                        followers
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="mb-1 text-xl font-bold leading-none text-white tabular-nums">
                        {formatNumber(p.followsCount)}
                      </p>
                      <p className="text-xs font-medium text-white/65">
                        following
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-5 w-full px-4 text-left text-sm text-white/85">
                {p?.biography ? (
                  <p className="whitespace-pre-line break-words leading-relaxed">
                    {p.biography}
                  </p>
                ) : null}
              </div>

              <div className="mb-8 w-full rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-left">
                <div className="flex items-start gap-2 text-[11px] leading-[1.6] text-red-200/90">
                  <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-center">
                    <span className="font-bold text-red-300">Warning:</span>{" "}
                    Only 1 search per device. Make sure you typed the username
                    correctly.
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-3 px-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="
                    h-14 flex-1 rounded-xl
                    border border-violet-500/25 bg-white/[0.03]
                    text-sm font-bold text-white
                    shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                    transition-all duration-200
                    hover:border-violet-400/45 hover:bg-violet-500/10 hover:shadow-[0_14px_40px_rgba(124,77,255,0.18)]
                    active:translate-y-[1px] active:shadow-[0_6px_18px_rgba(0,0,0,0.35)] hover:text-white/70
                    focus-visible:ring-2 focus-visible:ring-violet-400/40 focus-visible:ring-offset-0 cursor-pointer
                  "
                >
                  Fix @
                </Button>

                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={busy || !p}
                  className="
                    h-14 flex-1 rounded-xl
                    bg-gradient-to-r from-violet-600 to-violet-500
                    text-sm font-bold text-white
                    shadow-[0_12px_36px_rgba(124,77,255,0.35)]
                    transition-all duration-200
                    hover:-translate-y-[1px] hover:shadow-[0_18px_48px_rgba(124,77,255,0.45)]
                    active:translate-y-[1px] active:shadow-[0_10px_30px_rgba(124,77,255,0.28)]
                    disabled:opacity-60 disabled:hover:translate-y-0
                    focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-0 cursor-pointer
                  "
                >
                  {okToSearch ? "Confirm and continue" : "View plans"}
                  <ChevronRight className="h-4 w-4 translate-y-px opacity-90" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p
              className={`text-xs font-bold tracking-wide text-violet-300/80 ${neonSoft}`}
            >
              <span className={`font-normal text-violet-300/80 ${neonSoft}`}>
                +{liveCount.toLocaleString("en-US")}
              </span>{" "}
              Profiles analyzed on {weekdayLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
