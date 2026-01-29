"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Phone, Video, EyeOff, Lock } from "lucide-react";
import type { DirectConversation } from "@/features/direct/direct.utils";
import { proxyImage } from "@/features/direct/direct.utils";
import { PaywallModal } from "@/features/direct/components/paywall-modal";

type Props = {
  username: string;
  convo: DirectConversation;
};

type Msg =
  | { id: string; kind: "time"; text: string }
  | {
      id: string;
      kind: "otherText";
      text: string;
      showAvatar?: boolean;
      reaction?: string;
    }
  | {
      id: string;
      kind: "meText";
      text: string;
      reaction?: string;
      reply?: { label: string; text: string };
    }
  | {
      id: string;
      kind: "otherImage";
      src: string;
      showAvatar?: boolean;
      reaction?: string;
    }
  | { id: string; kind: "meAudio"; duration: string }
  | {
      id: string;
      kind: "otherAudioLocked";
      duration: string;
      showAvatar?: boolean;
    };

function ImageCard({
  src,
  onClick,
  blur = true,
}: {
  src: string;
  onClick: () => void;
  blur?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[132px] h-[210px] rounded-2xl overflow-hidden border border-white/10 bg-[#111113] relative cursor-pointer group"
      type="button"
    >
      <Image
        src={src}
        alt="Image"
        fill
        className={`object-cover ${blur ? "blur-lg scale-110" : ""}`}
        sizes="132px"
        unoptimized
      />
      {blur && (
        <>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/70 rounded-full p-2 backdrop-blur-sm">
              <EyeOff className="w-5 h-5 text-white/90" />
            </div>
          </div>
        </>
      )}
    </button>
  );
}

function AudioCardDark({
  duration,
  onClick,
  locked = true,
}: {
  duration: string;
  onClick: () => void;
  locked?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-[86%] sm:w-[78%] rounded-2xl ${
        locked ? "bg-[#1a1a1d]" : "bg-[#1f1f22]"
      } border border-white/10 px-4 py-3 text-left ${
        locked ? "text-white/50" : "text-white/90"
      } cursor-pointer hover:bg-[#2a2a2d] transition-colors relative group`}
      type="button"
    >
      {locked && (
        <>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
            <Lock className="w-3 h-3 text-white/70" />
          </div>
        </>
      )}

      <div className={`flex items-center gap-3 ${locked ? "opacity-60" : ""}`}>
        <div
          className={`w-10 h-10 rounded-full ${
            locked ? "bg-white/5" : "bg-white/10"
          } flex items-center justify-center shrink-0`}
        >
          <div
            className={`w-0 h-0 border-y-[7px] border-y-transparent ${
              locked
                ? "border-l-[12px] border-l-white/40"
                : "border-l-[12px] border-l-white/85"
            } ml-0.5`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[2px] h-6">
            {Array.from({ length: 42 }).map((_, idx) => {
              const t = (idx + 6) % 10;
              const heights = [7, 11, 17, 23, 15, 27, 19, 13, 21, 16];
              const h = locked ? Math.max(3, heights[t] * 0.4) : heights[t];
              return (
                <span
                  key={idx}
                  className={`w-[3px] rounded-full ${
                    locked ? "bg-white/40" : "bg-white/90"
                  }`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px]">
            <span className={locked ? "text-white/50" : "text-white/70"}>
              {locked ? "Locked audio" : "Audio"}
            </span>
            <span
              className={`tabular-nums ${
                locked ? "text-white/40" : "text-white/70"
              }`}
            >
              {duration}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function AudioCardPurple({
  duration,
  onClick,
}: {
  duration: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="ml-auto w-[86%] sm:w-[78%] rounded-2xl bg-[#6e4ef2] px-4 py-3 text-left text-white shadow-[0_12px_40px_rgba(110,78,242,0.25)] cursor-pointer hover:bg-[#7a5df5] transition-colors relative group"
      type="button"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/95 ml-0.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[2px] h-6">
            {Array.from({ length: 42 }).map((_, idx) => {
              const t = (idx + 3) % 10;
              const heights = [7, 11, 17, 23, 15, 27, 19, 13, 21, 16];
              const h = heights[t];
              return (
                <span
                  key={idx}
                  className="w-[3px] rounded-full bg-white/90"
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-white/90">
            <span>Your audio</span>
            <span className="tabular-nums">{duration}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ChatJoClient({ username, convo }: Props) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const avatarSrc = useMemo(
    () => proxyImage(convo.avatarUrl),
    [convo.avatarUrl],
  );

  const goBack = () =>
    router.push(`/direct?username=${encodeURIComponent(username)}`);

  const city = "home";
  const media1 = "/chat/home.jpg";

  // ---- PAYWALL ----
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
    if (paywallCtx.startsWith("image:")) return "Image locked";
    if (paywallCtx.startsWith("audio:")) return "Audio locked";
    if (paywallCtx === "input") return "Chat locked";
    return "Action locked";
  }, [paywallCtx]);

  const paywallDesc = useMemo(() => {
    return "To unlock this action, VIP access is required.";
  }, []);
  // -----------------

  const baseMessages: Msg[] = [
    { id: "t1", kind: "time", text: "SAT, 11:12" },
    { id: "o1", kind: "otherText", text: "Hey love." },
    { id: "m1", kind: "meText", text: "Hey babe." },
    { id: "m2", kind: "meText", text: "Miss you." },
    { id: "o2", kind: "otherText", text: "Me too.", showAvatar: false },
    {
      id: "img1",
      kind: "otherImage",
      src: media1,
      reaction: "❤️",
      showAvatar: false,
    },
    { id: "o3", kind: "otherText", text: "This?", showAvatar: false },
    { id: "m3", kind: "meText", text: "😍😍😍😍😍" },
    {
      id: "o4",
      kind: "otherText",
      text: "Did you like it?",
      showAvatar: false,
    },
    { id: "a1", kind: "otherAudioLocked", duration: "0:11", showAvatar: false },
    { id: "o5", kind: "otherText", text: `Tell her it DOES exist in ${city}.` },
    {
      id: "m4",
      kind: "meText",
      text: "Alright. Tomorrow or the day after.",
      reaction: "👍🏻",
    },
    { id: "t2", kind: "time", text: "YESTERDAY, 21:34" },
    { id: "o7", kind: "otherText", text: "Can you talk?" },
    {
      id: "m5",
      kind: "meText",
      text: "Hey",
      reply: { label: "You replied", text: "Love" },
    },
    {
      id: "o8",
      kind: "otherText",
      text: "Wait — someone is right next to me.",
      showAvatar: false,
    },
    { id: "m6", kind: "meText", text: "lol" },
    {
      id: "o9",
      kind: "otherText",
      text: "😂😂😂",
      showAvatar: false,
      reaction: "😂",
    },
    {
      id: "o10",
      kind: "otherText",
      text: `I'm already in ${city}. Just letting you know ❤️`,
      showAvatar: false,
      reaction: "❤️",
    },
    { id: "o11", kind: "otherText", text: "❤️", showAvatar: false },
    { id: "m7", kind: "meText", text: "Where are you?" },
    { id: "m8", kind: "meText", text: "At your cousin's?" },
    { id: "o13", kind: "otherText", text: "At home" },
    { id: "m9", kind: "meText", text: "Okay 😘" },
    {
      id: "m10",
      kind: "meText",
      text: "I'll stop by, alright?",
      reaction: "❤️",
    },
    { id: "t3", kind: "time", text: "TODAY, 15:22" },
    { id: "a2", kind: "otherAudioLocked", duration: "0:32" },
    { id: "a3", kind: "otherAudioLocked", duration: "0:07", showAvatar: false },
    { id: "m11", kind: "meText", text: "Got it." },
    { id: "me-audio", kind: "meAudio", duration: "0:11" },
    { id: "t4", kind: "time", text: "16:53" },
    { id: "o15", kind: "otherText", text: "You forgot something." },
  ];

  const handleAudioClick = (duration: string, isMe: boolean) => {
    openPaywall(`audio:${isMe ? "me" : "other"}:${duration}`);
  };

  const handleImageClick = (src: string) => {
    openPaywall(`image:${src}`);
  };

  const handleProfileClick = () => openPaywall("profile");
  const handleCallClick = () => openPaywall("call");
  const handleVideoClick = () => openPaywall("video");

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
              <div className="w-7">
                <button
                  onClick={handleProfileClick}
                  className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 cursor-pointer group"
                  type="button"
                >
                  <Image
                    src={avatarSrc}
                    alt="Avatar"
                    fill
                    className="object-cover blur-md"
                    sizes="24px"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <EyeOff className="w-3 h-3 text-white/90" />
                  </div>
                </button>
              </div>

              <div className="leading-tight">
                <div className="text-[14px] font-semibold">
                  {convo.maskedTitle}
                </div>
                <div className="text-[11px] text-white/55">Online</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCallClick}
              aria-label="Call"
              className="cursor-pointer hover:opacity-80 transition-opacity relative group"
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
              className="cursor-pointer hover:opacity-80 transition-opacity relative group"
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
          <div className="flex flex-col gap-2">
            {baseMessages.map((m) => {
              if (m.kind === "time") {
                return (
                  <div
                    key={m.id}
                    className="w-full flex items-center justify-center py-3"
                  >
                    <span className="text-[10px] uppercase tracking-wide text-white/35">
                      {m.text}
                    </span>
                  </div>
                );
              }

              if (m.kind === "otherText") {
                return (
                  <div key={m.id} className="flex items-end gap-2">
                    <div className="w-7">
                      {m.showAvatar !== false ? (
                        <button
                          onClick={handleProfileClick}
                          className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 cursor-pointer group"
                          type="button"
                        >
                          <Image
                            src={avatarSrc}
                            alt=""
                            fill
                            className="object-cover blur-md"
                            sizes="24px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <EyeOff className="w-3 h-3 text-white/90" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-7" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="max-w-[86%] sm:max-w-[78%] rounded-2xl rounded-tl-md bg-[#1f1f22] px-3 py-2 text-[13px] text-white/90 whitespace-pre-wrap break-words">
                        {m.text}
                      </div>
                      {m.reaction ? (
                        <div>
                          <span className="inline-flex items-center rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-[11px] text-white/90">
                            {m.reaction}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              }

              if (m.kind === "meText") {
                return (
                  <div key={m.id} className="flex flex-col items-end gap-1">
                    <div className="ml-auto max-w-[86%] sm:max-w-[78%]">
                      <div className="rounded-2xl rounded-tr-md bg-[#6e4ef2] px-3 py-2 text-[13px] text-white whitespace-pre-wrap break-words">
                        {m.reply ? (
                          <div className="mb-2 rounded-xl bg-black/25 border border-white/10 px-3 py-2">
                            <div className="text-[10px] text-white/60">
                              {m.reply.label}
                            </div>
                            <div className="text-[12px] text-white/80 truncate">
                              {m.reply.text}
                            </div>
                          </div>
                        ) : null}
                        {m.text}
                      </div>
                    </div>

                    {m.reaction ? (
                      <div className="ml-auto">
                        <span className="inline-flex items-center rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-[11px] text-white/90">
                          {m.reaction}
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              }

              if (m.kind === "otherImage") {
                return (
                  <div key={m.id} className="flex items-end gap-2">
                    <div className="w-7">
                      {m.showAvatar !== false ? (
                        <button
                          onClick={handleProfileClick}
                          className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 cursor-pointer group"
                          type="button"
                        >
                          <Image
                            src={avatarSrc}
                            alt=""
                            fill
                            className="object-cover blur-md"
                            sizes="24px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <EyeOff className="w-3 h-3 text-white/90" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-7" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <ImageCard
                        src={m.src}
                        onClick={() => handleImageClick(m.src)}
                        blur
                      />
                      {m.reaction ? (
                        <div>
                          <span className="inline-flex items-center rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-[11px] text-white/90">
                            {m.reaction}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              }

              if (m.kind === "otherAudioLocked") {
                return (
                  <div key={m.id} className="flex items-end gap-2">
                    <div className="w-7">
                      {m.showAvatar !== false ? (
                        <button
                          onClick={handleProfileClick}
                          className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 cursor-pointer group"
                          type="button"
                        >
                          <Image
                            src={avatarSrc}
                            alt=""
                            fill
                            className="object-cover blur-md"
                            sizes="24px"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <EyeOff className="w-3 h-3 text-white/90" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-7" />
                      )}
                    </div>

                    <AudioCardDark
                      duration={m.duration}
                      onClick={() => handleAudioClick(m.duration, false)}
                      locked
                    />
                  </div>
                );
              }

              return (
                <div key={m.id} className="flex flex-col items-end gap-2">
                  <AudioCardPurple
                    duration={m.duration}
                    onClick={() => handleAudioClick(m.duration, true)}
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
