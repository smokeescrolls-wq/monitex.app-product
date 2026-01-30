import crypto from "crypto";

export const runtime = "nodejs";

function computeShaSign(data: Record<string, string>, passphrase: string) {
  const keys = Object.keys(data)
    .filter((k) => k.toLowerCase() !== "sha_sign")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let s = "";
  for (const k of keys) s += `${k}=${data[k] ?? ""}${passphrase}`;

  return crypto.createHash("sha512").update(s, "utf8").digest("hex").toUpperCase();
}

async function readPayload(req: Request): Promise<Record<string, string>> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const j = (await req.json().catch(() => null)) as unknown;
    if (!j || typeof j !== "object") return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(j as Record<string, unknown>)) {
      out[String(k)] = typeof v === "string" ? v : v == null ? "" : String(v);
    }
    return out;
  }

  const raw = await req.text();
  const sp = new URLSearchParams(raw);
  const out: Record<string, string> = {};
  for (const [k, v] of sp.entries()) out[k] = v;
  return out;
}

export async function GET() {
  return new Response("OK", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}

export async function POST(req: Request) {
  const passphrase = process.env.DIGISTORE24_SHA_PASSPHRASE;
  if (!passphrase) {
    return new Response("missing passphrase", {
      status: 500,
      headers: { "content-type": "text/plain" },
    });
  }

  const allowUnsigned =
    (process.env.DIGISTORE24_IPN_ALLOW_UNSIGNED ?? "false").toLowerCase() === "true";
  const debug =
    (process.env.DIGISTORE24_IPN_DEBUG ?? "false").toLowerCase() === "true";

  const data = await readPayload(req);

  if (allowUnsigned) {
    if (debug) console.log("[D24 IPN] allowUnsigned=true payload:", data);
    return new Response("OK", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  const received = (data.sha_sign ?? "").toUpperCase();
  const computed = computeShaSign(data, passphrase);

  if (debug) {
    console.log("[D24 IPN] received:", received);
    console.log("[D24 IPN] computed:", computed);
    console.log("[D24 IPN] keys:", Object.keys(data));
  }

  if (!received || received !== computed) {
    return new Response("invalid signature", {
      status: 401,
      headers: { "content-type": "text/plain" },
    });
  }

  return new Response("OK", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
