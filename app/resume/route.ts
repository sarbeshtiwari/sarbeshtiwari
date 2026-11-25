import { NextResponse } from "next/server";
import { FALLBACK_RESUME, currentResume } from "../lib/resumeStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The public link everyone uses: /resume always downloads the latest upload,
// or the résumé bundled with the site if nothing has been uploaded yet.
export async function GET(request: Request) {
  let target = new URL(encodeURI(FALLBACK_RESUME), request.url).toString();
  try {
    const resume = await currentResume();
    if (resume) target = resume.downloadUrl;
  } catch {
    /* Storage unavailable: serve the bundled copy. */
  }
  return NextResponse.redirect(target, {
    status: 307,
    headers: { "Cache-Control": "no-store" },
  });
}
