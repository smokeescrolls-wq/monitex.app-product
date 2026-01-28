"use client";

import { Lock, EyeOff, CornerUpLeft } from "lucide-react";
import { AudioWaveform } from "./audio-waveform";
import type { ChatMessage } from "../direct-chat.types";

type Props = {
  msg: ChatMessage;
  avatarSrc?: string;
  onBlockedAction: () => void;
};

export function MessageBubble({ msg, avatarSrc, onBlockedAction }: Props) {
  if (msg.type === "date") {
    return (
      <div className="text-center text-[12px] text-zinc-500 my-4">
        {msg.text}
      </div>
    );
  }

  if (msg.type === "unread_divider") {
    return (
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] text-zinc-400">Novas mensagens</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    );
  }

  const isReceived = msg.side === "received";

  const bubbleBase =
    "max-w-[78%] rounded-2xl px-4 py-2 text-[14px] leading-snug relative";
  const bubbleColor = isReceived
    ? "bg-[#262626] text-white"
    : "bg-[#6e4ef2] text-white";
  const bubbleCorner = isReceived ? "rounded-tl-md" : "rounded-tr-md";

  return (
    <div
      className={`confirm-none flex gap-2 ${isReceived ? "justify-start" : "justify-end"}`}
    >
      {isReceived ? (
        <img
          src={
            avatarSrc ||
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
          }
          alt="User"
          className="w-7 h-7 rounded-full mt-1 bg-white/10 object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="flex flex-col items-start">
        {msg.type === "text" ? (
          <div className={`${bubbleBase} ${bubbleColor} ${bubbleCorner}`}>
            {msg.replyTo ? (
              <div className="mb-2 rounded-xl bg-black/20 px-3 py-2 w-full">
                <div className="text-[10px] text-white/70 flex items-center gap-1">
                  <CornerUpLeft className="w-3 h-3" />
                  <span>
                    {isReceived ? "respondeu a você" : "Você respondeu"}
                  </span>
                </div>
                <div className="text-[12px] text-white/80 mt-1 line-clamp-2">
                  {msg.replyTo}
                </div>
              </div>
            ) : null}

            <span className={msg.blurred ? "blur-[2px] select-none" : ""}>
              {msg.text}
            </span>

            {msg.reaction ? (
              <span className="absolute -bottom-4 right-2 text-[14px]">
                {msg.reaction}
              </span>
            ) : null}
          </div>
        ) : null}

        {msg.type === "media" ? (
          <div className={`${bubbleBase} ${bubbleColor} ${bubbleCorner} p-2`}>
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={msg.src}
                alt="Mídia"
                className={`w-[220px] h-[220px] object-cover ${
                  msg.locked ? "blur-md scale-110" : ""
                }`}
                draggable={false}
              />

              {msg.locked ? (
                <button
                  type="button"
                  onClick={onBlockedAction}
                  className="absolute inset-0 grid place-items-center bg-black/35"
                  aria-label="Conteúdo bloqueado"
                >
                  <div className="grid place-items-center w-12 h-12 rounded-full bg-black/35 border border-white/15">
                    <EyeOff className="w-6 h-6 text-white/80" />
                  </div>
                </button>
              ) : null}
            </div>

            {msg.reaction ? (
              <span className="absolute -bottom-4 right-2 text-[14px]">
                {msg.reaction}
              </span>
            ) : null}
          </div>
        ) : null}

        {msg.type === "audio" ? (
          <div className={`${bubbleBase} ${bubbleColor} ${bubbleCorner} p-2`}>
            <div className="w-[260px]">
              <AudioWaveform
                durationLabel={msg.durationLabel}
                locked={msg.locked}
                onPlay={onBlockedAction}
              />
              {msg.locked ? (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-white/70">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Áudio bloqueado</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
