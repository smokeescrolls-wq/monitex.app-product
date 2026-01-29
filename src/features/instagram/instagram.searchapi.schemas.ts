import { z } from "zod"

export const searchApiProfileSchema = z.object({
  profile: z
    .object({
      username: z.string(),
      name: z.string().optional().default(""),
      bio: z.string().optional().default(""),
      avatar: z.string().optional().default(""),
      avatar_hd: z.string().optional().default(""),
      is_verified: z.boolean().optional().default(false),
      is_business: z.boolean().optional().default(false),
      posts: z.number().int().nonnegative().optional().default(0),
      followers: z.number().int().nonnegative().optional().default(0),
      following: z.number().int().nonnegative().optional().default(0),
      external_link: z.string().optional().default(""),
    })
    .optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})
