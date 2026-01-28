import { NextResponse } from "next/server"
import { instagramUsernameSchema } from "@/features/instagram/instagram.schemas"
import { fetchInstagramProfile } from "@/features/instagram/modules/instagram-api.modules"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const usernameRaw = searchParams.get("username") ?? ""

  const parsed = instagramUsernameSchema.safeParse(usernameRaw)
  if (!parsed.success) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const data = await fetchInstagramProfile(parsed.data)
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy error"
    return NextResponse.json({ error: "Failed to fetch profile", message: msg }, { status: 502 })
  }
}
