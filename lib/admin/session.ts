import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days, refreshed on every admin request

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(payloadB64url: string): string {
  return createHmac("sha256", getSecret()).update(payloadB64url).digest("base64url");
}

export function createSessionCookieValue(now: number = Date.now()): string {
  const exp = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionCookieValue(
  value: string | undefined | null,
  now: number = Date.now(),
): boolean {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload), "base64url");
  const actual = Buffer.from(signature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp * 1000 > now;
  } catch {
    return false;
  }
}

/** Server Component / page guard — redirects to the login page when the session is missing or expired. */
export async function requireAdminSession(): Promise<void> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    redirect("/admin/login");
  }
}

/** Route Handler guard — returns a 401 response instead of redirecting. */
export async function requireAdminSessionOrResponse(): Promise<NextResponse | null> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
