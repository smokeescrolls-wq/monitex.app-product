import {
  Instagram,
  MessageSquareText,
  Facebook,
  MapPin,
  Phone,
  Camera,
  Share2,
} from "lucide-react";

export type ServiceBadge = {
  label: string;
  tone: "success" | "warning" | "info" | "neutral";
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: any;
  badge?: ServiceBadge;
  cost?: number;
  progress?: number;
};

export const contractedServices: ServiceItem[] = [
  {
    id: "ig",
    title: "Instagram",
    description: "@gbi",
    icon: Instagram,
    progress: 6,
  },
];

export const availableServices: ServiceItem[] = [
  {
    id: "instagram",
    title: "Instagram",
    description: "View performance and engagement data and reports.",
    icon: Instagram,
    badge: { label: "Free", tone: "info" },
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Access complete conversations, audios, videos, and groups.",
    icon: MessageSquareText,
    badge: { label: "40 credits", tone: "success" },
    cost: 40,
  },
  {
    id: "facebook",
    title: "Facebook",
    description: "View data and interactions and have full access.",
    icon: Facebook,
    badge: { label: "45 credits", tone: "info" },
    cost: 45,
  },
  {
    id: "location",
    title: "Location",
    description: "Track in real time and see suspicious locations.",
    icon: MapPin,
    badge: { label: "60 credits", tone: "warning" },
    cost: 60,
  },
  {
    id: "sms",
    title: "SMS",
    description: "All text messages sent and received.",
    icon: Phone,
    badge: { label: "30 credits", tone: "warning" },
    cost: 30,
  },
  {
    id: "calls",
    title: "Calls",
    description: "Complete call log with duration and times.",
    icon: Phone,
    badge: { label: "25 credits", tone: "success" },
    cost: 25,
  },
  {
    id: "camera",
    title: "Camera",
    description: "Access photos and videos from the gallery, including files.",
    icon: Camera,
    badge: { label: "55 credits", tone: "info" },
    cost: 55,
  },
  {
    id: "others",
    title: "Other Networks",
    description: "Complete search in other networks and sources.",
    icon: Share2,
    badge: { label: "70 credits", tone: "warning" },
    cost: 70,
  },
];