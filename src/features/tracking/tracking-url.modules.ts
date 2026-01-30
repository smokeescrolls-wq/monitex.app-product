export function withTrackingParams(path: string, sp: URLSearchParams) {
  const url = new URL(path, "https://local");
  for (const [k, v] of sp.entries()) {
    if (k === "ts") continue;
    url.searchParams.set(k, v);
  }
  return url.pathname + "?" + url.searchParams.toString();
}
