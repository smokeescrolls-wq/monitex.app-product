"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video } from "lucide-react";
import type { DirectConversation } from "@/features/direct/direct.utils";
import { proxyImage } from "@/features/direct/direct.utils";
import { AvatarCircle } from "@/features/direct/components/avatar-circle";

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

function AudioWave({ seed = 1 }: { seed?: number }) {
  const bars = useMemo(() => {
    const len = 44;
    return Array.from({ length: len }).map((_, i) => {
      const t = (i + seed) % 12;
      if (t === 0) return 6;
      if (t === 1) return 10;
      if (t === 2) return 16;
      if (t === 3) return 22;
      if (t === 4) return 14;
      if (t === 5) return 26;
      if (t === 6) return 18;
      if (t === 7) return 12;
      if (t === 8) return 20;
      if (t === 9) return 15;
      if (t === 10) return 24;
      return 11;
    });
  }, [seed]);

  return (
    <div className="flex items-center gap-[2px] h-6">
      {bars.map((h, idx) => (
        <span
          key={idx}
          className="w-[3px] rounded-full bg-white/90"
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
}: {
  fromMe: boolean;
  duration: string;
  onClick: () => void;
}) {
  const wrap = fromMe ? "ml-auto" : "";
  const bg = fromMe ? "bg-[#6e4ef2]" : "bg-[#1f1f22]";
  const text = fromMe ? "text-white/95" : "text-white/80";
  const border = fromMe ? "border-white/0" : "border-white/10";

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
      <div className="flex items-center gap-3">
        <div
          className={[
            "w-10 h-10 rounded-full",
            fromMe ? "bg-white/18" : "bg-white/10",
            "flex items-center justify-center shrink-0",
          ].join(" ")}
        >
          <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/90 ml-0.5" />
        </div>

        <div className="flex-1 min-w-0">
          <AudioWave seed={fromMe ? 9 : 6} />
          <div
            className={`mt-2 flex items-center justify-between text-[12px] ${text}`}
          >
            <span className="underline underline-offset-2">
              View transcript
            </span>
            <span className="tabular-nums">{duration}</span>
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

  const handleAudioClick = () => {
    console.log("Audio clicked - simulate playback");
    // Aqui você pode adicionar lógica de reprodução de áudio
  };

  const handleCallClick = () => {
    console.log("Call clicked");
  };

  const handleVideoClick = () => {
    console.log("Video clicked");
  };

  const handleMessageClick = () => {
    console.log("Message input clicked");
  };

  const goBack = () =>
    router.push(`/direct?username=${encodeURIComponent(username || "user")}`);

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
    { id: "a1", kind: "audio", fromMe: false, duration: "0:20" },
    { id: "a2", kind: "audio", fromMe: true, duration: "0:13" },
    { id: "a3", kind: "audio", fromMe: true, duration: "0:05" },
    { id: "t2", kind: "time", text: "TODAY, 15:22" },
    { id: "a4", kind: "audio", fromMe: true, duration: "4:25" },
    { id: "m2", kind: "meText", text: "Sorry for the outburst" },
    { id: "m3", kind: "meText", text: "But I don't know what to do" },
    { id: "a5", kind: "audio", fromMe: true, duration: "0:29" },
    { id: "t3", kind: "time", text: "YESTERDAY, 21:11" },
    { id: "a6", kind: "audio", fromMe: false, duration: "0:41" },
    { id: "a7", kind: "audio", fromMe: false, duration: "0:12" },
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
    { id: "oa1", kind: "audio", fromMe: false, duration: "0:18" },
    { id: "oa2", kind: "audio", fromMe: false, duration: "0:33" },
  ];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const nearTop = 90;

    const onScroll = () => {
      if (!el) return;

      if (!extraOldVisible && el.scrollTop <= nearTop) {
        setExtraOldVisible(true);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll as any);
  }, [extraOldVisible]);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 flex flex-col overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
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
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10">
                <AvatarCircle
                  src={avatarSrc}
                  alt=""
                  className="absolute inset-0"
                  imgClassName="w-full h-full object-cover"
                  blur
                />
              </div>

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
              className="cursor-pointer"
              type="button"
            >
              <Phone className="w-5.5 h-5.5" />
            </button>
            <button
              onClick={handleVideoClick}
              aria-label="Video"
              className="cursor-pointer"
              type="button"
            >
              <Video className="w-5.5 h-5.5" />
            </button>
          </div>
        </header>

        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
        >
          <div className="flex flex-col gap-3">
            {extraOldVisible ? (
              <>
                {oldMessages.map((m) => {
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
                        onClick={handleAudioClick}
                      />
                    </div>
                  );
                })}
              </>
            ) : null}

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
                    onClick={handleAudioClick}
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
            className="w-full h-12 rounded-2xl bg-[#1f1f22] border border-white/10 text-white/55 text-left px-4 cursor-pointer"
            type="button"
          >
            Message…
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
