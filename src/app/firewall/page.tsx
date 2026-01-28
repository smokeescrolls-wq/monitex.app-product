"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangleIcon,
} from "lucide-react";

import { LegalDialog } from "@/features/legal/legal-dialog";
import { MatrixCanvas } from "@/components/matrix-canvas";

type FAQItem = {
  q: string;
  a: string;
  open: boolean;
};

export default function FirewallPage() {
  const CHECKOUT_URL =
    process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://exemplo.com/checkout";

  const [progress, setProgress] = useState(35);

  const [faq, setFaq] = useState<FAQItem[]>([
    {
      q: "Preciso fazer outro pagamento?",
      a: "Essa taxa é separada da compra inicial. Ela serve exclusivamente para ativar os servidores criptografados, garantir o modo invisível e liberar os backups automáticos com sigilo total.",
      open: false,
    },
    {
      q: "Aparece o nome do app na cobrança?",
      a: "Não. A cobrança aparece com um nome discreto e genérico para proteger sua privacidade.",
      open: false,
    },
    {
      q: "Essa taxa é realmente obrigatória?",
      a: "Sim. Sem ela, o sistema não pode ativar os protocolos de segurança e privacidade, o que compromete todo o funcionamento.",
      open: false,
    },
    {
      q: "Posso usar o app sem ativar o Firewall?",
      a: "Não. A ativação do firewall é necessária para liberar o acesso completo e garantir o sigilo das operações.",
      open: false,
    },
  ]);

  const toggleFaq = (idx: number) => {
    setFaq((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, open: !it.open } : it)),
    );
  };

  const goCheckout = () => {
    window.open(CHECKOUT_URL, "_blank");
  };

  const brand = useMemo(
    () => ({
      name: "MONITEX.APP",
      accent: "text-purple-500",
    }),
    [],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p < 72 ? p + 1 : p));
    }, 250);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <MatrixCanvas
        className="fixed inset-0 h-full w-full pointer-events-none z-0"
        opacity={0.2}
        speedMs={50}
        color="#6b21a8"
      />

      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-[#7f1d1d]/90 border-b border-red-900/50 backdrop-blur-md px-4 py-3">
          <div className="max-w-[520px] mx-auto flex flex-col items-center justify-center gap-2 text-sm">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-200/60 opacity-40 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-300 shadow-[0_0_10px_rgba(252,165,165,0.7)]" />
              </span>

              <span className="font-semibold">
                Atenção, não saia dessa página!
              </span>
            </div>

            <span className="text-white/70">
              Sua compra ainda não foi 100% concluída
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-25 pb-16 px-6">
        <div className="w-full max-w-[520px] mx-auto">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="relative w-16 h-16">
                <Image
                  src="/assets/logo-vert-transparente.png"
                  alt="Monitex"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="font-black tracking-widest text-xl text-white/80">
                MONITEX.APP
              </span>
            </div>

            <div className="w-full max-w-[440px]">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-[28px] shadow-2xl p-6 space-y-5">
            <h1 className="text-center text-4xl font-black leading-tight">
              <span className={brand.accent}>Parabéns!</span> 🎉
            </h1>

            <p className="text-center text-3xl font-extrabold text-white/90">
              Seu acesso ao <span className={brand.accent}>Monitex.app</span>
              <br /> está quase concluído!
            </p>

            <p className="text-center text-white/80 text-md font-semibold leading-relaxed">
              Para garantir{" "}
              <b className="text-white">total sigilo da sua identidade</b>, é
              necessário
              <br />
              realizar um pagamento único de uma pequena taxa de
              <br /> <b className={brand.accent}>Firewall & Sigilo.</b>
            </p>

            <div className="mt-5 rounded-2xl border border-yellow-500/25 bg-yellow-500/10 px-4 py-3">
              <div className="flex items-start gap-2 text-yellow-200 text-xs leading-relaxed">
                <AlertTriangleIcon className="h-4 w-4 shrink-0 mt-[2px]" />
                <p className="text-center w-full">
                  <span className="font-bold">Ativação obrigatória:</span> sem
                  essa taxa, o Instagram pode notificar seu cônjuge que está
                  sendo monitorado e expor sua identidade por medidas de
                  segurança.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 mb-6">
            <p className="text-white font-bold text-3xl leading-tight">
              Ative o <span className={brand.accent}>Firewall</span> e acesse{" "}
              <br /> o<span className={brand.accent}> Instagram </span>
              agora mesmo!
            </p>
          </div>

          <div className="bg-black/40 border border-purple-500/20 backdrop-blur-md rounded-[28px] shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="flex items-center justify-center mb-4 gap-3">
              <span className="text-xl font-bold text-purple-300">
                Oferta Especial 🔥
              </span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
                Limitado
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <Check className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-white/80">
                  Proteção total dos seus dados e identidade
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <Check className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-white/80">
                  100% de sigilo na investigação
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <Check className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-white/80">
                  Liberação de backups automáticos
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <Check className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-white/80">
                  Firewall ativo por 1 ano após o pagamento
                </span>
              </div>
            </div>

            <div className="mt-5 bg-black/40 border border-white/10 rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-white/40 text-xs line-through">
                  R$69,90
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
                  R$32 OFF
                </span>
              </div>

              <div className="text-5xl font-black text-purple-400 leading-none">
                R$37<span className="text-2xl">,00</span>
              </div>
              <div className="text-[11px] text-white/50 mt-1">
                Pagamento único
              </div>

              <button
                onClick={goCheckout}
                className="mt-5 w-full rounded-2xl bg-gradient-to-br cursor-pointer from-purple-500 to-purple-700 py-4 font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:opacity-95 active:scale-[0.99] transition"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Proteger meus dados e sigilo
                </span>
                <div className="text-[12px] font-semibold text-white/80 mt-1">
                  E acessar o instagram agora mesmo
                </div>
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-white/60">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-purple-300" />
                  Proteção extra
                </span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-4 h-4 text-purple-300" />
                  Ativação imediata
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-black/40 border border-white/10 backdrop-blur-md rounded-[22px] p-6">
            <h2 className="text-center font-black text-lg mb-4">
              Perguntas Frequentes
            </h2>

            <div className="flex flex-col gap-3">
              {faq.map((it, i) => (
                <div
                  key={i}
                  className={`rounded-xl border border-white/10 bg-white/5 overflow-hidden ${
                    it.open ? "border-purple-500/30" : ""
                  }`}
                >
                  <button
                    className="w-full px-4 py-5 flex items-center justify-between text-left cursor-pointer"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={it.open}
                  >
                    <span className="text-md text-white/85 font-semibold">
                      {it.q}
                    </span>
                    {it.open ? (
                      <ChevronUp className="w-5 h-5 text-purple-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-300" />
                    )}
                  </button>

                  {it.open ? (
                    <div className="px-4 pb-4 text-sm text-white/60 leading-relaxed border-t border-white/10 pt-3">
                      {it.a}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <footer className="mt-10 text-center text-white/40 text-xs">
            <div className="font-bold tracking-widest text-white/50">
              MONITEX.APP
            </div>
            <div className="mt-2">
              © 2026 Monitex — Todos os direitos reservados.
            </div>

            <div className="mt-3 flex items-center justify-center gap-4">
              <LegalDialog kind="terms" triggerLabel="Termos de Uso" />
              <LegalDialog
                kind="privacy"
                triggerLabel="Política de Privacidade"
              />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
