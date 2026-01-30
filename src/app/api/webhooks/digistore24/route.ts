import crypto from "crypto";

export const runtime = "nodejs";

function isEmptyValue(v: unknown) {
  return v == null || v === "" || v === false;
}

function computeShaSign(data: Record<string, string>, passphrase: string) {
  const keys = Object.keys(data)
    .filter((k) => {
      const kk = k.toLowerCase();
      return kk !== "sha_sign" && kk !== "shasign";
    })
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let s = "";
  for (const k of keys) {
    const value = data[k];
    if (isEmptyValue(value)) continue;
    s += `${k}=${value}${passphrase}`;
  }

  return crypto.createHash("sha512").update(s, "utf8").digest("hex").toUpperCase();
}

async function readPayload(req: Request): Promise<Record<string, string>> {
  const contentType = (req.headers.get("content-type") ?? "").toLowerCase();

  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData().catch(() => null);
    const out: Record<string, string> = {};
    if (!fd) return out;

    for (const [k, v] of fd.entries()) {
      out[String(k)] = typeof v === "string" ? v : (v as File).name ?? "";
    }
    return out;
  }

  if (contentType.includes("application/json")) {
    const j = (await req.json().catch(() => null)) as unknown;
    const out: Record<string, string> = {};
    if (!j || typeof j !== "object") return out;

    for (const [k, v] of Object.entries(j as Record<string, unknown>)) {
      if (v == null) continue;
      out[String(k)] = typeof v === "string" ? v : String(v);
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
  return new Response("OK", { status: 200, headers: { "content-type": "text/plain" } });
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
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
  const debug = (process.env.DIGISTORE24_IPN_DEBUG ?? "false").toLowerCase() === "true";

  const data = await readPayload(req);

  if (allowUnsigned) {
    if (debug) console.log("[D24 IPN] allowUnsigned=true payload:", data);
    return new Response("OK", { status: 200, headers: { "content-type": "text/plain" } });
  }

  const received = String(data.sha_sign ?? data.SHASIGN ?? "").toUpperCase();
  const computed = computeShaSign(data, passphrase);

  if (debug) {
    console.log("[D24 IPN] keys:", Object.keys(data));
    console.log("[D24 IPN] received:", received);
    console.log("[D24 IPN] computed:", computed);
  }

  if (!received || received !== computed) {
    const body = debug
      ? `invalid signature\nreceived=${received}\ncomputed=${computed}`
      : "invalid signature";
    return new Response(body, { status: 401, headers: { "content-type": "text/plain" } });
  }

  return new Response("OK", { status: 200, headers: { "content-type": "text/plain" } });
}
