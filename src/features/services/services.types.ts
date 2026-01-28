import type { ReactNode } from "react";
import type { ZodSchema } from "zod";

export type ServiceKey =
  | "instagram"
  | "whatsapp"
  | "facebook"
  | "location"
  | "sms"
  | "calls"
  | "camera"
  | "others";

export type ServiceAccent = {
  iconBg: string;
  iconFg: string;
  pillBg: string;
  pillFg: string;
  pillBorder: string;
};

export type ServiceConfig = {
  key: ServiceKey;
  title: string;
  description: string;
  icon: ReactNode;
  accent: ServiceAccent;
  startCostCredits: number;
  acceleratorCostCredits: number;
  target: {
    label: string;
    placeholder: string;
    schema: ZodSchema<string>;
  };
  options?: Array<{
    id: string;
    label: string;
    values: Array<{ value: string; label: string }>;
  }>;
};
