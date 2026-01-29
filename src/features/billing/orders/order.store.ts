import type { Digistore24Event } from "../digistore24/normalize";

const seen = new Set<string>();
const events: Array<{ evt: Digistore24Event; raw: Record<string, string> }> = [];

export async function ensureIdempotency(key: string) {
  if (seen.has(key)) return true;
  seen.add(key);
  return false;
}

export async function recordOrderEvent(evt: Digistore24Event, raw: Record<string, string>) {
  events.push({ evt, raw });
}

export async function listOrderEvents() {
  return events.slice(-50);
}
