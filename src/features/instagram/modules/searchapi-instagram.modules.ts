import "server-only"

import { z } from "zod"
import type { InstagramProfileResponse } from "@/features/instagram/instagram.types"
import { fetchWithTimeout } from "@/server/security/fetch-timeout.modules"

function baseUrl() {
  return process.env.SEARCHAPI_BASE_URL ?? "https://www.searchapi.io/api/v1/search"
}

function apiKey() {
  const v = process.env.SEARCHAPI_API_KEY?.trim()
  if (!v) throw new Error("SEARCHAPI_API_KEY is not set")
  return v
}

const searchApiSchema = z
  .object({
    profile: z
      .object({
        username: z.string().optional(),
        name: z.string().nullable().optional(),
        bio: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
        followers: z.union([z.number(), z.string()]).optional(),
        following: z.union([z.number(), z.string()]).optional(),
        posts: z.union([z.number(), z.string()]).optional(),
        is_private: z.boolean().optional(),
        is_verified: z.boolean().optional(),
        external_link: z.string().nullable().optional(),
      })
      .passthrough(),
  })
  .passthrough()

function toCount(v: unknown) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.trunc(v))
  if (typeof v === "string") {
    const digits = v.replace(/[^\d]/g, "")
    const n = digits ? Number.parseInt(digits, 10) : 0
    return Number.isFinite(n) ? Math.max(0, n) : 0
  }
  return 0
}

export async function fetchInstagramProfileViaSearchApi(username: string): Promise<InstagramProfileResponse> {
  const startedAt = Date.now()
  const key = apiKey()

  const url = new URL(baseUrl())
  url.searchParams.set("engine", "instagram_profile")
  url.searchParams.set("username", username)
  url.searchParams.set("api_key", key)

  const res = await fetchWithTimeout(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    timeoutMs: 12000,
  })

  const text = await res.text().catch(() => "")
  if (!res.ok) throw new Error(`SearchApi error (${res.status}): ${text.slice(0, 300)}`)

  const json = searchApiSchema.parse(JSON.parse(text))
  const p = json.profile

  return {
    source: "searchapi",
    durationMs: Math.max(0, Date.now() - startedAt),
    data: {
      profileDetails: {
        username: p.username ?? username,
        fullName: p.name ?? "",
        biography: p.bio ?? "",
        pictureUrl: p.avatar ?? "",
        followersCount: toCount(p.followers),
        followsCount: toCount(p.following),
        postsCount: toCount(p.posts),
        isPrivate: Boolean(p.is_private ?? false),
        isVerified: Boolean(p.is_verified ?? false),
        externalUrl: p.external_link ?? "",
      },
    },
  }
}
