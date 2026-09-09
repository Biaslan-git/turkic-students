import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  createSessionCookieValue,
  verifySessionCookieValue,
} from "@/lib/admin/session";

const intlProxy = createIntlMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return adminProxy(request, pathname);
  }

  return intlProxy(request);
}

function adminProxy(request: NextRequest, pathname: string) {
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionCookieValue(cookieValue)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Sliding expiration: every authenticated admin request re-signs the
  // cookie with a fresh expiry, so activity keeps the session alive.
  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(), SESSION_COOKIE_OPTIONS);
  return response;
}
