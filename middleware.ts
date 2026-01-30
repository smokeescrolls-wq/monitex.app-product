import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";

const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i;

function buildCsp(isDev: boolean) {
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:"
    : "script-src 'self' 'unsafe-inline' https:";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' ${isDev ? "ws: wss:" : ""} https:`,
    "frame-src 'self' https://*.cloudflarestream.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

function applySecurityHeaders(res: NextResponse, req: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  res.headers.set("Content-Security-Policy", buildCsp(isDev));
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/cta")) {
    res.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
    res.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  } else {
    res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.headers.set("Cross-Origin-Resource-Policy", "same-site");
  }

  return res;
}

function isProtectedPath(pathname: string) {
  if (pathname.startsWith("/auth")) return false;
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/_next")) return false;
  if (pathname === "/favicon.ico") return false;
  if (pathname === "/mobile-only") return false;

  return pathname.startsWith("/dashboard");
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/api/webhooks/digistore24" || pathname.startsWith("/api/webhooks/digistore24/")) {
    return NextResponse.next();
  }

  const mobileOnly = (process.env.MOBILE_ONLY ?? "false").toLowerCase() === "true";
  const isBypass =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/mobile-only" ||
    pathname === "/favicon.ico";

  if (mobileOnly && !isBypass) {
    const ua = req.headers.get("user-agent") ?? "";
    if (!mobileUa.test(ua)) {
      const url = req.nextUrl.clone();
      url.pathname = "/mobile-only";
      return applySecurityHeaders(NextResponse.redirect(url), req);
    }
  }

  const { response, supabase } = await updateSession(req);

  const authDisabled = (process.env.AUTH_DISABLED ?? "false").toLowerCase() === "true";
  if (authDisabled) {
    return applySecurityHeaders(response, req);
  }

  if (isProtectedPath(pathname)) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return applySecurityHeaders(NextResponse.redirect(url), req);
    }
  }

  return applySecurityHeaders(response, req);
}

export const config = { matcher: "/:path*" };
