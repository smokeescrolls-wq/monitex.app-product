export function maskUsername(username: string) {
  if (!username) return "xxx*****";
  if (username.includes("*")) return username;
  const visible = username.length >= 3 ? username.slice(0, 3) : username;
  return `${visible}*****`;
}

export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getChatIdentity() {
  if (typeof window === "undefined") return { name: "Jo*****", photo: "" };

  const name = sessionStorage.getItem("chat-1-user-name") ?? "Joana";
  const photo = sessionStorage.getItem("chat-1-user-photo") ?? "";

  return { name: maskUsername(name), photo };
}

export function getFirstNameFromProfile() {
  if (typeof window === "undefined") return "Você";

  const profile = safeJsonParse<{ full_name?: string; username?: string }>(
    localStorage.getItem("instagram_profile"),
  );

  const raw =
    (profile?.full_name && profile.full_name.trim()) ||
    (profile?.username && profile.username.trim()) ||
    localStorage.getItem("espionado_username") ||
    localStorage.getItem("username") ||
    "você";

  const first = String(raw).split(" ")[0] || "você";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}
