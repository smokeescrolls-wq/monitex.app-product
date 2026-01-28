"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video } from "lucide-react";
import type { DirectConversation } from "@/features/direct/direct.utils";
import { proxyImage } from "@/features/direct/direct.utils";
import { AvatarCircle } from "@/features/direct/components/avatar-circle";

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
}: {
  state: "normal" | "missed" | "ended";
  timeLabel: string;
  durationLabel?: string;
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
      <div className="w-[270px] max-w-[92%] rounded-2xl bg-[#1f1f22] border border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
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
      </div>
    </div>
  );
}

function MediaItem({ fromMe, src }: { fromMe?: boolean; src?: string }) {
  const classWrap = fromMe ? "ml-auto" : "";
  const fallback = "/placeholder-avatar.png";

  return (
    <div
      className={[
        "relative",
        "w-[150px] h-[210px]",
        "rounded-2xl overflow-hidden",
        "border border-white/10",
        "bg-[#0f1013]",
        classWrap,
      ].join(" ")}
    >
      <img
        src={src || fallback}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
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

  const mediaList = useMemo(
    () => [
      "/user-midias-fake/nudes1-chat1.jpg",
      "/user-midias-fake/nudes1-chat2.jpg",
      "/user-midias-fake/nudes1-chat3.jpg",
      "/user-midias-fake/nudes1-chat-4.jpg",
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

    // mídia recebida (agora visível)
    { id: "im1", kind: "media", src: mediaList[0] },

    { id: "o2", kind: "otherText", text: "lol", showAvatar: false },

    { id: "m6", kind: "meText", text: "Wow" },
    { id: "m7", kind: "meText", text: "That's intense" },

    { id: "o3", kind: "otherText", text: "Send more", showAvatar: true },

    // pack enviado (3 mídias visíveis)
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

  // seção extra antiga (agora visível normalmente)
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

  // Mostra mensagens antigas quando chega no topo
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop <= 90 && !extraOldVisible) {
        setExtraOldVisible(true);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll as any);
  }, [extraOldVisible]);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 flex flex-col overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        {/* header igual IG */}
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
                  blur={false}
                />
              </div>

              <div className="leading-tight">
                <div className="text-[14px] font-semibold">
                  {convo.maskedTitle}
                </div>
                <div className="text-[11px] text-white/55">Online há 6 h</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button aria-label="Call" className="cursor-pointer" type="button">
              <Phone className="w-5.5 h-5.5" />
            </button>
            <button aria-label="Video" className="cursor-pointer" type="button">
              <Video className="w-5.5 h-5.5" />
            </button>
          </div>
        </header>

        {/* chat body */}
        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
        >
          <div className="flex flex-col gap-3">
            {/* Mensagens antigas - agora visíveis normalmente */}
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
                  <MediaItem fromMe={m.fromMe} src={m.src} />
                </div>
              );
            })}
          </div>

          <div className="h-28" />
        </div>

        {/* input fake */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/90 border-t border-gray-800/40">
          <button
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
