"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Flame,
  Check,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FAQ = { q: string; a: string; open: boolean };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function ListaNegraPage() {
  const matrixCanvas = useRef<HTMLCanvasElement>(null);

  const CHECKOUT_URL =
    process.env.NEXT_PUBLIC_LISTA_CHECKOUT_URL ||
    "https://exemplo.com/checkout";

  const TERMS_TEXT = `Última atualização: Janeiro de 2025

1. NATUREZA DO SERVIÇO E ISENÇÃO DE GARANTIAS. O Monitex.app é uma plataforma de ENTRETENIMENTO e SIMULAÇÃO. O usuário reconhece e concorda expressamente que: (a) todos os resultados, dados, informações, relatórios e conteúdos exibidos na plataforma são SIMULADOS, FICTÍCIOS e gerados por algoritmos para fins exclusivos de entretenimento; (b) a plataforma NÃO possui capacidade técnica real de acessar, hackear, invadir ou obter dados privados de redes sociais, dispositivos ou contas de terceiros; (c) qualquer semelhança entre os resultados exibidos e dados reais é mera coincidência; (d) o serviço é fornecido "COMO ESTÁ" e "CONFORME DISPONÍVEL", sem garantias de qualquer natureza.

2. DECLARAÇÕES DO USUÁRIO. Ao utilizar o serviço, o usuário declara e garante que: (a) possui mais de 18 anos de idade e capacidade civil plena; (b) compreende integralmente que o serviço é de entretenimento e que os resultados são simulados e não correspondem à realidade; (c) assume integral responsabilidade por qualquer interpretação ou uso que faça dos conteúdos exibidos.

3. LIMITAÇÃO DE RESPONSABILIDADE. Em nenhuma circunstância o Monitex.app será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais, punitivos ou exemplares, resultantes do uso ou incapacidade de uso do serviço.

4. LEI APLICÁVEL E FORO. Estes termos serão regidos pelas leis do Brasil. Foro: São Paulo/SP.`;

  const PRIVACY_TEXT = `Última atualização: Janeiro de 2025

1. INFORMAÇÕES COLETADAS. Coletamos informações fornecidas diretamente (ex: e-mail) e dados de uso (cookies e métricas). Pagamentos são processados por terceiros e não são armazenados nos nossos servidores.

2. USO DAS INFORMAÇÕES. Usamos para operar o serviço, processar transações, melhorar a plataforma e prevenir problemas de segurança.

3. COMPARTILHAMENTO. Não vendemos dados. Compartilhamos apenas com provedores essenciais (pagamento/infra) e quando exigido por lei.

4. SEUS DIREITOS (LGPD). Você pode solicitar acesso, correção e exclusão conforme a Lei 13.709/2018.`;

  const [faq, setFaq] = useState<FAQ[]>([
    {
      q: "Esse recurso é recorrente ou pagamento único?",
      a: "Pagamento único. A liberação é ativada imediatamente após a confirmação.",
      open: false,
    },
    {
      q: "Posso remover itens da lista depois?",
      a: "Sim. Você pode editar e remover itens a qualquer momento dentro da área do recurso.",
      open: false,
    },
    {
      q: "O que exatamente eu recebo?",
      a: "Um módulo extra de organização e alertas do aplicativo, focado em acompanhamento de contas autorizadas e insights de atividade.",
      open: false,
    },
  ]);

  const toggleFaq = (idx: number) => {
    setFaq((p) =>
      p.map((it, i) => (i === idx ? { ...it, open: !it.open } : it)),
    );
  };

  const goCheckout = () => window.open(CHECKOUT_URL, "_blank");

  const brand = useMemo(
    () => ({
      name: "MONITEX.APP",
      accent: "text-purple-500",
    }),
    [],
  );

  const [remaining, setRemaining] = useState(5 * 3600 + 11 * 60 + 15);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const hh = Math.floor(remaining / 3600);
  const mm = Math.floor((remaining % 3600) / 60);
  const ss = remaining % 60;

  useEffect(() => {
    const canvas = matrixCanvas.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => 1);

    const draw = () => {
      const newColumns = Math.floor(canvas.width / fontSize);
      if (newColumns !== columns) {
        columns = newColumns;
        drops = Array.from({ length: columns }, () => 1);
      }

      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#7c3aed";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const y = (drops[i] ?? 0) * fontSize;
        ctx.fillText(text, i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] = (drops[i] ?? 0) + 1;
      }
    };

    const id = window.setInterval(draw, 50);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas
        ref={matrixCanvas}
        className="fixed inset-0 w-full h-full opacity-20 pointer-events-none z-0"
      />

      <div className="relative z-10 px-6 py-14">
        <div className="max-w-[520px] mx-auto">
          <div className="flex flex-col items-center gap-3 mb-8">
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

          <div className="rounded-2xl border border-purple-500/20 bg-black/30 backdrop-blur-md shadow-2xl px-6 py-4 mb-8">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-black">{pad2(hh)}</div>
                <div className="text-[10px] tracking-widest text-white/60">
                  HORAS
                </div>
              </div>
              <div className="text-white/40 text-2xl font-black -mt-2">:</div>
              <div className="text-center">
                <div className="text-2xl font-black">{pad2(mm)}</div>
                <div className="text-[10px] tracking-widest text-white/60">
                  MINUTOS
                </div>
              </div>
              <div className="text-white/40 text-2xl font-black -mt-2">:</div>
              <div className="text-center">
                <div className="text-2xl font-black">{pad2(ss)}</div>
                <div className="text-[10px] tracking-widest text-white/60">
                  SEGUNDOS
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 text-4xl font-black">
              <Flame className="w-7 h-7 text-orange-400" />
              <span>Oferta por</span>
              <span className="text-purple-500">tempo limitado</span>
            </div>
            <p className="mt-4 text-white/70 text-md leading-relaxed">
              Esse é o{" "}
              <span className="text-white font-semibold">último passo</span>{" "}
              para você liberar o pacote adicional do{" "}
              <span className="text-white font-semibold">Monitex.app</span>.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mx-3">
                <div>
                  <h2 className="text-2xl font-black text-purple-400 flex justify-between items-center">
                    Lista Negra
                    <span className="shrink-0 mt-1 text-[11px] px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-100">
                      Exclusivo
                    </span>
                  </h2>
                  <p className="mt-3 text-white/70 text-md text-center leading-relaxed">
                    Crie uma "lista negra" dos perfis que você quer monitorar e
                    receba alertas sobra qualquer interação!
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5 mx-6">
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-purple-400 mt-[2px]" />
                  <div>
                    <div className="font-semibold text-white">
                      Criação de listas personalizadas de perfis suspeitos.
                    </div>
                    <div className="text-sm text-white/60 mt-1 leading-relaxed">
                      Crie uma lista totalmente personalizada com contatos que
                      você deseja monitorar e seja notificado caso haja qualquer
                      interação suspeita.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-purple-400 mt-[2px]" />
                  <div>
                    <div className="font-semibold text-white">
                      Notificações em tempo real no seu celular
                    </div>
                    <div className="text-sm text-white/60 mt-1 leading-relaxed">
                      Se a pessoa monitorada curtir, comentar ou interagir com
                      alguém da sua lista negra, você será notificado em tempo
                      real.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-purple-400 mt-[2px]" />
                  <div>
                    <div className="font-semibold text-white">
                      Registro detalhado das interações espionadas
                    </div>
                    <div className="text-sm text-white/60 mt-1 leading-relaxed">
                      Acesse o histórico completo com data e hora de cada
                      interação e mantenha evidências sempre à mão.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/35 p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-white/40 text-xs line-through">
                    R$89,90
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
                    R$40 OFF
                  </span>
                </div>

                <div className="text-6xl font-black text-purple-400 leading-none">
                  R$49<span className="text-2xl">,90</span>
                </div>
                <div className="text-[11px] text-white/55 mt-2">
                  Pagamento único
                </div>
              </div>

              <button
                onClick={goCheckout}
                className="mt-6 w-full rounded-2xl cursor-pointer bg-gradient-to-br from-purple-500 to-purple-700 py-5 font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.40)] hover:opacity-95 active:scale-[0.99] transition"
              >
                <span className="inline-flex items-center justify-center gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar ao plano
                </span>
                <div className="text-[12px] font-semibold text-white/85 mt-1">
                  Apenas 7 vagas restantes
                </div>
              </button>
            </div>
          </div>

          <footer className="mt-12 text-center text-white/40 text-xs">
            <div className="font-bold tracking-widest text-white/50">
              MONITEX.APP
            </div>
            <div className="mt-2">
              © 2026 Monitex — Todos os direitos reservados.
            </div>

            <div className="mt-3 flex items-center justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-white/70 underline underline-offset-4">
                    Termos de Uso
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[720px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Termos de Uso — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2 rounded-xl border border-white/5 bg-black/30 p-4">
                    <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-white/80">
                      {TERMS_TEXT}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-white/70 underline underline-offset-4">
                    Política de Privacidade
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[720px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Política de Privacidade — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2 rounded-xl border border-white/5 bg-black/30 p-4">
                    <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-white/80">
                      {PRIVACY_TEXT}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
