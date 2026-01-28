"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShieldCheck, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type FAQ = {
  q: string;
  a: string;
  open: boolean;
};

export default function GarantiaPage() {
  const matrixCanvas = useRef<HTMLCanvasElement>(null);

  const CHECKOUT_URL =
    process.env.NEXT_PUBLIC_GARANTIA_CHECKOUT_URL ||
    "https://exemplo.com/checkout-garantia";

  const [faq, setFaq] = useState<FAQ[]>([
    {
      q: "Por que devo pagar essa garantia?",
      a: "A Garantia Premium protege 100% do seu investimento. Com ela, você tem direito ao reembolso total caso o app não funcione como esperado.",
      open: false,
    },
    {
      q: "Como recebo meu reembolso se algo der errado?",
      a: "Basta entrar em contato com nosso suporte pelo WhatsApp e solicitar o reembolso. Processamos em até 5 dias úteis, sem burocracia.",
      open: false,
    },
    {
      q: "É um pagamento único ou recorrente?",
      a: "É um pagamento único e vitalício. Você paga apenas uma vez e fica protegido para sempre.",
      open: false,
    },
  ]);

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

7. RETENÇÃO DE DADOS. Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Dados de transações financeiras são mantidos conforme exigências fiscais e contábeis aplicáveis.

8. MENORES DE IDADE. Nosso serviço é destinado exclusivamente a pessoas maiores de 18 anos. Não coletamos intencionalmente informações de menores de idade. Se tomarmos conhecimento de que coletamos dados de menor, tomaremos medidas para excluir essas informações.

9. TRANSFERÊNCIA INTERNACIONAL. Suas informações podem ser transferidas e mantidas em servidores localizados fora do seu estado, província, país ou outra jurisdição governamental, onde as leis de proteção de dados podem diferir. Ao usar nosso serviço, você consente com essa transferência.

10. ALTERAÇÕES. Podemos atualizar esta política periodicamente. Mudanças significativas serão notificadas por e-mail ou através de aviso destacado em nosso serviço. O uso continuado após alterações constitui aceitação da política revisada.

11. CONTATO. Para dúvidas sobre esta política ou para exercer seus direitos, entre em contato através dos canais de suporte disponíveis na plataforma.`;

  const toggleFaq = (i: number) => {
    setFaq((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, open: !it.open } : it)),
    );
  };

  const goCheckout = () => {
    window.open(CHECKOUT_URL, "_blank");
  };

  /* Matrix background */
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
      if (Math.floor(canvas.width / fontSize) !== columns) {
        columns = Math.floor(canvas.width / fontSize);
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

    const id = setInterval(draw, 50);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <canvas
        ref={matrixCanvas}
        className="fixed inset-0 w-full h-full opacity-20 pointer-events-none z-0"
      />

      <div className="relative z-10 px-6 py-16">
        <div className="max-w-[480px] mx-auto">
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

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <h1 className="text-3xl font-black">
                Garantia <span className="text-purple-500">Premium</span>
              </h1>
            </div>

            <p className="text-white/80 font-semibold text-md leading-relaxed">
              Você ganhou o benefício de{" "}
              <span className="text-white">100% de segurança</span>, com direito
              a <span className="text-white">reembolso total</span> caso o
              aplicativo não funcione como esperado.
            </p>

            <p className="text-white/60 text-md mt-4 leading-relaxed">
              A partir de agora, você estará pagando essa taxa para ativar seu
              código de reembolso e garantir a{" "}
              <b className="text-white">proteção incondicional da sua compra</b>
              , caso o produto não funcione como o prometido.
            </p>

            <p className="text-white/80 font-semibold mt-4">
              Finalize o pagamento da Garantia Premium agora para ativar todas
              as funções com segurança total.
            </p>
          </div>

          {/* Card Oferta */}
          <div className="bg-black/40 border border-purple-500/20 backdrop-blur-md rounded-[28px] shadow-2xl p-6 pt-10 relative overflow-hidden mb-10">
            <div className="text-center mb-6">
              <span className="text-purple-400 font-black tracking-widest">
                Oferta Especial
              </span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-white/40 text-xs line-through">
                  R$199,00
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
                  R$120 OFF
                </span>
              </div>

              <div className="text-5xl font-black text-purple-400">
                R$79<span className="text-2xl">,00</span>
              </div>
              <div className="text-[11px] text-white/50 mt-1">
                Pagamento único
              </div>
            </div>

            <button
              onClick={goCheckout}
              className="w-full rounded-2xl bg-gradient-to-br cursor-pointer from-purple-500 to-purple-700 py-4 font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:opacity-95 transition"
            >
              <span className="inline-flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Quero ter Garantia
              </span>
              <div className="text-[11px] font-semibold text-white/80 mt-1">
                Proteção total do seu investimento
              </div>
            </button>
          </div>

          {/* FAQ */}
          <div className="bg-black/40 border border-white/10 backdrop-blur-md rounded-[22px] p-6">
            <h2 className="text-center font-black text-lg mb-4">
              Dúvidas Frequentes
            </h2>

            <div className="flex flex-col gap-3">
              {faq.map((it, i) => (
                <div
                  key={i}
                  className={`rounded-xl border border-white/10 bg-white/5 ${
                    it.open ? "border-purple-500/30" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-4 py-3 flex items-center cursor-pointer justify-between text-left"
                  >
                    <span className="text-sm font-semibold text-white/85">
                      {it.q}
                    </span>
                    {it.open ? (
                      <ChevronUp className="w-5 h-5 text-purple-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-300" />
                    )}
                  </button>

                  {it.open && (
                    <div className="px-4 pb-4 text-xs text-white/60 leading-relaxed border-t border-white/10 pt-3">
                      {it.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-10 text-center text-white/40 text-xs">
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
                <DialogContent className="max-w-[720px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Termos de Uso — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <pre className="whitespace-pre-wrap text-[9px] text-white/80 leading-relaxed">
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
                <DialogContent className="max-w-[720px] bg-[#0b0b0f] border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Política de Privacidade — Monitex.app
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <pre className="whitespace-pre-wrap text-[9px] text-white/80 leading-relaxed">
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
