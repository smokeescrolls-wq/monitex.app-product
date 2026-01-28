import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") ?? "";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/instagram-feed?username=${encodeURIComponent(username)}`,
    { cache: "no-store" },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok || !json) {
    return NextResponse.json(
      { error: "failed_to_load_profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ perfil_buscado: json.perfil_buscado });
}
