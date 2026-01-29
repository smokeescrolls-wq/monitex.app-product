import type { InstagramFeedResponse, InstagramFeedUpstreamResponse, InstagramProfileResponse, StalkeaProfileUpstreamResponse } from "./instagram.types"

function asString(v: unknown) {
  if (typeof v === "string") return v
  return ""
}

function asNonNegativeInt(v: unknown) {
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.trunc(v))
  return 0
}

export function mapProfileUpstreamToApp(upstream: StalkeaProfileUpstreamResponse): InstagramProfileResponse {
  const p = upstream.data

  return {
    source: upstream.source ?? "stalkea",
    durationMs: asNonNegativeInt(upstream.duration),
    data: {
      profileDetails: {
        username: asString(p.username),
        fullName: asString(p.full_name),
        biography: asString(p.biography),
        pictureUrl: asString(p.profile_pic_url),
        followersCount: asNonNegativeInt(p.follower_count),
        followsCount: asNonNegativeInt(p.following_count),
        postsCount: asNonNegativeInt(p.media_count),
        isPrivate: Boolean(p.is_private),
        isVerified: Boolean(p.is_verified),
        externalUrl: asString(p.external_url),
      },
    },
  }
}

export function mapFeedUpstreamToApp(upstream: InstagramFeedUpstreamResponse): InstagramFeedResponse {
  const searched = upstream.perfil_buscado

  return {
    source: upstream.fonte_api || upstream.fonte || "stalkea",
    durationMs: asNonNegativeInt(upstream.duracao_ms),
    data: {
      searchedProfile: {
        username: asString(searched.username),
        fullName: asString(searched.full_name),
        isPrivate: Boolean(searched.is_private),
        pictureUrl: asString(searched.profile_pic_url),
      },
      publicProfilesCount: asNonNegativeInt(upstream.perfis_publicos),
      postsTotal: asNonNegativeInt(upstream.total_posts),
      publicProfiles: (upstream.lista_perfis_publicos ?? []).map((x) => ({
        username: asString(x.username),
        fullName: asString(x.full_name),
        pictureUrl: asString(x.profile_pic_url),
        isVerified: Boolean(x.is_verified),
      })),
      posts: (upstream.posts ?? []).map((x) => ({
        fromUser: {
          username: asString(x.de_usuario.username),
          fullName: asString(x.de_usuario.full_name),
          pictureUrl: asString(x.de_usuario.profile_pic_url),
        },
        post: {
          id: asString(x.post.id),
          shortcode: asString(x.post.shortcode),
          imageUrl: x.post.image_url ?? null,
          videoUrl: x.post.video_url ?? null,
          isVideo: Boolean(x.post.is_video),
          caption: asString(x.post.caption),
          likeCount: asNonNegativeInt(x.post.like_count),
          commentCount: asNonNegativeInt(x.post.comment_count),
          takenAt: asNonNegativeInt(x.post.taken_at),
        },
      })),
    },
  }
}