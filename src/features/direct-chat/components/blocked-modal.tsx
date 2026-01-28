"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onGoVip: () => void;
};

export function BlockedModal({ open, onClose, onGoVip }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm px-6 grid place-items-center">
      <div className="w-full max-w-[340px] rounded-2xl border border-white/10 bg-[#161616] p-6 text-center shadow-2xl">
        <div className="text-white font-bold text-lg mb-2">Ação bloqueada</div>
        <div className="text-white/70 text-sm mb-6">
          Para liberar conteúdo e interações, é necessário VIP.
        </div>

        <button
          type="button"
          onClick={onGoVip}
          className="w-full rounded-xl bg-gradient-to-r from-[#6e4ef2] to-[#9834db] py-3 font-semibold text-white"
        >
          Adquirir Acesso VIP
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-sm text-white/60 hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
