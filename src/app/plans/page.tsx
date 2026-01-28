"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  X,
  Ticket,
  ShieldCheck,
  Crown,
  Gem,
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

type PlanFeature = { label: string; included: boolean };
type Plan = {
  id: "gold" | "diamond" | "premium";
  title: string;
  subtitle: string;
  price: string;
  strike?: string;
  badge?: { text: string; tone: "blue" | "purple" };
  accent: { ring: string; title: string; button: string; price: string };
  features: PlanFeature[];
  cta: { label: string; sub: string };
  disabled?: boolean;
  disabledLabel?: string;
};

type FAQ = { q: string; a: string; open: boolean };

const TERMS_TEXT = `Última atualização: Janeiro de 2025

1. NATUREZA DO SERVIÇO E ISENÇÃO DE GARANTIAS. O Monitex.app é uma plataforma de ENTRETENIMENTO e SIMULAÇÃO. O usuário reconhece e concorda expressamente que: (a) todos os resultados, dados, informações, relatórios e conteúdos exibidos na plataforma são SIMULADOS, FICTÍCIOS e gerados por algoritmos para fins exclusivos de entretenimento; (b) a plataforma NÃO possui capacidade técnica real de acessar, hackear, invadir ou obter dados privados de redes sociais, dispositivos ou contas de terceiros; (c) qualquer semelhança entre os resultados exibidos e dados reais é mera coincidência; (d) o serviço é fornecido "COMO ESTÁ" e "CONFORME DISPONÍVEL", sem garantias de qualquer natureza, expressas ou implícitas, incluindo, mas não se limitando a, garantias de precisão, confiabilidade, adequação a um propósito específico ou não violação.

2. DECLARAÇÕES DO USUÁRIO. Ao utilizar o serviço, o usuário declara e garante que: (a) possui mais de 18 anos de idade e capacidade civil plena; (b) compreende integralmente que o serviço é de entretenimento e que os resultados são simulados e não correspondem à realidade; (c) não utilizará o serviço com a expectativa de obter informações reais sobre terceiros; (d) assume integral responsabilidade por qualquer interpretação ou uso que faça dos conteúdos exibidos; (e) não responsabilizará a plataforma por qualquer decisão tomada com base nos resultados simulados.

3. LIMITAÇÃO DE RESPONSABILIDADE. Em nenhuma circunstância o Monitex.app, seus proprietários, diretores, funcionários, parceiros ou afiliados serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais, punitivos ou exemplares, incluindo, mas não se limitando a, danos por perda de lucros, dados, uso, goodwill ou outras perdas intangíveis, resultantes de: (a) uso ou incapacidade de uso do serviço; (b) qualquer conduta ou conteúdo de terceiros no serviço; (c) conteúdo obtido do serviço; (d) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo; (e) expectativas não atendidas quanto à funcionalidade real do serviço; (f) decisões pessoais, profissionais, relacionais ou de qualquer natureza tomadas com base nos resultados simulados.

4. INDENIZAÇÃO. O usuário concorda em defender, indenizar e isentar o Monitex.app e seus proprietários, diretores, funcionários e agentes de e contra quaisquer reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas e despesas (incluindo, mas não se limitando a, honorários advocatícios) decorrentes de: (a) uso e acesso ao serviço; (b) violação de qualquer termo destes Termos de Uso; (c) violação de direitos de terceiros, incluindo, mas não se limitando a, direitos de privacidade ou propriedade intelectual; (d) qualquer alegação de que o uso do serviço causou danos a terceiros.

5. AUSÊNCIA DE RELAÇÃO. O uso do serviço não cria qualquer relação de parceria, joint venture, emprego, agência ou franquia entre o usuário e o Monitex.app.

6. POLÍTICA DE REEMBOLSO. Oferecemos garantia de satisfação de 7 (sete) dias corridos a partir da data da compra. O reembolso está sujeito a análise e pode ser solicitado através dos canais de suporte.

7. MODIFICAÇÕES. Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento, a nosso exclusivo critério. O uso continuado do serviço após quaisquer alterações constitui aceitação dos novos termos.

8. LEI APLICÁVEL E FORO. Estes termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, independentemente de conflitos de disposições legais. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.

9. INTEGRALIDADE. Estes Termos de Uso constituem o acordo integral entre o usuário e o Monitex.app e substituem todos os acordos anteriores, escritos ou verbais.

AO UTILIZAR O SERVIÇO, O USUÁRIO CONFIRMA QUE LEU, COMPREENDEU E CONCORDA COM TODOS OS TERMOS ACIMA, INCLUINDO A NATUREZA SIMULADA E DE ENTRETENIMENTO DO SERVIÇO.`;

const PRIVACY_TEXT = `Última atualização: Janeiro de 2025

1. INFORMAÇÕES COLETADAS. Coletamos informações que você nos fornece diretamente, incluindo: (a) dados de cadastro como endereço de e-mail; (b) informações de pagamento, que são processadas diretamente por nossos processadores de pagamento terceirizados e não são armazenadas em nossos servidores; (c) dados de uso e navegação coletados automaticamente através de cookies e tecnologias similares, incluindo endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e dados de cliques.

2. USO DAS INFORMAÇÕES. Utilizamos as informações coletadas para: (a) fornecer, operar e manter nosso serviço de entretenimento; (b) processar transações e enviar confirmações relacionadas; (c) enviar comunicações administrativas, atualizações e informações promocionais, dos quais você pode optar por não receber a qualquer momento; (d) analisar tendências de uso para melhorar nossa plataforma; (e) detectar, prevenir e resolver problemas técnicos e de segurança; (f) cumprir obrigações legais aplicáveis.

3. COMPARTILHAMENTO DE INFORMAÇÕES. Não vendemos, alugamos ou comercializamos suas informações pessoais. Podemos compartilhar informações com: (a) processadores de pagamento para completar transações; (b) prestadores de serviços que nos auxiliam na operação da plataforma, sujeitos a obrigações de confidencialidade; (c) autoridades governamentais ou legais quando exigido por lei, ordem judicial ou processo legal; (d) terceiros em caso de fusão, aquisição ou venda de ativos, mediante notificação prévia.

4. COOKIES E TECNOLOGIAS DE RASTREAMENTO. Utilizamos cookies, web beacons e tecnologias similares para coletar informações sobre sua interação com nosso serviço. Você pode configurar seu navegador para recusar cookies, porém isso pode afetar a funcionalidade do serviço. Ao continuar usando o serviço, você consente com o uso de cookies conforme descrito nesta política.

5. SEGURANÇA DOS DADOS. Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.

6. SEUS DIREITOS (LGPD). Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: (a) confirmação da existência de tratamento; (b) acesso aos dados; (c) correção de dados incompletos, inexatos ou desatualizados; (d) anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos; (e) portabilidade dos dados; (f) eliminação dos dados pessoais tratados com consentimento; (g) informação sobre compartilhamento de dados; (h) revogação do consentimento. Para exercer esses direitos, entre em contato através dos canais de suporte.

7. RETENÇÃO DE DADOS. Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.

8. MENORES DE IDADE. Nosso serviço é destinado exclusivamente a pessoas maiores de 18 anos.

9. TRANSFERÊNCIA INTERNACIONAL. Suas informações podem ser transferidas e mantidas em servidores localizados fora do seu país.

10. ALTERAÇÕES. Podemos atualizar esta política periodicamente.

11. CONTATO. Para dúvidas sobre esta política, entre em contato através dos canais de suporte disponíveis na plataforma.`;

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "purple" | "gold";
}) {
  const cls =
    tone === "blue"
      ? "bg-[#3b82f6]/20 border-[#3b82f6]/30 text-[#93c5fd]"
      : tone === "gold"
        ? "bg-[#f59e0b]/20 border-[#f59e0b]/30 text-[#fde68a]"
        : "bg-purple-500/20 border-purple-500/30 text-purple-200";
  return (
    <span
      className={`text-[11px] px-3 py-1.5 rounded-full border ${cls} inline-flex items-center gap-2`}
    >
      {children}
    </span>
  );
}

export default function PlanosPage() {
  const matrixCanvas = useRef<HTMLCanvasElement>(null);

  const CHECKOUT_URL =
    process.env.NEXT_PUBLIC_PLANO_CHECKOUT_URL ||
    "https://exemplo.com/checkout";

  const [progress, setProgress] = useState(55);

  const [faq, setFaq] = useState<FAQ[]>([
    {
      q: "Posso trocar de plano depois?",
      a: "Sim. Você pode ajustar seu plano a qualquer momento, conforme disponibilidade.",
      open: false,
    },
    {
      q: "O pagamento é único ou recorrente?",
      a: "Depende do plano selecionado. As informações completas aparecem na finalização.",
      open: false,
    },
    {
      q: "Como funciona o suporte?",
      a: "O suporte varia por plano. Você verá os canais e horários disponíveis após a compra.",
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

  const brand = useMemo(() => ({ name: "MONITEX.APP" }), []);

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "gold",
        title: "Gold",
        subtitle: "Plano",
        price: "R$67,00",
        accent: {
          ring: "ring-[#f59e0b]/40",
          title: "text-[#fbbf24]",
          button: "bg-[#f59e0b] hover:bg-[#fbbf24] text-black",
          price: "text-[#fbbf24]",
        },
        features: [
          { label: "Acesso por período (7 dias)", included: true },
          { label: "Busca de apenas 1 perfil", included: true },
          { label: "Monitoramento apenas do Instas", included: true },
          { label: "Suporte em horário comercial pelo email", included: true },
          { label: "Localização em Tempo Real", included: false },
          {
            label: "Galeria de Fotos (incluindo fotos apagadas)",
            included: false,
          },
          { label: "BRINDE: Espião Completo do Facebook", included: false },
          { label: "BRINDE: Espião Completo do Messenger", included: false },
        ],
        cta: { label: "Selecionar Plano Básico", sub: "Vagas limitadas" },
        disabled: true,
        disabledLabel: "Vagas temporariamente esgotadas para este plano",
      },
      {
        id: "diamond",
        title: "Diamond",
        subtitle: "Plano",
        price: "R$97,00",
        strike: "R$132,00",
        badge: { text: "Mais Vendido", tone: "blue" },
        accent: {
          ring: "ring-[#60a5fa]/35",
          title: "text-[#60a5fa]",
          button: "bg-[#60a5fa] hover:bg-[#3b82f6] text-black",
          price: "text-[#60a5fa]",
        },
        features: [
          { label: "Acesso por período (1 mês)", included: true },
          { label: "Busca de 3 perfis", included: true },
          { label: "Monitoramento Completo", included: true },
          { label: "Suporte 24h pelo WhatsApp", included: true },
          { label: "Localização em Tempo Real", included: true },
          {
            label: "Galeria de Fotos (incluindo fotos apagadas)",
            included: true,
          },
          { label: "BRINDE: Espião Completo do Facebook", included: false },
          { label: "BRINDE: Espião Completo do Messenger", included: false },
        ],
        cta: {
          label: "Selecionar Mais Vendido",
          sub: "71 vagas • Pagamento único",
        },
      },
      {
        id: "premium",
        title: "Premium",
        subtitle: "Plano",
        price: "R$127,00",
        strike: "R$254,00",
        badge: { text: "Melhor Custo Benefício", tone: "purple" },
        accent: {
          ring: "ring-purple-500/35",
          title: "text-purple-300",
          button:
            "bg-gradient-to-br from-purple-500 to-purple-700 hover:opacity-95 text-white",
          price: "text-purple-300",
        },
        features: [
          { label: "Acesso Vitalício a Todos os Apps", included: true },
          { label: "Busca de Perfis ILIMITADOS", included: true },
          { label: "Monitoramento Completo", included: true },
          { label: "Suporte 24h pelo WhatsApp", included: true },
          { label: "Localização em Tempo Real", included: true },
          {
            label: "Galeria de Fotos (incluindo fotos apagadas)",
            included: true,
          },
          { label: "BRINDE: Espião Completo do Facebook", included: true },
          { label: "BRINDE: Espião Completo do Messenger", included: true },
        ],
        cta: { label: "Selecionar Custo Benefício", sub: "Pagamento único" },
        disabled: true,
        disabledLabel: "Vagas temporariamente esgotadas para este plano",
      },
    ],
    [],
  );

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
      const nextCols = Math.floor(canvas.width / fontSize);
      if (nextCols !== columns) {
        columns = nextCols;
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

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p < 78 ? p + 1 : p));
    }, 220);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas
        ref={matrixCanvas}
        className="fixed inset-0 w-full h-full opacity-20 pointer-events-none z-0"
      />
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-[#166534]/90 border-b border-green-900/40 backdrop-blur-md px-4 py-3">
          <div className="max-w-[520px] mx-auto flex flex-col items-center justify-center gap-2 text-sm">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-30 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-300 shadow-[0_0_10px_rgba(134,239,172,0.65)]" />
              </span>

              <span className="font-semibold">
                Sua identidade está preservada!
              </span>
            </div>

            <span className="text-white/70">
              Conexão Segura • Firewall ativo V4.2.1
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="w-full max-w-[520px] mx-auto">
          <div className="flex flex-col items-center gap-3 mb-10">
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

            <div className="w-full max-w-[440px] mt-3">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-5">
              <Ticket className="w-5 h-5 text-purple-300" />
              <h1 className="text-4xl font-black">
                Escolha seu <span className="text-purple-500">Plano</span>
              </h1>
            </div>

            <p className="text-white/70 text-md leading-relaxed mx-4">
              Agora que sua conta está com o{" "}
              <span className="text-white font-semibold">firewall ativo</span> e
              sua{" "}
              <span className="text-white font-semibold">
                identidade preservada
              </span>
              , selecione com qual{" "}
              <span className="text-white font-semibold">plano</span> você
              deseja prosseguir.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                {plan.badge ? (
                  <div className="absolute -top-3 right-4 z-20">
                    <Pill tone={plan.badge.tone === "blue" ? "blue" : "purple"}>
                      {plan.badge.text}
                    </Pill>
                  </div>
                ) : null}

                <div
                  className={[
                    "bg-black/40 border backdrop-blur-md rounded-[28px] shadow-2xl p-6 relative overflow-hidden",
                    plan.id === "gold"
                      ? "border-[#f59e0b]/35"
                      : plan.id === "diamond"
                        ? "border-[#60a5fa]/35"
                        : "border-purple-500/25",
                    plan.disabled ? "opacity-45" : "opacity-100",
                  ].join(" ")}
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <div className="text-center">
                    <div className={`text-2xl font-black ${plan.accent.title}`}>
                      {plan.title}
                    </div>
                    <div className="text-white/60 text-sm font-semibold -mt-1">
                      {plan.subtitle}
                    </div>
                  </div>

                  <div
                    className={[
                      "mt-5 bg-black/30 border border-white/10 rounded-2xl p-6 text-center",
                      "ring-1",
                      plan.accent.ring,
                    ].join(" ")}
                  >
                    {plan.strike ? (
                      <div className="text-white/35 text-xs line-through mb-1">
                        {plan.strike}
                      </div>
                    ) : (
                      <div className="h-[18px]" />
                    )}

                    <div className={`text-5xl font-black ${plan.accent.price}`}>
                      {plan.price}
                    </div>

                    <div className="mt-4 space-y-2 text-left">
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          {f.included ? (
                            <Check className="w-4 h-4 mt-0.5 text-white/80" />
                          ) : (
                            <X className="w-4 h-4 mt-0.5 text-red-400/70" />
                          )}
                          <span
                            className={[
                              "text-sm",
                              f.included ? "text-white/75" : "text-white/35",
                            ].join(" ")}
                          >
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!!plan.disabled}
                    onClick={goCheckout}
                    className={[
                      "mt-5 w-full rounded-2xl py-4 cursor-pointer font-black shadow-lg transition",
                      plan.accent.button,
                      plan.disabled
                        ? "cursor-not-allowed grayscale"
                        : "active:scale-[0.99]",
                    ].join(" ")}
                  >
                    {plan.cta.label}
                    <div className="text-[11px] font-semibold opacity-80 mt-1">
                      {plan.cta.sub}
                    </div>
                  </button>

                  {plan.disabled ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
                      <div className="w-full rounded-2xl bg-black/70 border border-white/10 px-4 py-3 text-center">
                        <div className="text-white/90 font-bold text-sm">
                          {plan.disabledLabel}
                        </div>
                        <div className="text-white/60 text-[11px] mt-1">
                          Selecione o plano disponível para continuar.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-20 text-center text-white/40 text-xs">
            <div className="font-bold tracking-widest text-white/50">
              MONITEX.APP
            </div>
            <div className="mt-2">
              © 2026 Monitex — Todos os direitos reservados.
            </div>

            <div className="mt-3 flex items-center justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-white/70 underline underline-offset-4 cursor-pointer">
                    Termos de Uso
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[820px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Termos de Uso — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <pre className="whitespace-pre-wrap text-[11px] text-white/80 leading-relaxed">
                      {TERMS_TEXT}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="hover:text-white/70 underline underline-offset-4 cursor-pointer">
                    Política de Privacidade
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[820px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Política de Privacidade — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <pre className="whitespace-pre-wrap text-[11px] text-white/80 leading-relaxed">
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
