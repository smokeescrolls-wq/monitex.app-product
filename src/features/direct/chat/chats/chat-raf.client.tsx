"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video, EyeOff, Lock } from "lucide-react";
import type { DirectConversation } from "@/features/direct/direct.utils";
import { proxyImage } from "@/features/direct/direct.utils";
import { AvatarCircle } from "@/features/direct/components/avatar-circle";
import { PaywallModal } from "@/features/direct/components/paywall-modal";

type Props = { username: string; convo: DirectConversation };

type Msg =
  | { id: string; kind: "time"; text: string }
  | { id: string; kind: "meText"; text: string }
  | { id: string; kind: "otherText"; text: string; showAvatar?: boolean }
  | {
      id: string;
      kind: "video";
      state: "normal" | "missed" | "ended";
      timeLabel: string;
      durationLabel?: string;
    }
  | { id: string; kind: "media"; fromMe?: boolean; src?: string };

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

function CallCard({
  state,
  timeLabel,
  durationLabel,
  onClick,
}: {
  state: "normal" | "missed" | "ended";
  timeLabel: string;
  durationLabel?: string;
  onClick: () => void;
}) {
  const title =
    state === "missed"
      ? "Video call missed"
      : state === "ended"
        ? "Video call ended"
        : "Video call";

  const iconBg = state === "missed" ? "bg-red-500/15" : "bg-white/10";
  const iconBorder =
    state === "missed" ? "border-red-500/30" : "border-white/10";

  return (
    <div className="w-full">
      <button
        onClick={onClick}
        className="w-[270px] max-w-[92%] rounded-2xl bg-[#1a1a1d] border border-white/10 px-4 py-3 text-left cursor-pointer hover:bg-[#2a2a2d] transition-colors relative group"
        type="button"
      >
        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10">
          <Lock className="w-3 h-3 text-white/70" />
        </div>

        <div className="flex items-center justify-between gap-4 opacity-60">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-white/90">
              {title}
            </div>
            <div className="mt-0.5 text-[11px] text-white/55">{timeLabel}</div>

            {state === "missed" ? (
              <div className="mt-2">
                <div className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-semibold text-white/85">
                  Call back
                </div>
              </div>
            ) : durationLabel ? (
              <div className="mt-2 text-[11px] text-white/55">
                {durationLabel}
              </div>
            ) : null}
          </div>

          <div
            className={[
              "w-10 h-10 rounded-2xl border grid place-items-center shrink-0",
              iconBg,
              iconBorder,
            ].join(" ")}
          >
            <Video className="w-5 h-5 text-white/85" />
          </div>
        </div>
      </button>
    </div>
  );
}

function MediaItem({
  fromMe,
  src,
  onClick,
}: {
  fromMe?: boolean;
  src?: string;
  onClick: () => void;
}) {
  const classWrap = fromMe ? "ml-auto" : "";
  const fallback = "/placeholder-avatar.png";

  return (
    <button
      onClick={onClick}
      className={[
        "relative",
        "w-[150px] h-[210px]",
        "rounded-2xl overflow-hidden",
        "border border-white/10",
        "bg-[#0f1013]",
        "cursor-pointer group",
        classWrap,
      ].join(" ")}
      type="button"
    >
      <img
        src={src || fallback}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
        draggable={false}
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="bg-black/60 rounded-full p-3 mb-4 backdrop-blur-sm">
          <EyeOff className="w-8 h-8 text-white/90" />
        </div>
        <div className="text-center">
          <div className="text-[14px] text-white/90 font-semibold mb-1">
            Locked Media
          </div>
          <div className="text-[12px] text-white/70">Click to view</div>
        </div>
      </div>
    </button>
  );
}

export default function ChatRafClient({ username, convo }: Props) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [extraOldVisible, setExtraOldVisible] = useState(false);

  const avatarSrc = useMemo(
    () => proxyImage(convo.avatarUrl),
    [convo.avatarUrl],
  );

  const goBack = () =>
    router.push(`/direct?username=${encodeURIComponent(username || "user")}`);

  // neutral paths
  const mediaList = useMemo(
    () => [
      "/user-midias-fake/locked-media-1.jpg",
      "/user-midias-fake/locked-media-2.jpg",
      "/user-midias-fake/locked-media-3.jpg",
      "/user-midias-fake/locked-media-4.jpg",
    ],
    [],
  );

  const messages: Msg[] = [
    { id: "t1", kind: "time", text: "3 DAYS AGO, 22:47" },

    {
      id: "c1",
      kind: "video",
      state: "normal",
      timeLabel: "15:17",
      durationLabel: "01:43",
    },
    { id: "c2", kind: "video", state: "missed", timeLabel: "15:18" },

    { id: "m1", kind: "meText", text: "Connection is bad" },
    { id: "m2", kind: "meText", text: "I'm on 4G" },
    { id: "m3", kind: "meText", text: "Call again" },

    {
      id: "c3",
      kind: "video",
      state: "normal",
      timeLabel: "15:19",
      durationLabel: "03:12",
    },
    {
      id: "c4",
      kind: "video",
      state: "ended",
      timeLabel: "13:33",
      durationLabel: "01:55",
    },

    { id: "m4", kind: "meText", text: "Okay" },
    { id: "m5", kind: "meText", text: "😵‍💫" },

    { id: "o1", kind: "otherText", text: "Look at this…" },

    { id: "im1", kind: "media", src: mediaList[0] },

    { id: "o2", kind: "otherText", text: "lol", showAvatar: false },

    { id: "m6", kind: "meText", text: "Wow" },
    { id: "m7", kind: "meText", text: "That's intense" },

    { id: "o3", kind: "otherText", text: "Send more", showAvatar: true },

    { id: "im2", kind: "media", fromMe: true, src: mediaList[1] },
    { id: "im3", kind: "media", fromMe: true, src: mediaList[2] },
    { id: "im4", kind: "media", fromMe: true, src: mediaList[3] },

    { id: "o4", kind: "otherText", text: "You asked for 1, got 3" },
    {
      id: "o5",
      kind: "otherText",
      text: "That's why I trust you",
      showAvatar: false,
    },

    { id: "m8", kind: "meText", text: "I need to go now" },
  ];

  const oldMessages: Msg[] = [
    { id: "ot1", kind: "time", text: "1 WEEK AGO" },
    { id: "oo1", kind: "otherText", text: "Hi" },
    { id: "om1", kind: "meText", text: "Hi" },
    {
      id: "oo2",
      kind: "otherText",
      text: "Can we talk later?",
      showAvatar: false,
    },
    { id: "om2", kind: "meText", text: "Sure" },
  ];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop <= 90 && !extraOldVisible) setExtraOldVisible(true);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll as any);
  }, [extraOldVisible]);

  // ---- PAYWALL ----
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallCtx, setPaywallCtx] = useState<string>("");

  const CTA_URL = "/cta";

  const openPaywall = useCallback((ctx: string) => {
    setPaywallCtx(ctx);
    setPaywallOpen(true);
  }, []);

  const paywallTitle = useMemo(() => {
    if (paywallCtx === "profile") return "Profile locked";
    if (paywallCtx === "call") return "Call locked";
    if (paywallCtx === "video") return "Video call locked";
    if (paywallCtx.startsWith("media:")) return "Media locked";
    if (paywallCtx.startsWith("videocall:")) return "Call locked";
    if (paywallCtx === "input") return "Chat locked";
    return "Action locked";
  }, [paywallCtx]);

  const paywallDesc = useMemo(() => {
    return "To unlock this action, VIP access is required.";
  }, []);

  const handleMediaClick = (src: string, fromMe?: boolean) => {
    openPaywall(`media:${fromMe ? "me" : "other"}`);
  };

  const handleVideoCallClick = (
    state: "normal" | "missed" | "ended",
    timeLabel: string,
  ) => {
    openPaywall(`videocall:${state}:${timeLabel}`);
  };

  const handleProfileClick = () => openPaywall("profile");
  const handleCallClick = () => openPaywall("call");
  const handleVideoClick = () => openPaywall("video");
  // -----------------

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 flex flex-col overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onGoVip={() => router.push(CTA_URL)}
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
                  blur={false}
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
            {extraOldVisible &&
              oldMessages.map((m) => {
                if (m.kind === "time")
                  return <TimeLabel key={m.id} text={m.text} />;
                if (m.kind === "meText")
                  return <BubbleMe key={m.id} text={m.text} />;
                if (m.kind === "otherText")
                  return <BubbleOther key={m.id} text={m.text} />;
                return null;
              })}

            {messages.map((m) => {
              if (m.kind === "time")
                return <TimeLabel key={m.id} text={m.text} />;

              if (m.kind === "video") {
                return (
                  <div key={m.id} className="flex">
                    <CallCard
                      state={m.state}
                      timeLabel={m.timeLabel}
                      durationLabel={m.durationLabel}
                      onClick={() => handleVideoCallClick(m.state, m.timeLabel)}
                    />
                  </div>
                );
              }

              if (m.kind === "meText")
                return <BubbleMe key={m.id} text={m.text} />;

              if (m.kind === "otherText") {
                return (
                  <div key={m.id} className="flex items-end gap-2">
                    <div className="w-7" />
                    <BubbleOther text={m.text} />
                  </div>
                );
              }

              return (
                <div key={m.id} className="flex">
                  <MediaItem
                    fromMe={m.fromMe}
                    src={m.src}
                    onClick={() => handleMediaClick(m.src || "", m.fromMe)}
                  />
                </div>
              );
            })}
          </div>

          <div className="h-28" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/90 border-t border-gray-800/40">
          <button
            className="w-full h-12 rounded-2xl bg-[#1f1f22] border border-white/10 text-white/55 text-left px-4 cursor-pointer relative group"
            type="button"
            onClick={() => openPaywall("input")}
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
