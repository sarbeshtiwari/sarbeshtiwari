import { del, list, put } from "@vercel/blob";

// The résumé lives in Vercel Blob under resume/. Each upload gets a unique
// name (so CDN caches never serve a stale copy); the newest one is current
// and older copies are removed after a successful upload.
const PREFIX = "resume/";
export const FALLBACK_RESUME = "/assets/certs/Sarbesh Kumar Tiwari.docx";
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export const storeConfigured = () => !!process.env.BLOB_READ_WRITE_TOKEN;

export type ResumeInfo = {
  url: string;
  downloadUrl: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export async function currentResume(): Promise<ResumeInfo | null> {
  if (!storeConfigured()) return null;
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  const newest = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
  if (!newest) return null;
  return {
    url: newest.url,
    downloadUrl: newest.downloadUrl,
    name: newest.pathname.slice(PREFIX.length).replace(/-[A-Za-z0-9]{20,}(?=\.\w+$)/, ""),
    size: newest.size,
    uploadedAt: new Date(newest.uploadedAt).toISOString(),
  };
}

// Identify the file by its first bytes rather than trusting the browser's type.
export function detectResumeType(bytes: Uint8Array) {
  const head = String.fromCharCode(...bytes.slice(0, 4));
  if (head === "%PDF") return { ext: "pdf", contentType: "application/pdf" };
  if (head === "PK\u0003\u0004")
    return {
      ext: "docx",
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  return null;
}

export async function replaceResume(bytes: Uint8Array, ext: string, contentType: string) {
  const { blobs: previous } = await list({ prefix: PREFIX, limit: 100 });
  const blob = await put(`${PREFIX}Sarbesh-Kumar-Tiwari-Resume.${ext}`, Buffer.from(bytes), {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  if (previous.length) await del(previous.map((b) => b.url));
  return blob;
}
