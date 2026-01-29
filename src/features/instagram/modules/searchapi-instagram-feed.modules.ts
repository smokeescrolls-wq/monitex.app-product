import "server-only";

import { z } from "zod";
import { fetchWithTimeout } from "@/server/security/fetch-timeout.modules";
import type { InstagramFeedResponse } from "@/features/instagram/instagram.types";

function baseUrl() {
  return process.env.SEARCHAPI_BASE_URL ?? "https://www.searchapi.io/api/v1/search";
}

function apiKey() {
  const v = process.env.SEARCHAPI_API_KEY?.trim();
  if (!v) throw new Error("SEARCHAPI_API_KEY is not set");
  return v;
}

function toCount(v: unknown) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.trunc(v));
  if (typeof v === "string") {
    const digits = v.replace(/[^\d]/g, "");
    const n = digits ? Number.parseInt(digits, 10) : 0;
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  return 0;
}

function toEpochSeconds(iso: unknown) {
  if (typeof iso !== "string") return 0;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return 0;
  return Math.max(0, Math.floor(ms / 1000));
}

const searchApiSchema = z
  .object({
    profile: z
      .object({
        username: z.string().optional(),
        name: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
        posts: z.union([z.number(), z.string()]).optional(),
        is_private: z.boolean().optional(),
      })
      .passthrough()
      .optional(),
    posts: z
      .array(
        z
          .object({
            id: z.string().optional(),
            type: z.string().optional(),
            link: z.string().optional(),
            thumbnail: z.string().optional(),
            caption: z.string().optional(),
            likes: z.union([z.number(), z.string()]).optional(),
            comments: z.union([z.number(), z.string()]).optional(),
            iso_date: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

export async function fetchInstagramFeedViaSearchApi(username: string): Promise<InstagramFeedResponse> {
  const start = Date.now();

  const url = new URL(baseUrl());
  url.searchParams.set("engine", "instagram_profile");
  url.searchParams.set("username", username);
  url.searchParams.set("api_key", apiKey());

  const res = await fetchWithTimeout(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    timeoutMs: 12000,
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`SearchApi error (${res.status}): ${text.slice(0, 300)}`);

  const parsed = searchApiSchema.parse(JSON.parse(text));
  const p = parsed.profile;

  const searchedUsername = p?.username ?? username;
  const fullName = p?.name ?? "";
  const pictureUrl = p?.avatar ?? "";
  const isPrivate = Boolean(p?.is_private ?? false);

  const postsArr = parsed.posts ?? [];
  const postsTotal = p?.posts ? toCount(p.posts) : postsArr.length;

  const out: InstagramFeedResponse = {
    source: "searchapi",
    durationMs: Math.max(0, Date.now() - start),
    data: {
      searchedProfile: {
        username: searchedUsername,
        fullName,
        isPrivate,
        pictureUrl,
      },
      publicProfilesCount: 0,
      postsTotal,
      publicProfiles: [],
      posts: postsArr.map((x) => {
        const id = x.id ?? "";
        const type = (x.type ?? "").toLowerCase();
        const isVideo = type.includes("video") || type.includes("reel");

        const imageUrl = x.thumbnail ?? x.link ?? null;
        const videoUrl = isVideo ? (x.link ?? null) : null;

        return {
          fromUser: {
            username: searchedUsername,
            fullName,
            pictureUrl,
          },
          post: {
            id,
            shortcode: id,
            imageUrl,
            videoUrl,
            isVideo,
            caption: x.caption ?? "",
            likeCount: toCount(x.likes),
            commentCount: toCount(x.comments),
            takenAt: toEpochSeconds(x.iso_date),
          },
        };
      }),
    },
  };

  return out;
}
