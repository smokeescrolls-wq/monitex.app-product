"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Phone, Video } from "lucide-react";
import {
  getChatMessages,
  getInboxConversations,
  getSelectedConversation,
  proxyImage,
  type DirectConversation,
} from "@/features/direct/direct.utils";

type Params = { chatId: string };

function AudioBubble(props: {
  fromMe: boolean;
  durationLabel: string;
  locked: boolean;
}) {
  const { fromMe, durationLabel, locked } = props;

  return (
    <div
      className={[
        "max-w-[78%] rounded-2xl px-4 py-3",
        fromMe
          ? "ml-auto bg-[#6e4ef2] text-white"
          : "mr-auto bg-[#1f1f1f] text-white",
        locked ? "blur-sm opacity-80" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <button
          className={[
            "w-10 h-10 rounded-full flex items-center justify-center",
            fromMe ? "bg-white/15" : "bg-white/10",
          ].join(" ")}
          disabled
          aria-label="Play"
        >
          <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/90 ml-0.5" />
        </button>

        <div className="flex-1">
          <div className="h-2.5 w-full rounded-full bg-white/15 overflow-hidden">
            <div className="h-full w-[35%] bg-white/35 rounded-full" />
          </div>
          <div className="mt-2 text-[11px] opacity-85">{durationLabel}</div>
        </div>
      </div>

      {!fromMe ? (
        <div className="mt-2 text-[11px] text-white/80 underline underline-offset-2">
          View transcript
        </div>
      ) : null}
    </div>
  );
}

function TextBubble(props: { fromMe: boolean; text: string; locked: boolean }) {
  const { fromMe, text, locked } = props;

  return (
    <div
      className={[
        "max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-snug",
        fromMe
          ? "ml-auto bg-[#6e4ef2] text-white"
          : "mr-auto bg-[#1f1f1f] text-white",
        locked ? "blur-sm opacity-80" : "",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function BlurredImageBubble(props: {
  src: string;
  fromMe: boolean;
  locked: boolean;
}) {
  const { src, fromMe, locked } = props;

  return (
    <div
      className={[
        "max-w-[78%] rounded-2xl overflow-hidden",
        fromMe ? "ml-auto" : "mr-auto",
        locked ? "opacity-80" : "",
      ].join(" ")}
    >
      <div className="relative w-[230px] h-[320px] bg-black/40">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover blur-2xl scale-110"
          sizes="230px"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-black/45 border border-white/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/70 flex items-center justify-center">
              <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white/90 ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<Params>();

  const username = searchParams.get("username") ?? "";
  const chatId = params?.chatId ?? "";

  const convo: DirectConversation | null = useMemo(() => {
    if (!chatId) return null;

    const selected = getSelectedConversation();
    if (selected && selected.id === chatId) return selected;

    const fallback = getInboxConversations({
      total: 18,
      unlockedCount: 4,
      searchedDisplayName: username || "User",
    });

    return fallback.find((c) => c.id === chatId) ?? null;
  }, [chatId, username]);

  const messages = useMemo(() => {
    if (!convo) return [];
    return getChatMessages(convo.variant);
  }, [convo]);

  const [paywallOpen, setPaywallOpen] = useState(false);

  const headerTitle = convo?.maskedTitle ?? "User";

  const avatarSrc = useMemo(() => {
    const raw = convo?.avatarUrl ?? "";
    return proxyImage(raw);
  }, [convo]);

  const [headerAvatarLoaded, setHeaderAvatarLoaded] = useState(false);

  const onBack = () => {
    router.push(`/direct?username=${encodeURIComponent(username)}`);
  };

  if (!convo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-[450px] border-x border-gray-800 shadow-2xl">
          <div className="h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-white/80">Chat not found.</p>
            <button
              onClick={onBack}
              className="px-4 py-3 rounded-xl bg-[#584cea] hover:bg-[#4a3fcb] text-white font-semibold text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 text-white flex flex-col font-sans overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        <header className="flex justify-between items-center px-4 py-3 bg-black z-50 shrink-0 border-b border-gray-800/40">
          <div className="flex items-center gap-3">
            <button onClick={onBack} aria-label="Back">
              <ArrowLeft className="w-7 h-7" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-800 relative bg-[#111113]">
                {!avatarSrc ? (
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                ) : (
                  <>
                    {!headerAvatarLoaded ? (
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    ) : null}

                    <Image
                      src={avatarSrc}
                      alt=""
                      fill
                      className="object-cover blur-md scale-110"
                      sizes="36px"
                      priority
                      unoptimized
                      onLoad={() => setHeaderAvatarLoaded(true)}
                      onError={() => setHeaderAvatarLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </>
                )}
              </div>

              <div className="leading-tight">
                <div className="text-[14px] font-semibold">{headerTitle}</div>
                <div className="text-[11px] text-white/55">Online</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setPaywallOpen(true)} aria-label="Call">
              <Phone className="w-5.5 h-5.5" />
            </button>
            <button onClick={() => setPaywallOpen(true)} aria-label="Video">
              <Video className="w-5.5 h-5.5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const key = m.id;

              if (m.kind === "text") {
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <TextBubble
                      fromMe={m.fromMe}
                      text={m.text}
                      locked={m.locked}
                    />
                    <div
                      className={[
                        "text-[10px] opacity-60",
                        m.fromMe ? "text-right" : "text-left",
                      ].join(" ")}
                    >
                      {m.timeLabel}
                    </div>
                  </div>
                );
              }

              if (m.kind === "audio") {
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <AudioBubble
                      fromMe={m.fromMe}
                      durationLabel={m.durationLabel}
                      locked={m.locked}
                    />
                    <div
                      className={[
                        "text-[10px] opacity-60",
                        m.fromMe ? "text-right" : "text-left",
                      ].join(" ")}
                    >
                      {m.timeLabel}
                    </div>
                  </div>
                );
              }

              return (
                <div key={key} className="flex flex-col gap-1">
                  <BlurredImageBubble
                    src={m.src}
                    fromMe={m.fromMe}
                    locked={m.locked}
                  />
                  <div
                    className={[
                      "text-[10px] opacity-60",
                      m.fromMe ? "text-right" : "text-left",
                    ].join(" ")}
                  >
                    {m.timeLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-24" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/90 border-t border-gray-800/40">
          <button
            onClick={() => setPaywallOpen(true)}
            className="w-full h-12 rounded-2xl bg-[#1f1f1f] border border-white/10 text-white/55 text-left px-4"
          >
            Message…
          </button>
        </div>

        {paywallOpen ? (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
            <div className="bg-[#1C1C1E] border border-gray-800 w-full max-w-[320px] rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative">
              <h3 className="text-white text-lg font-bold mb-2">
                Action blocked
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Become a VIP member to access this action.
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/cta?username=${encodeURIComponent(username || "")}`,
                  )
                }
                className="w-full bg-[#8A7178] hover:bg-[#9d828a] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Get VIP Access
              </button>

              <button
                onClick={() => setPaywallOpen(false)}
                className="mt-3 text-white/70 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}

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
