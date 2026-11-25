import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Single-owner admin. The password lives in ADMIN_PASSWORD; a session is an
// expiry timestamp signed with ADMIN_SESSION_SECRET, kept in an httpOnly cookie.
export const SESSION_COOKIE = "admin_session";
const SESSION_HOURS = 12;

const secret = () => process.env.ADMIN_SESSION_SECRET ?? "";
export const adminConfigured = () =>
  (process.env.ADMIN_PASSWORD ?? "").length >= 12 && secret().length >= 32;

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function passwordMatches(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  // Compare digests so the comparison takes the same time whatever the lengths.
  const digest = (v: string) => createHmac("sha256", "pw").update(v).digest("base64url");
  return adminConfigured() && safeEqual(digest(candidate), digest(expected));
}

export function createSession() {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  return {
    value: `${expires}.${sign(String(expires))}`,
    maxAge: SESSION_HOURS * 3600,
  };
}

export function sessionValid(value: string | undefined) {
  if (!value || !adminConfigured()) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

export async function isAdmin() {
  return sessionValid((await cookies()).get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
