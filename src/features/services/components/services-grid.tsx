"use client";

import {
  Instagram,
  MessageCircle,
  Facebook,
  MapPin,
  MessageSquareText,
  Phone,
  Camera,
  Share2,
} from "lucide-react";

type Service = {
  key: string;
  title: string;
  description: string;
  creditsLabel: string;
  icon: React.ReactNode;
  accent: {
    iconBg: string;
    iconFg: string;
    pillBg: string;
    pillFg: string;
    pillBorder: string;
  };
  rightPill?: {
    label: string;
    bg: string;
    fg: string;
    border: string;
  };
};

const services: Service[] = [
  {
    key: "instagram",
    title: "Instagram",
    description:
      "Veja métricas de curtidas, posts e insights do perfil (com permissão).",
    creditsLabel: "Grátis",
    icon: <Instagram className="h-4 w-4" />,
    accent: {
      iconBg: "bg-pink-500/15",
      iconFg: "text-pink-400",
      pillBg: "bg-violet-500/15",
      pillFg: "text-violet-200",
      pillBorder: "border-violet-500/20",
    },
    rightPill: {
      label: "Grátis",
      bg: "bg-violet-500/15",
      fg: "text-violet-200",
      border: "border-violet-500/20",
    },
  },
  {
    key: "whatsapp",
    title: "WhatsApp",
    description:
      "Acesse conversas do seu atendimento/inbox conectado (com consentimento).",
    creditsLabel: "40 créditos",
    icon: <MessageCircle className="h-4 w-4" />,
    accent: {
      iconBg: "bg-emerald-500/15",
      iconFg: "text-emerald-300",
      pillBg: "bg-emerald-500/12",
      pillFg: "text-emerald-200",
      pillBorder: "border-emerald-500/20",
    },
  },
  {
    key: "facebook",
    title: "Facebook",
    description: "Veja dados de páginas/conteúdo conectado (via integração).",
    creditsLabel: "45 créditos",
    icon: <Facebook className="h-4 w-4" />,
    accent: {
      iconBg: "bg-sky-500/15",
      iconFg: "text-sky-300",
      pillBg: "bg-sky-500/12",
      pillFg: "text-sky-200",
      pillBorder: "border-sky-500/20",
    },
  },
  {
    key: "location",
    title: "Localização",
    description: "Dados de localização do próprio usuário (check-in / opt-in).",
    creditsLabel: "60 créditos",
    icon: <MapPin className="h-4 w-4" />,
    accent: {
      iconBg: "bg-orange-500/15",
      iconFg: "text-orange-300",
      pillBg: "bg-orange-500/12",
      pillFg: "text-orange-200",
      pillBorder: "border-orange-500/20",
    },
  },
  {
    key: "sms",
    title: "SMS",
    description: "Importação de SMS do próprio dispositivo (opt-in).",
    creditsLabel: "30 créditos",
    icon: <MessageSquareText className="h-4 w-4" />,
    accent: {
      iconBg: "bg-yellow-500/15",
      iconFg: "text-yellow-300",
      pillBg: "bg-yellow-500/12",
      pillFg: "text-yellow-200",
      pillBorder: "border-yellow-500/20",
    },
  },
  {
    key: "calls",
    title: "Chamadas",
    description: "Registro de chamadas do próprio dispositivo (opt-in).",
    creditsLabel: "25 créditos",
    icon: <Phone className="h-4 w-4" />,
    accent: {
      iconBg: "bg-lime-500/15",
      iconFg: "text-lime-300",
      pillBg: "bg-lime-500/12",
      pillFg: "text-lime-200",
      pillBorder: "border-lime-500/20",
    },
  },
  {
    key: "camera",
    title: "Câmera",
    description: "Uploads/arquivos enviados pelo usuário (opt-in).",
    creditsLabel: "55 créditos",
    icon: <Camera className="h-4 w-4" />,
    accent: {
      iconBg: "bg-fuchsia-500/15",
      iconFg: "text-fuchsia-300",
      pillBg: "bg-fuchsia-500/12",
      pillFg: "text-fuchsia-200",
      pillBorder: "border-fuchsia-500/20",
    },
  },
  {
    key: "others",
    title: "Outras Redes",
    description: "Integrações e relatórios de redes conectadas.",
    creditsLabel: "70 créditos",
    icon: <Share2 className="h-4 w-4" />,
    accent: {
      iconBg: "bg-red-500/15",
      iconFg: "text-red-300",
      pillBg: "bg-red-500/12",
      pillFg: "text-red-200",
      pillBorder: "border-red-500/20",
    },
  },
];

export function ServicesGrid() {
  return (
    <section className="w-full">
      <div className="mb-3 flex items-center gap-2 text-white/85">
        <span className="text-xs font-semibold">Serviços Disponíveis</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <div
            key={s.key}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "grid h-9 w-9 place-items-center rounded-xl border border-white/10",
                    s.accent.iconBg,
                    s.accent.iconFg,
                  ].join(" ")}
                >
                  {s.icon}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white/90">
                    {s.title}
                  </div>
                </div>
              </div>

              {s.rightPill ? (
                <span
                  className={[
                    "shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold",
                    s.rightPill.bg,
                    s.rightPill.fg,
                    s.rightPill.border,
                  ].join(" ")}
                >
                  {s.rightPill.label}
                </span>
              ) : null}
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-white/55">
              {s.description}
            </p>

            <div className="mt-3">
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold",
                  s.accent.pillBg,
                  s.accent.pillFg,
                  s.accent.pillBorder,
                ].join(" ")}
              >
                {s.creditsLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
