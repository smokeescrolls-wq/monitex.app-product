"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Phone, Video, Play } from "lucide-react";
import type { DirectConversation } from "@/features/direct/direct.utils";
import { proxyImage } from "@/features/direct/direct.utils";

type Props = {
  username: string;
  convo: DirectConversation;
};

type Msg =
  | { id: string; kind: "time"; text: string }
  | { id: string; kind: "unread"; text?: string }
  | { id: string; kind: "meText"; text: string }
  | {
      id: string;
      kind: "story";
      storySrc: string;
      avatarSrc: string;
      handle: string;
      fromMe?: boolean;
      reaction?: string;
      showAvatar?: boolean;
    }
  | {
      id: string;
      kind: "audio";
      duration: string;
      showAvatar?: boolean;
      reaction?: string;
    };

function MiniAvatar({ src, hidden }: { src: string; hidden?: boolean }) {
  if (hidden) return <div className="w-7" />;
  return (
    <div className="w-7">
      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10">
        <Image
          src={src}
          alt="Avatar"
          fill
          className="object-cover"
          sizes="24px"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}

function TimeLabel({ text }: { text: string }) {
  return (
    <div className="w-full flex items-center justify-center py-3">
      <span className="text-[10px] uppercase tracking-wide text-white/35">
        {text}
      </span>
    </div>
  );
}

function UnreadDivider({ text = "NEW MESSAGES" }: { text?: string }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-[10px] tracking-wide text-white/35">{text}</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function BubbleMe({ text }: { text: string }) {
  return (
    <div className="ml-auto max-w-[86%] sm:max-w-[78%]">
      <div className="rounded-2xl rounded-tr-md bg-[#6e4ef2] px-3 py-2 text-[13px] text-white whitespace-pre-wrap break-words">
        {text}
      </div>
    </div>
  );
}

function ReactionPill({
  value,
  align,
}: {
  value: string;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "ml-auto" : ""}>
      <span className="inline-flex items-center rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-[11px] text-white/90">
        {value}
      </span>
    </div>
  );
}

function StoryCard({
  storySrc,
  avatarSrc,
  handle,
  fromMe,
  reaction,
  showAvatar,
  onClick,
}: {
  storySrc: string;
  avatarSrc: string;
  handle: string;
  fromMe?: boolean;
  reaction?: string;
  showAvatar?: boolean;
  onClick: () => void;
}) {
  const wrap = fromMe ? "ml-auto" : "";
  const avatarHidden = showAvatar === false;

  return (
    <div className={`flex items-end gap-2 ${wrap}`}>
      {!fromMe ? <MiniAvatar src={avatarSrc} hidden={avatarHidden} /> : null}

      <button
        onClick={onClick}
        className={[
          "relative w-[170px] h-[290px]",
          "rounded-2xl overflow-hidden",
          "border border-white/10 bg-[#101114]",
          "cursor-pointer hover:opacity-90 transition-opacity",
          fromMe ? "ml-auto" : "",
        ].join(" ")}
        type="button"
      >
        <Image
          src={storySrc}
          alt={`Story de ${handle}`}
          fill
          className="object-cover"
          sizes="170px"
          unoptimized
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/15">
              <Image
                src={avatarSrc}
                alt={`Avatar de ${handle}`}
                fill
                className="object-cover"
                sizes="28px"
                unoptimized
              />
            </div>
            <div className="text-[12px] text-white/90 font-semibold truncate">
              {handle}
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-black/35 border border-white/10 grid place-items-center">
            <Play className="w-4 h-4 text-white/90" />
          </div>
        </div>

        {reaction ? (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full bg-black/45 border border-white/10 px-2 py-1 text-[11px] text-white/95">
              {reaction}
            </span>
          </div>
        ) : null}
      </button>

      {fromMe ? <MiniAvatar src={avatarSrc} hidden={avatarHidden} /> : null}
    </div>
  );
}

function AudioCard({
  duration,
  reaction,
  onClick,
}: {
  duration: string;
  reaction?: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={onClick}
        className="w-[86%] sm:w-[78%] rounded-2xl bg-[#1f1f22] border border-white/10 px-4 py-3 text-left text-white/90 cursor-pointer hover:bg-[#2a2a2d] transition-colors"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/85 ml-0.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[2px] h-6">
              {Array.from({ length: 42 }).map((_, idx) => {
                const t = (idx + 6) % 10;
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
            <div className="mt-2 flex items-center justify-between text-[12px] text-white/70">
              <span>Áudio</span>
              <span className="tabular-nums">{duration}</span>
            </div>
          </div>
        </div>
      </button>

      {reaction ? <ReactionPill value={reaction} align="left" /> : null}
    </div>
  );
}

export default function ChatLuaClient({ username, convo }: Props) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const avatarSrc = useMemo(
    () => proxyImage(convo.avatarUrl),
    [convo.avatarUrl],
  );

  const goBack = () =>
    router.push(`/direct?username=${encodeURIComponent(username || "user")}`);

  const img = (name: string) => `/chat/${name}`;

  const baseMessages: Msg[] = [
    {
      id: "s1",
      kind: "story",
      storySrc: img("chat5.1.png"),
      avatarSrc: img("chat5.1a.png"),
      handle: "tinhooficial",
      reaction: "😂",
      fromMe: false,
      showAvatar: true,
    },
    { id: "t1", kind: "time", text: "25 NOV, 15:22" },
    {
      id: "s2",
      kind: "story",
      storySrc: img("chat5.2.png"),
      avatarSrc: img("chat5.2a.jpg"),
      handle: "ikarozets",
      fromMe: false,
      showAvatar: false,
    },
    { id: "t2", kind: "time", text: "27 NOV, 20:15" },
    {
      id: "s3",
      kind: "story",
      storySrc: img("chat5.3.png"),
      avatarSrc: img("chat5.1a.png"),
      handle: "tettrem",
      reaction: "🥲",
      fromMe: false,
      showAvatar: false,
    },
    { id: "m1", kind: "meText", text: "This one felt sad." },
    { id: "t3", kind: "time", text: "29 NOV, 14:08" },
    {
      id: "s5",
      kind: "story",
      storySrc: img("chat5.5.png"),
      avatarSrc: img("chat5.5a.png"),
      handle: "signodaputaria",
      fromMe: true,
      showAvatar: true,
    },
    {
      id: "s4",
      kind: "story",
      storySrc: img("chat5.4.png"),
      avatarSrc: img("chat5.1a.png"),
      handle: "tettrem",
      fromMe: false,
      showAvatar: false,
    },
    { id: "t4", kind: "time", text: "YESTERDAY, 18:45" },
    {
      id: "s6",
      kind: "story",
      storySrc: img("chat5.6.png"),
      avatarSrc: img("chat5.6a.png"),
      handle: "safadodesejo",
      fromMe: true,
      reaction: "😂",
      showAvatar: true,
    },
    { id: "m2", kind: "meText", text: "lol 😂" },
    {
      id: "a1",
      kind: "audio",
      duration: "0:23",
      reaction: "😂",
      showAvatar: false,
    },
    { id: "t5", kind: "time", text: "YESTERDAY, 22:11" },
    {
      id: "s7",
      kind: "story",
      storySrc: img("chat5.7.png"),
      avatarSrc: img("chat5.7a.png"),
      handle: "morimura",
      fromMe: false,
      showAvatar: false,
    },
    { id: "u1", kind: "unread", text: "NEW" },
    { id: "t6", kind: "time", text: "TODAY, 16:32" },
  ];

  const handleStoryClick = (storySrc: string, handle: string) => {
    console.log(`Abrindo story de ${handle}: ${storySrc}`);
    // Aqui você pode implementar a lógica para abrir o story
    // Por exemplo, mostrar em tela cheia ou modal
  };

  const handleAudioClick = (duration: string) => {
    console.log(`Reproduzindo áudio de ${duration}`);
    // Aqui você pode implementar a lógica de reprodução de áudio
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 flex flex-col overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        <header className="flex items-center justify-between px-4 py-3 bg-black z-50 shrink-0 border-b border-gray-800/40">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              aria-label="Back"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              type="button"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <div className="flex items-center gap-2">
              <MiniAvatar src={avatarSrc} />
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
              aria-label="Call"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              type="button"
            >
              <Phone className="w-5.5 h-5.5" />
            </button>
            <button
              aria-label="Video"
              className="cursor-pointer hover:opacity-80 transition-opacity"
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
          <div className="flex flex-col gap-2">
            {baseMessages.map((m) => {
              if (m.kind === "time")
                return <TimeLabel key={m.id} text={m.text} />;
              if (m.kind === "unread")
                return <UnreadDivider key={m.id} text={m.text ?? "NEW"} />;

              if (m.kind === "meText") {
                return (
                  <div key={m.id} className="flex flex-col items-end gap-1">
                    <BubbleMe text={m.text} />
                  </div>
                );
              }

              if (m.kind === "audio") {
                return (
                  <div key={m.id} className="flex items-end gap-2">
                    <MiniAvatar
                      src={avatarSrc}
                      hidden={m.showAvatar === false}
                    />
                    <AudioCard
                      duration={m.duration}
                      reaction={m.reaction}
                      onClick={() => handleAudioClick(m.duration)}
                    />
                  </div>
                );
              }

              return (
                <div key={m.id} className="flex flex-col gap-1">
                  <StoryCard
                    storySrc={m.storySrc}
                    avatarSrc={m.avatarSrc}
                    handle={m.handle}
                    fromMe={m.fromMe}
                    reaction={m.reaction}
                    showAvatar={m.showAvatar}
                    onClick={() => handleStoryClick(m.storySrc, m.handle)}
                  />
                </div>
              );
            })}
          </div>

          <div className="h-28" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/90 border-t border-gray-800/40">
          <button
            className="w-full h-12 rounded-2xl bg-[#1f1f22] border border-white/10 text-white/55 text-left px-4 cursor-not-allowed"
            type="button"
            disabled
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
