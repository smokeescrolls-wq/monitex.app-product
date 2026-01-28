import { describe, expect, it } from "vitest"
import { instagramUsernameSchema } from "./instagram.schemas"

describe("instagramUsernameSchema", () => {
  it("accepts valid usernames", () => {
    expect(instagramUsernameSchema.parse("john_doe")).toBe("john_doe")
    expect(instagramUsernameSchema.parse("a.b.c")).toBe("a.b.c")
    expect(instagramUsernameSchema.parse("A1._b")).toBe("A1._b")
  })

  it("rejects invalid usernames", () => {
    expect(instagramUsernameSchema.safeParse("").success).toBe(false)
    expect(instagramUsernameSchema.safeParse("a".repeat(31)).success).toBe(false)
    expect(instagramUsernameSchema.safeParse("john-doe").success).toBe(false)
    expect(instagramUsernameSchema.safeParse("john doe").success).toBe(false)
  })
})
