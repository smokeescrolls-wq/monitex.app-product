import { withRtk } from "@/features/tracking/rtk.client";

export function buildCtaUrl(args?: {
  username?: string;
  photoUrl?: string | null;
  extra?: Record<string, string | null | undefined>;
}) {
  const u = (args?.username ?? "").replace(/^@/, "").trim();
  const photo = args?.photoUrl ?? undefined;

  return withRtk("/cta", {
    ...(args?.extra ?? {}),
    username: u || undefined,
    photo: photo || undefined,
    subid: u || undefined,
  });
}
