import type { ServiceKey } from "@/features/services/services.registry";

export const SERVICE_TITLES: Record<ServiceKey, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  location: "Localização",
  sms: "SMS",
  calls: "Chamadas",
  camera: "Câmera",
  others: "Outras Redes",
};
