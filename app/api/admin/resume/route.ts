import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/adminAuth";
import {
  MAX_RESUME_BYTES,
  currentResume,
  detectResumeType,
  replaceResume,
  storeConfigured,
} from "../../../lib/resumeStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  // Session cookies are SameSite=Strict; also refuse uploads posted from another site.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host"))
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("resume");
  } catch {
    return NextResponse.json({ message: "Couldn't read the upload." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ message: "Choose a PDF or Word file first." }, { status: 400 });
  if (file.size > MAX_RESUME_BYTES)
    return NextResponse.json({ message: "That file is over 4 MB." }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectResumeType(bytes);
  if (!type)
    return NextResponse.json({ message: "Only PDF (.pdf) or Word (.docx) files are accepted." }, { status: 415 });
  if (!storeConfigured())
    return NextResponse.json({ message: "File storage isn't connected (BLOB_READ_WRITE_TOKEN is missing)." }, { status: 503 });

  try {
    await replaceResume(bytes, type.ext, type.contentType);
    return NextResponse.json({ resume: await currentResume() });
  } catch {
    return NextResponse.json({ message: "Upload failed. Please try again." }, { status: 502 });
  }
}
