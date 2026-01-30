"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Clock3, Zap } from "lucide-react";

function formatMMSS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

type Props = {
  username: string;
  profilePicUrl?: string;
  ctaUrl?: string;
  storageKey?: string;
  durationSeconds?: number;
};

function SpinnerRing({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-flex w-4 h-4 rounded-full",
        "border border-white/20 border-t-white/80",
        "animate-spin",
        className,
      ].join(" ")}
    />
  );
}

export function PreviewUpgradeCard({
  username,
  profilePicUrl,
  ctaUrl = "/cta",
  storageKey = "stalkeaPreviewEndsAt",
  durationSeconds = 10 * 60,
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

  const avatarSrc = useMemo(() => {
    if (!profilePicUrl) return "/placeholder-avatar.png";
    return profilePicUrl.startsWith("/api/image-proxy?url=")
      ? profilePicUrl
      : `/api/image-proxy?url=${encodeURIComponent(profilePicUrl)}`;
  }, [profilePicUrl]);

  const handleUpgrade = () => {
    const u = (username || "").trim() || "user";

    try {
      sessionStorage.setItem(
        "stalkeaCtaProfile",
        JSON.stringify({ username: u, profile_pic_url: profilePicUrl ?? "" }),
      );
    } catch {}

    const qs = new URLSearchParams();
    qs.set("username", u);
    qs.set("ts", String(Date.now()));

    window.location.assign(`${ctaUrl}?${qs.toString()}`);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f14] via-[#12101b] to-[#0e0c16] shadow-[0_18px_70px_rgba(124,58,237,0.25)]">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* LEFT */}
          <div className="min-w-0 flex-1">
            {/* top row */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>

              <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                <span className="text-white font-semibold text-[13px] truncate">
                  Preview available
                </span>

                <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-white/80">
                  <Clock3 className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{timeLabel}</span>
                  <SpinnerRing className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 min-w-0 pl-[7px]">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                <Image
                  src={avatarSrc}
                  alt=""
                  fill
                  sizes="24px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <div className="text-[12px] text-white/85 truncate leading-tight">
                  @{username || "user"}
                </div>
                <div className="text-[11px] text-white/55 leading-snug">
                  Unlock all features and permanent access with VIP.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <button
            type="button"
            onClick={handleUpgrade}
            className="shrink-0 rounded-full cursor-pointer bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.99] transition px-4 py-2 text-xs font-bold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)]"
          >
            Become VIP
          </button>
        </div>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-70" />
    </div>
  );
}
