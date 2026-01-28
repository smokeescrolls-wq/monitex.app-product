import { describe, expect, it } from "vitest"
import { tokenizeCaption } from "./instagram-format.modules"

describe("tokenizeCaption", () => {
  it("tokenizes hashtags and mentions", () => {
    const tokens = tokenizeCaption("hi #tag @user")
    expect(tokens.map((t) => t.type)).toEqual(["text", "hashtag", "text", "mention"])
  })

  it("treats HTML-like content as plain text", () => {
    const tokens = tokenizeCaption("<img src=x onerror=alert(1)>")
    expect(tokens.every((t) => t.type === "text")).toBe(true)
  })
})
