import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  adminConfigured,
  createSession,
  passwordMatches,
  sessionCookieOptions,
} from "../../../lib/adminAuth";

export const runtime = "nodejs";

// Best-effort brake on password guessing. Serverless instances don't share
// memory, so this slows a single attacker rather than guaranteeing a limit.
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 15 * 60_000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  if (!adminConfigured())
    return NextResponse.json({ message: "Admin is not configured on this deployment." }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.until > now && record.count >= MAX_ATTEMPTS)
    return NextResponse.json({ message: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password.slice(0, 200);
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    const next = record && record.until > now ? record.count + 1 : 1;
    attempts.set(ip, { count: next, until: now + WINDOW });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ message: "That password isn't right." }, { status: 401 });
  }

  attempts.delete(ip);
  const session = createSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, session.value, { ...sessionCookieOptions, maxAge: session.maxAge });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
