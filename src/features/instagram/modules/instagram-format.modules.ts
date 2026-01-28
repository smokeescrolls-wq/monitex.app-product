import { sanitizeText } from "@/features/security/modules/input-sanitize.modules"

export type CaptionToken =
  | { type: "text"; value: string }
  | { type: "hashtag"; value: string }
  | { type: "mention"; value: string }

export function tokenizeCaption(raw: string): CaptionToken[] {
  const caption = sanitizeText(raw)
  if (!caption) return []

  const tokens: CaptionToken[] = []
  const parts = caption.split(/(#[\p{L}0-9_]+|@[\p{L}0-9_.]+)/gu)

  for (const part of parts) {
    if (!part) continue
    if (part.startsWith("#")) tokens.push({ type: "hashtag", value: part })
    else if (part.startsWith("@")) tokens.push({ type: "mention", value: part })
    else tokens.push({ type: "text", value: part })
  }

  return tokens
}
