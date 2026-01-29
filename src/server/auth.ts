import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

type JwtPayload = {
  sub: string;
  email: string;
};

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function signSessionToken(payload: JwtPayload) {
  const secret = getSecret();

  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret);

  const sub = payload.sub;
  const email = payload.email;

  if (typeof sub !== "string") throw new Error("invalid_token_sub");
  if (typeof email !== "string") throw new Error("invalid_token_email");

  return { sub, email };
}

export function getAuthCookieName() {
  return process.env.AUTH_COOKIE_NAME || "monitex_session";
}

export function getAuthCookieMaxAgeSeconds() {
  const days = Number(process.env.AUTH_COOKIE_MAX_AGE_DAYS || "7");
  return Math.max(1, Math.floor(days * 24 * 60 * 60));
}

export function readTokenFromRequest(req: NextRequest) {
  const name = getAuthCookieName();
  return req.cookies.get(name)?.value ?? null;
}
