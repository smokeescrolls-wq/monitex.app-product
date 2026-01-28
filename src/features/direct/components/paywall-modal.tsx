"use client";

import { TriangleAlert, X } from "lucide-react";

export function PaywallModal(props: {
  open: boolean;
  onClose: () => void;
  onGoVip: () => void;
  title?: string;
  description?: string;
}) {
  const { open, onClose, onGoVip, title, description } = props;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
      <div className="bg-[#1C1C1E] border border-gray-800 w-full max-w-[340px] rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative">
        <div className="mb-4">
          <TriangleAlert className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-white text-lg font-bold mb-2">
          {title ?? "Ação bloqueada"}
        </h3>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {description ??
            "Para liberar essa ação, é necessário ter acesso VIP."}
        </p>

        <button
          onClick={onGoVip}
          className="w-full bg-[#8A7178] hover:bg-[#9d828a] text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Adquirir Acesso VIP
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
