"use client";

import {
  Heart,
  Image as ImageIcon,
  Mic,
  Smile,
  Send,
  Camera,
} from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  onBlockedAction: () => void;
};

export function MessageInput({ onBlockedAction }: Props) {
  const [value, setValue] = useState("");

  const showSend = useMemo(() => value.trim().length > 0, [value]);

  return (
    <div className="shrink-0 bg-black px-3 pb-3 pt-2 border-t border-white/10">
      <div className="flex items-center gap-2 rounded-full bg-[#262626] px-3 py-2">
        <button type="button" onClick={onBlockedAction} aria-label="Câmera">
          <Camera className="w-6 h-6 text-white" />
        </button>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 text-[14px]"
        />

        <div className="flex items-center gap-3 text-white">
          {!showSend ? (
            <>
              <button type="button" onClick={onBlockedAction} aria-label="Voz">
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onBlockedAction}
                aria-label="Mídia"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onBlockedAction}
                aria-label="Sticker"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onBlockedAction}
                aria-label="Curtir"
              >
                <Heart className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button type="button" onClick={onBlockedAction} aria-label="Enviar">
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
