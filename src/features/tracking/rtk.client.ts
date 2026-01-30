export const RTK_KEYS = [
  "rtkcmpid",
  "rtkck",
  "rtkcid",
  "clickid",
  "tid",
  "subid",
  "cid",
] as const;

export type RtkKey = (typeof RTK_KEYS)[number];
export type RtkParams = Partial<Record<RtkKey, string>>;

function isClient() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getCookie(name: string) {
  if (!isClient()) return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  if (!isClient()) return;
  const dt = new Date();
  dt.setTime(dt.getTime() + days * 864e5);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${dt.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

export function pickRtkFromSearch(search?: URLSearchParams): RtkParams {
  if (!isClient()) return {};
  const sp = search ?? new URLSearchParams(window.location.search);
  const out: RtkParams = {};
  for (const k of RTK_KEYS) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function persistRtkFromUrl(search?: URLSearchParams) {
  const rtk = pickRtkFromSearch(search);
  for (const [k, v] of Object.entries(rtk)) {
    if (v) setCookie(`rtk_${k}`, v, 30);
  }
  return rtk;
}

export function readRtkFromCookies(): RtkParams {
  if (!isClient()) return {};
  const out: RtkParams = {};
  for (const k of RTK_KEYS) {
    const v = getCookie(`rtk_${k}`);
    if (v) out[k] = v;
  }
  return out;
}

export function buildQuery(params: Record<string, string | null | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export function withRtk(
  base: string,
  extra?: Record<string, string | null | undefined>,
) {
  if (!isClient()) return base;

  const fromUrl = pickRtkFromSearch();
  const fromCookie = readRtkFromCookies();
  const merged: Record<string, string> = { ...fromCookie, ...fromUrl } as Record<
    string,
    string
  >;

  const finalParams: Record<string, string | null | undefined> = {
    ...merged,
    ...(extra ?? {}),
  };

  return `${base}${buildQuery(finalParams)}`;
}

export function buildClickUrl(args?: {
  username?: string;
  extra?: Record<string, string | null | undefined>;
}) {
  const u = (args?.username ?? "").replace(/^@/, "").trim();
  return withRtk("https://trk.ozemgummy.com/click", {
    ...(args?.extra ?? {}),
    subid: u || undefined,
  });
}
