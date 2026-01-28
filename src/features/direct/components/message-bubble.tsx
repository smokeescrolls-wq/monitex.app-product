"use client";

import { useEffect, useMemo, useState } from "react";
import { AudioLines, Play } from "lucide-react";
import type { ChatMessage } from "@/features/direct/direct.utils";

export function MessageBubble(props: {
  msg: ChatMessage;
  isVip: boolean;
  onPaywall: () => void;
}) {
  const { msg, isVip, onPaywall } = props;

  const locked = msg.locked && !isVip;
  const audioBlocked = msg.kind === "audio" && !isVip;

  const align = msg.fromMe ? "justify-end" : "justify-start";
  const bubbleBase = msg.fromMe
    ? "bg-[#7c3aed] text-white"
    : "bg-[#2a2a2e] text-white";
  const blurClass = locked ? "blur-md opacity-70" : "blur-0 opacity-100";

  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (!audioPlaying) return;
    const t = window.setTimeout(() => setAudioPlaying(false), 850);
    return () => window.clearTimeout(t);
  }, [audioPlaying]);

  const bars = useMemo(() => Array.from({ length: 18 }).map((_, i) => i), []);

  const triggerPaywallWithPlay = () => {
    setAudioPlaying(true);
    window.setTimeout(() => onPaywall(), 520);
  };

  return (
    <div className={`w-full flex ${align}`}>
      <div className="max-w-[78%] relative">
        <div
          className={`${bubbleBase} rounded-2xl px-3 py-2 text-[13px] leading-snug ${blurClass}`}
        >
          {msg.kind === "text" ? <div>{msg.text}</div> : null}

          {msg.kind === "image" ? (
            <div className="w-[210px] max-w-full aspect-[4/5] rounded-xl bg-white/10 overflow-hidden" />
          ) : null}

          {msg.kind === "audio" ? (
            <button
              type="button"
              onClick={() => {
                if (isVip) {
                  setAudioPlaying(true);
                  return;
                }
                triggerPaywallWithPlay();
              }}
              className="w-full text-left"
              aria-label="Reproduzir áudio"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-[160px]">
                  <div className="h-6 rounded-md bg-white/15 flex items-center px-2 gap-2 overflow-hidden">
                    <AudioLines className="w-4 h-4 opacity-90 shrink-0" />
                    <div className="flex-1 flex items-center gap-[2px]">
                      {bars.map((i) => (
                        <div
                          key={i}
                          className={`w-[3px] rounded-full bg-white/70 ${audioPlaying ? "animate-audioBar" : ""}`}
                          style={{
                            height: `${6 + ((i * 7) % 14)}px`,
                            animationDelay: `${i * 35}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-1 text-[11px] text-white/80 flex items-center justify-between">
                    <span>{msg.durationLabel}</span>
                    <span className="text-white/60">Ver transcrição</span>
                  </div>
                </div>
              </div>
            </button>
          ) : null}
        </div>

        <div
          className={`mt-1 text-[10px] ${msg.fromMe ? "text-right" : "text-left"} text-white/40`}
        >
          {msg.timeLabel}
        </div>

        {locked ? (
          <button
            onClick={onPaywall}
            className="absolute inset-0"
            aria-label="Conteúdo bloqueado"
          />
        ) : null}

        {audioBlocked && !locked ? (
          <button
            onClick={triggerPaywallWithPlay}
            className="absolute inset-0"
            aria-label="Áudio bloqueado"
          />
        ) : null}

        <style jsx global>{`
          @keyframes audioBar {
            0% {
              transform: scaleY(0.55);
              opacity: 0.65;
            }
            50% {
              transform: scaleY(1.25);
              opacity: 0.95;
            }
            100% {
              transform: scaleY(0.7);
              opacity: 0.7;
            }
          }
          .animate-audioBar {
            animation: audioBar 700ms ease-in-out infinite;
            transform-origin: bottom;
          }
        `}</style>
      </div>
    </div>
  );
}
