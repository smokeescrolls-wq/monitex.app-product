"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video, EyeOff, Lock } from "lucide-react";
import type { DirectConversation } from "@/features/direct/direct.utils";
import { proxyImage } from "@/features/direct/direct.utils";
import { AvatarCircle } from "@/features/direct/components/avatar-circle";
import { PaywallModal } from "@/features/direct/components/paywall-modal";

type Props = {
  username: string;
  convo: DirectConversation;
};

type Msg =
  | { id: string; kind: "time"; text: string }
  | { id: string; kind: "meText"; text: string }
  | { id: string; kind: "otherText"; text: string; showAvatar?: boolean }
  | {
      id: string;
      kind: "audio";
      fromMe: boolean;
      duration: string;
      locked?: boolean;
    };

function TimeLabel({ text }: { text: string }) {
  return (
    <div className="w-full flex items-center justify-center py-3">
      <span className="text-[10px] uppercase tracking-wide text-white/35">
        {text}
      </span>
    </div>
  );
}

function BubbleOther({ text }: { text: string }) {
  return (
    <div className="max-w-[92%] sm:max-w-[82%] rounded-2xl rounded-tl-md bg-[#1f1f22] px-3.5 py-2.5 text-[13px] text-white/90 whitespace-pre-wrap break-words">
      {text}
    </div>
  );
}

function BubbleMe({ text }: { text: string }) {
  return (
    <div className="ml-auto max-w-[92%] sm:max-w-[82%]">
      <div className="rounded-2xl rounded-tr-md bg-[#6e4ef2] px-3.5 py-2.5 text-[13px] text-white whitespace-pre-wrap break-words">
        {text}
      </div>
    </div>
  );
}

function AudioWave({
  seed = 1,
  locked = false,
}: {
  seed?: number;
  locked?: boolean;
}) {
  const bars = useMemo(() => {
    const len = 44;
    return Array.from({ length: len }).map((_, i) => {
      const t = (i + seed) % 12;
      const heights = [6, 10, 16, 22, 14, 26, 18, 12, 20, 15, 24, 11];
      return locked ? Math.max(2, heights[t] * 0.3) : heights[t];
    });
  }, [seed, locked]);

  return (
    <div className="flex items-center gap-[2px] h-6">
      {bars.map((h, idx) => (
        <span
          key={idx}
          className={`w-[3px] rounded-full ${
            locked ? "bg-white/40" : "bg-white/90"
          }`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function AudioCard({
  fromMe,
  duration,
  onClick,
  locked = true,
}: {
  fromMe: boolean;
  duration: string;
  onClick: () => void;
  locked?: boolean;
}) {
  const wrap = fromMe ? "ml-auto" : "";
  const bg = locked
    ? fromMe
      ? "bg-[#5537c2]"
      : "bg-[#1a1a1d]"
    : fromMe
      ? "bg-[#6e4ef2]"
      : "bg-[#1f1f22]";
  const text = locked
    ? fromMe
      ? "text-white/60"
      : "text-white/50"
    : fromMe
      ? "text-white/95"
      : "text-white/80";
  const border = locked
    ? "border-white/5"
    : fromMe
      ? "border-white/0"
      : "border-white/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative",
        "w-[92%] sm:w-[82%]",
        "rounded-2xl",
        "px-4 py-3",
        "border",
        border,
        bg,
        "text-left",
        "cursor-pointer",
        "transition",
        "active:scale-[0.99]",
        wrap,
      ].join(" ")}
    >
      {locked && (
        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10">
          <Lock className="w-3 h-3 text-white/70" />
        </div>
      )}

      <div className={`flex items-center gap-3 ${locked ? "opacity-60" : ""}`}>
        <div
          className={[
            "w-10 h-10 rounded-full",
            locked
              ? fromMe
                ? "bg-white/8"
                : "bg-white/5"
              : fromMe
                ? "bg-white/18"
                : "bg-white/10",
            "flex items-center justify-center shrink-0",
          ].join(" ")}
        >
          <div
            className={`w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] ${
              locked ? "border-l-white/50" : "border-l-white/90"
            } ml-0.5`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <AudioWave seed={fromMe ? 9 : 6} locked={locked} />
          <div
            className={`mt-2 flex items-center justify-between text-[12px] ${text}`}
          >
            <span
              className={`underline-offset-2 ${
                locked ? "text-white/50" : "underline"
              }`}
            >
              {locked ? "Locked transcript" : "View transcript"}
            </span>
            <span className={`tabular-nums ${locked ? "text-white/40" : ""}`}>
              {duration}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ChatAndClient({ username, convo }: Props) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [extraOldVisible, setExtraOldVisible] = useState(false);

  const avatarSrc = useMemo(
    () => proxyImage(convo.avatarUrl),
    [convo.avatarUrl],
  );

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallCtx, setPaywallCtx] = useState("");

  const CTA_URL = "/cta";

  const openPaywall = useCallback((ctx: string) => {
    setPaywallCtx(ctx);
    setPaywallOpen(true);
  }, []);

  const paywallTitle = useMemo(() => {
    if (paywallCtx === "profile") return "Profile locked";
    if (paywallCtx === "call") return "Call locked";
    if (paywallCtx === "video") return "Video call locked";
    if (paywallCtx.startsWith("audio:")) return "Audio locked";
    if (paywallCtx === "input") return "Chat locked";
    return "Action locked";
  }, [paywallCtx]);

  const paywallDesc = useMemo(
    () => "To unlock this action, VIP access is required.",
    [],
  );

  const handleAudioClick = (fromMe: boolean, duration: string) => {
    openPaywall(`audio:${fromMe ? "me" : "other"}:${duration}`);
  };

  const handleProfileClick = () => openPaywall("profile");
  const handleCallClick = () => openPaywall("call");
  const handleVideoClick = () => openPaywall("video");
  const handleMessageClick = () => openPaywall("input");

  const goBack = () =>
    router.push(`/direct?username=${encodeURIComponent(username || "user")}`);

  // ✅ FIX: sempre navega pra /cta com username (e salva profile pro CTA)
  const goVip = useCallback(() => {
    const u = (username || "").trim() || "user";

    try {
      sessionStorage.setItem(
        "stalkeaCtaProfile",
        JSON.stringify({
          username: u,
          profile_pic_url: convo?.avatarUrl ?? "",
        }),
      );
    } catch {}

    const qs = new URLSearchParams();
    qs.set("username", u);
    qs.set("ts", String(Date.now()));

    router.push(`${CTA_URL}?${qs.toString()}`);
  }, [router, username, convo?.avatarUrl]);

  const baseMessages: Msg[] = [
    { id: "t1", kind: "time", text: "MON, 09:31" },
    { id: "o1", kind: "otherText", text: "Good morning bb" },
    {
      id: "o2",
      kind: "otherText",
      text: "did it get better??",
      showAvatar: false,
    },
    { id: "m1", kind: "meText", text: "Cool, go ahead" },
    { id: "a1", kind: "audio", fromMe: false, duration: "0:20", locked: true },
    { id: "a2", kind: "audio", fromMe: true, duration: "0:13", locked: true },
    { id: "a3", kind: "audio", fromMe: true, duration: "0:05", locked: true },
    { id: "t2", kind: "time", text: "TODAY, 15:22" },
    { id: "a4", kind: "audio", fromMe: true, duration: "4:25", locked: true },
    { id: "m2", kind: "meText", text: "Sorry for the outburst" },
    { id: "m3", kind: "meText", text: "But I don't know what to do" },
    { id: "a5", kind: "audio", fromMe: true, duration: "0:29", locked: true },
    { id: "t3", kind: "time", text: "YESTERDAY, 21:11" },
    { id: "a6", kind: "audio", fromMe: false, duration: "0:41", locked: true },
    { id: "a7", kind: "audio", fromMe: false, duration: "0:12", locked: true },
    { id: "o3", kind: "otherText", text: "Don't worry", showAvatar: true },
  ];

  const oldMessages: Msg[] = [
    { id: "ot1", kind: "time", text: "1 WEEK AGO" },
    { id: "oo1", kind: "otherText", text: "You disappeared..." },
    { id: "om1", kind: "meText", text: "It was hectic here." },
    {
      id: "oo2",
      kind: "otherText",
      text: "Tell me later calmly.",
      showAvatar: false,
    },
    { id: "oa1", kind: "audio", fromMe: false, duration: "0:18", locked: true },
    { id: "oa2", kind: "audio", fromMe: false, duration: "0:33", locked: true },
  ];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const nearTop = 90;

    const onScroll = () => {
      if (!el) return;
      if (!extraOldVisible && el.scrollTop <= nearTop) setExtraOldVisible(true);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll as any);
  }, [extraOldVisible]);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 flex flex-col overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onGoVip={goVip}
          title={paywallTitle}
          description={paywallDesc}
        />

        <header className="flex items-center justify-between px-4 py-3 bg-black z-50 shrink-0 border-b border-gray-800/40">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              aria-label="Back"
              className="cursor-pointer"
              type="button"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleProfileClick}
                className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 cursor-pointer group"
                type="button"
              >
                <AvatarCircle
                  src={avatarSrc}
                  alt=""
                  className="absolute inset-0"
                  imgClassName="w-full h-full object-cover blur-md"
                  blur={true}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <EyeOff className="w-3.5 h-3.5 text-white/90" />
                </div>
              </button>

              <div className="leading-tight">
                <div className="text-[14px] font-semibold">
                  {convo.maskedTitle}
                </div>
                <div className="text-[11px] text-white/55">
                  Online 6 hours ago
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCallClick}
              aria-label="Call"
              className="cursor-pointer relative group"
              type="button"
            >
              <Phone className="w-5.5 h-5.5" />
              <div className="absolute -top-2 -right-2 bg-black/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Lock className="w-2.5 h-2.5 text-white/70" />
              </div>
            </button>

            <button
              onClick={handleVideoClick}
              aria-label="Video"
              className="cursor-pointer relative group"
              type="button"
            >
              <Video className="w-5.5 h-5.5" />
              <div className="absolute -top-2 -right-2 bg-black/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Lock className="w-2.5 h-2.5 text-white/70" />
              </div>
            </button>
          </div>
        </header>

        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
        >
          <div className="flex flex-col gap-3">
            {extraOldVisible
              ? oldMessages.map((m) => {
                  if (m.kind === "time")
                    return <TimeLabel key={m.id} text={m.text} />;

                  if (m.kind === "meText") {
                    return (
                      <div key={m.id} className="flex flex-col items-end gap-1">
                        <BubbleMe text={m.text} />
                      </div>
                    );
                  }

                  if (m.kind === "otherText") {
                    return (
                      <div key={m.id} className="flex items-end gap-2">
                        <div className="w-7" />
                        <BubbleOther text={m.text} />
                      </div>
                    );
                  }

                  return (
                    <div key={m.id} className="flex items-end gap-2">
                      <div className="w-7" />
                      <AudioCard
                        fromMe={m.fromMe}
                        duration={m.duration}
                        onClick={() => handleAudioClick(m.fromMe, m.duration)}
                        locked={m.locked ?? true}
                      />
                    </div>
                  );
                })
              : null}

            {baseMessages.map((m) => {
              if (m.kind === "time")
                return <TimeLabel key={m.id} text={m.text} />;

              if (m.kind === "meText") {
                return (
                  <div key={m.id} className="flex flex-col items-end gap-1">
                    <BubbleMe text={m.text} />
                  </div>
                );
              }

              if (m.kind === "otherText") {
                return (
                  <div key={m.id} className="flex items-end gap-2">
                    <div className="w-7" />
                    <BubbleOther text={m.text} />
                  </div>
                );
              }

              return (
                <div key={m.id} className="flex items-end gap-2">
                  <div className="w-7" />
                  <AudioCard
                    fromMe={m.fromMe}
                    duration={m.duration}
                    onClick={() => handleAudioClick(m.fromMe, m.duration)}
                    locked={m.locked ?? true}
                  />
                </div>
              );
            })}
          </div>

          <div className="h-28" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/90 border-t border-gray-800/40">
          <button
            onClick={handleMessageClick}
            className="w-full h-12 rounded-2xl bg-[#1f1f22] border border-white/10 text-white/55 text-left px-4 cursor-pointer relative group"
            type="button"
          >
            Message…
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-2xl">
              <div className="flex items-center gap-2 bg-black/70 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Lock className="w-3.5 h-3.5 text-white/80" />
                <span className="text-[12px] text-white/80">
                  Feature locked
                </span>
              </div>
            </div>
          </button>
        </div>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}
