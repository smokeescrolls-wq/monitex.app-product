"use client";

import { ArrowLeft, Phone, Video } from "lucide-react";

type Props = {
  nameMasked: string;
  avatarSrc?: string;
  status?: string;
  onBack: () => void;
  onBlockedAction: () => void;
};

export function ChatHeader({
  nameMasked,
  avatarSrc,
  status = "Online",
  onBack,
  onBlockedAction,
}: Props) {
  return (
    <header className="shrink-0 bg-black px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="text-white"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Avatar do usuário"
            className="relative"
            onClick={onBlockedAction}
          >
            <span className="grid place-items-center rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
              <span className="rounded-full bg-black p-[2px]">
                <img
                  src={
                    avatarSrc ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                  }
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover blur-[1px]"
                  loading="lazy"
                />
              </span>
            </span>
          </button>

          <button type="button" onClick={onBlockedAction} className="text-left">
            <div className="text-white font-semibold leading-tight">
              {nameMasked}
            </div>
            <div className="text-[11px] text-zinc-400">{status}</div>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-white">
        <button
          type="button"
          onClick={onBlockedAction}
          aria-label="Ligação de áudio"
        >
          <Phone className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={onBlockedAction}
          aria-label="Ligação de vídeo"
        >
          <Video className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
