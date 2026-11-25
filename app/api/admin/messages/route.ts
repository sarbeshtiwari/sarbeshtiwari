import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import { dbConfigured, deleteMessage, listMessages, setRead } from "../../../lib/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host"))
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  if (!dbConfigured())
    return NextResponse.json({ message: "The database isn't connected (DATABASE_URL is missing)." }, { status: 503 });
  return null;
}

async function readId(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown; read?: unknown };
    const id = Number(body.id);
    return Number.isSafeInteger(id) && id > 0 ? { id, read: body.read } : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ messages: await listMessages() });
  } catch {
    return NextResponse.json({ message: "Couldn't load messages." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = await readId(request);
  if (!body || typeof body.read !== "boolean") return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  try {
    await setRead(body.id, body.read);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Couldn't update that message." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = await readId(request);
  if (!body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  try {
    await deleteMessage(body.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Couldn't delete that message." }, { status: 502 });
  }
}
