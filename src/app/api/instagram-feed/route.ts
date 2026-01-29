import { NextResponse } from "next/server"
import { instagramUsernameSchema } from "@/features/instagram/instagram.schemas"
import { fetchWithTimeout } from "@/server/security/fetch-timeout.modules"

function getUpstreamBaseUrl() {
  const v = process.env.UPSTREAM_BASE_URL
  if (!v) throw new Error("UPSTREAM_BASE_URL is not set")
  return v
}

function buildInstagramPhpUrl() {
  const base = getUpstreamBaseUrl()
  return new URL("instagram.php", base.endsWith("/") ? base : `${base}/`)
}

const UPSTREAM_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Content-Type": "application/json",
  Origin: "https://stalkea.ai",
  Referer: "https://stalkea.ai/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
}

async function fetchUpstream(url: URL) {
  const res = await fetchWithTimeout(url, {
    method: "GET",
    headers: UPSTREAM_HEADERS,
    cache: "no-store",
    timeoutMs: 12000,
  })

  const text = await res.text().catch(() => "")
  if (!res.ok) throw new Error(`Upstream error (${res.status}): ${text.slice(0, 300)}`)

  return JSON.parse(text)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const usernameRaw = searchParams.get("username") ?? ""

  const parsed = instagramUsernameSchema.safeParse(usernameRaw)
  if (!parsed.success) return NextResponse.json({ error: "Username is required" }, { status: 400 })

  try {
    const url = buildInstagramPhpUrl()
    url.searchParams.set("tipo", "busca_completa")
    url.searchParams.set("username", parsed.data)

    const json = await fetchUpstream(url)

    return NextResponse.json(json, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy error"
    return NextResponse.json({ error: "Failed to fetch feed", message: msg }, { status: 502 })
  }
}