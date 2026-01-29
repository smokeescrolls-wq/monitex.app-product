import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/server/db";
import { getAuthCookieName, verifySessionToken } from "@/server/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(getAuthCookieName())?.value ?? null;
  if (!token) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });

  try {
    const { sub } = await verifySessionToken(token);

    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        email: true,
        name: true,
        credits: { select: { balance: true } },
      },
    });

    if (!user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
}
