import { z } from "zod"

export const instagramUsernameSchema = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .regex(/^[a-zA-Z0-9._]+$/)

export const instagramProfileUpstreamSchema = z.object({
  username: z.string(),
  full_name: z.string().nullable().optional().default(""),
  biography: z.string().nullable().optional().default(""),
  profile_pic_url: z.string().nullable().optional().default(""),
  follower_count: z.number().int().nonnegative().optional().default(0),
  following_count: z.number().int().nonnegative().optional().default(0),
  media_count: z.number().int().nonnegative().optional().default(0),
  is_private: z.boolean().optional().default(false),
  is_verified: z.boolean().optional().default(false),
  user_id: z.string().nullable().optional().default(""),
  external_url: z.string().nullable().optional().default(""),
  _chaining_results: z
    .array(
      z.object({
        id: z.string(),
        username: z.string(),
        full_name: z.string().nullable().optional().default(""),
        profile_pic_url: z.string().nullable().optional().default(""),
        is_private: z.boolean().optional().default(false),
        is_verified: z.boolean().optional().default(false),
      })
    )
    .optional()
    .default([]),
})

const upstreamWrappedProfileSchema = z.object({
  source: z.string().optional().default("stalkea"),
  data: instagramProfileUpstreamSchema,
  duration: z.number().optional().default(0),
})

const upstreamErrorSchema = z.object({
  success: z.boolean().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const stalkeaProfileUpstreamResponseSchema = z.union([
  upstreamWrappedProfileSchema,
  instagramProfileUpstreamSchema.transform((p) => ({
    source: "stalkea",
    data: p,
    duration: 0,
  })),
  upstreamErrorSchema.transform((e) => {
    const msg = e.error ?? e.message ?? "Upstream returned an error"
    throw new Error(msg)
  }),
])

export const perfilBuscadoUpstreamSchema = z.object({
  username: z.string(),
  full_name: z.string().nullable().optional().default(""),
  is_private: z.boolean().optional().default(false),
  profile_pic_url: z.string().nullable().optional().default(""),
})

export const perfilPublicoUpstreamSchema = z.object({
  username: z.string(),
  full_name: z.string().nullable().optional().default(""),
  profile_pic_url: z.string().nullable().optional().default(""),
  is_verified: z.boolean().optional().default(false),
})

export const usuarioBasicoUpstreamSchema = z.object({
  username: z.string(),
  full_name: z.string().nullable().optional().default(""),
  profile_pic_url: z.string().nullable().optional().default(""),
})

export const postUpstreamSchema = z.object({
  id: z.string(),
  shortcode: z.string(),
  image_url: z.string().nullable(),
  video_url: z.string().nullable(),
  is_video: z.boolean(),
  caption: z.string().nullable().optional().default(""),
  like_count: z.number().int().nonnegative().optional().default(0),
  comment_count: z.number().int().nonnegative().optional().default(0),
  taken_at: z.number().int(),
})

export const postItemUpstreamSchema = z.object({
  de_usuario: usuarioBasicoUpstreamSchema,
  post: postUpstreamSchema,
})

export const instagramFeedUpstreamResponseSchema = z.object({
  perfil_buscado: perfilBuscadoUpstreamSchema,
  fonte: z.string().optional().default(""),
  fonte_api: z.string().optional().default(""),
  perfis_na_lista: z.number().int().nonnegative().optional().default(0),
  perfis_publicos: z.number().int().nonnegative().optional().default(0),
  lista_perfis_publicos: z.array(perfilPublicoUpstreamSchema).optional().default([]),
  posts: z.array(postItemUpstreamSchema).optional().default([]),
  total_posts: z.number().int().nonnegative().optional().default(0),
  duracao_ms: z.number().int().nonnegative().optional().default(0),
})

export const instagramProfileDetailsSchema = z.object({
  username: z.string(),
  fullName: z.string(),
  biography: z.string(),
  pictureUrl: z.string(),
  followersCount: z.number().int().nonnegative(),
  followsCount: z.number().int().nonnegative(),
  postsCount: z.number().int().nonnegative(),
  isPrivate: z.boolean(),
  isVerified: z.boolean(),
  externalUrl: z.string(),
})

export const instagramProfileResponseSchema = z.object({
  source: z.string(),
  durationMs: z.number().int().nonnegative(),
  data: z.object({
    profileDetails: instagramProfileDetailsSchema,
  }),
})

export const instagramFeedResponseSchema = z.object({
  source: z.string(),
  durationMs: z.number().int().nonnegative(),
  data: z.object({
    searchedProfile: z.object({
      username: z.string(),
      fullName: z.string(),
      isPrivate: z.boolean(),
      pictureUrl: z.string(),
    }),
    publicProfilesCount: z.number().int().nonnegative(),
    postsTotal: z.number().int().nonnegative(),
    publicProfiles: z.array(
      z.object({
        username: z.string(),
        fullName: z.string(),
        pictureUrl: z.string(),
        isVerified: z.boolean(),
      })
    ),
    posts: z.array(
      z.object({
        fromUser: z.object({
          username: z.string(),
          fullName: z.string(),
          pictureUrl: z.string(),
        }),
        post: z.object({
          id: z.string(),
          shortcode: z.string(),
          imageUrl: z.string().nullable(),
          videoUrl: z.string().nullable(),
          isVideo: z.boolean(),
          caption: z.string(),
          likeCount: z.number().int().nonnegative(),
          commentCount: z.number().int().nonnegative(),
          takenAt: z.number().int(),
        }),
      })
    ),
  }),
})
