import "server-only"

import { fetchWithTimeout } from "@/server/security/fetch-timeout.modules"
import { instagramFeedUpstreamResponseSchema, stalkeaProfileUpstreamResponseSchema } from "@/features/instagram/instagram.schemas"
import { mapFeedUpstreamToApp, mapProfileUpstreamToApp } from "@/features/instagram/instagram.mapper"

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
    timeoutMs: 8000,
  })

  const text = await res.text().catch(() => "")
  console.log("UPSTREAM STATUS:", res.status)
  console.log("UPSTREAM BODY:", text.slice(0, 800))

  if (!res.ok) {
    throw new Error(`Upstream error (${res.status}): ${text.slice(0, 300)}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Upstream returned non-JSON: ${text.slice(0, 300)}`)
  }
}


export async function fetchInstagramProfile(username: string) {
  const url = buildInstagramPhpUrl()
  url.searchParams.set("tipo", "perfil")
  url.searchParams.set("username", username)

  const json = await fetchUpstream(url)
  const parsed = stalkeaProfileUpstreamResponseSchema.parse(json)

  return mapProfileUpstreamToApp(parsed)
}

export async function fetchInstagramFeed(username: string) {
  const url = buildInstagramPhpUrl()
  url.searchParams.set("tipo", "busca_completa")
  url.searchParams.set("username", username)

  const json = await fetchUpstream(url)
  const parsed = instagramFeedUpstreamResponseSchema.parse(json)

  return mapFeedUpstreamToApp(parsed)
}
