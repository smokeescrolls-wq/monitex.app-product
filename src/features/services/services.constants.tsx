import { z } from "zod";
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
import type { ServiceConfig } from "./services.types";

const handleSchema = z
  .string()
  .trim()
  .min(2, "Digite um identificador válido.")
  .max(30, "Máximo de 30 caracteres.")
  .regex(/^[a-zA-Z0-9._-]+$/, "Use apenas letras, números, ponto, _ ou -.");

export const SERVICES: ServiceConfig[] = [
  {
    key: "instagram",
    title: "Instagram",
    description: "Veja fotos curtidas, posts e relatórios do direct.",
    icon: <Instagram className="h-4 w-4" />,
    startCostCredits: 0,
    acceleratorCostCredits: 30,
    target: {
      label: "Usuário",
      placeholder: "usuario",
      schema: handleSchema,
    },
    options: [
      {
        id: "scope",
        label: "Tipo de análise",
        values: [
          { value: "overview", label: "Visão geral" },
          { value: "engagement", label: "Engajamento" },
          { value: "content", label: "Conteúdo" },
        ],
      },
    ],
    accent: {
      iconBg: "bg-pink-500/15",
      iconFg: "text-pink-400",
      pillBg: "bg-violet-500/15",
      pillFg: "text-violet-200",
      pillBorder: "border-violet-500/20",
    },
  },
  {
    key: "whatsapp",
    title: "WhatsApp",
    description: "Acesse conversas completas, áudios, vídeos e grupos.",
    icon: <MessageCircle className="h-4 w-4" />,
    startCostCredits: 40,
    acceleratorCostCredits: 30,
    target: {
      label: "Número",
      placeholder: "DDD + número",
      schema: z.string().trim().min(8, "Digite um número válido."),
    },
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
    description: "Veja interações e tenha acesso completo ao Messenger.",
    icon: <Facebook className="h-4 w-4" />,
    startCostCredits: 45,
    acceleratorCostCredits: 30,
    target: { label: "Usuário", placeholder: "usuario", schema: handleSchema },
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
    description: "Rastreie em tempo real e veja locais visitados.",
    icon: <MapPin className="h-4 w-4" />,
    startCostCredits: 60,
    acceleratorCostCredits: 30,
    target: { label: "ID", placeholder: "identificador", schema: handleSchema },
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
    description: "Todas as mensagens de texto enviadas e recebidas.",
    icon: <MessageSquareText className="h-4 w-4" />,
    startCostCredits: 30,
    acceleratorCostCredits: 30,
    target: { label: "ID", placeholder: "identificador", schema: handleSchema },
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
    description: "Registro completo de ligações com duração e horários.",
    icon: <Phone className="h-4 w-4" />,
    startCostCredits: 25,
    acceleratorCostCredits: 30,
    target: { label: "ID", placeholder: "identificador", schema: handleSchema },
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
    description: "Acesse fotos e vídeos da galeria, incluindo arquivos.",
    icon: <Camera className="h-4 w-4" />,
    startCostCredits: 55,
    acceleratorCostCredits: 30,
    target: { label: "ID", placeholder: "identificador", schema: handleSchema },
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
    description: "Busca completa em redes conectadas e relatórios gerais.",
    icon: <Share2 className="h-4 w-4" />,
    startCostCredits: 70,
    acceleratorCostCredits: 30,
    target: { label: "Usuário", placeholder: "usuario", schema: handleSchema },
    accent: {
      iconBg: "bg-red-500/15",
      iconFg: "text-red-300",
      pillBg: "bg-red-500/12",
      pillFg: "text-red-200",
      pillBorder: "border-red-500/20",
    },
  },
];
