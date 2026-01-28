import type { z } from "zod"
import {
  instagramFeedResponseSchema,
  instagramFeedUpstreamResponseSchema,
  instagramProfileResponseSchema,
  instagramProfileUpstreamSchema,
  stalkeaProfileUpstreamResponseSchema,
} from "./instagram.schemas"

export type InstagramProfileUpstream = z.infer<typeof instagramProfileUpstreamSchema>
export type StalkeaProfileUpstreamResponse = z.infer<typeof stalkeaProfileUpstreamResponseSchema>
export type InstagramFeedUpstreamResponse = z.infer<typeof instagramFeedUpstreamResponseSchema>

export type InstagramProfileResponse = z.infer<typeof instagramProfileResponseSchema>
export type InstagramFeedResponse = z.infer<typeof instagramFeedResponseSchema>
