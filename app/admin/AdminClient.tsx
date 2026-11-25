"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ResumeInfo } from "../lib/resumeStore";
import type { Message } from "../lib/messages";
import { Exclaims } from "../components/ui";

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

function SignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) return router.refresh();
    setError((await res?.json().catch(() => null))?.message ?? "Couldn't reach the server.");
  }
  return (
    <form className="admin-card" onSubmit={submit}>
      <span className="tape tape-center" style={{ background: "var(--tape-lake)" }} />
      <p className="hand-note">who goes there?</p>
      <label htmlFor="admin-password" className="admin-label">
        Password
      </label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required className="admin-input" />
      <button className="btn-primary" disabled={busy}>
        <Exclaims />
        {busy ? "checking…" : "let me in →"}
      </button>
      <p className="admin-status" role="status">
        {error}
      </p>
    </form>
  );
}

function ResumeManager({ initialResume, storeReady }: { initialResume: ResumeInfo | null; storeReady: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState(initialResume);
  const [picked, setPicked] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!picked) return;
    setBusy(true);
    setStatus("");
    const body = new FormData();
    body.append("resume", picked);
    const res = await fetch("/api/admin/resume", { method: "POST", body }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setBusy(false);
    if (res?.status === 401) return router.refresh();
    if (!res?.ok) return setStatus(data?.message ?? "Upload failed.");
    setResume(data.resume);
    setPicked(null);
    if (input.current) input.current.value = "";
    setStatus("Done. /resume now downloads this file.");
  }

  return (
    <div className="admin-panel">

      {!storeReady && (
        <p className="admin-warning">
          File storage isn&apos;t connected yet. Create a Blob store in Vercel and add BLOB_READ_WRITE_TOKEN,
          then redeploy. Until then, /resume serves the copy bundled with the site.
        </p>
      )}

      <div className="admin-current">
        {resume ? (
          <>
            <span className="admin-file-icon">{resume.name.endsWith(".pdf") ? "PDF" : "DOC"}</span>
            <div>
              <strong>{resume.name}</strong>
              <span>
                {formatSize(resume.size)} · updated{" "}
                {new Date(resume.uploadedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <a className="text-link" href={resume.url} target="_blank" rel="noreferrer">
              preview ↗
            </a>
          </>
        ) : (
          <span className="admin-empty">Nothing uploaded yet: visitors get the résumé bundled with the site.</span>
        )}
      </div>

      <form onSubmit={upload} className="admin-upload">
        <label className={`dropzone ${picked ? "has-file" : ""}`}>
          <input
            ref={input}
            type="file"
            name="resume"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              setPicked(e.target.files?.[0] ?? null);
              setStatus("");
            }}
            disabled={!storeReady}
          />
          <span className="dropzone-title">{picked ? picked.name : "drop a new résumé here, or click to pick one"}</span>
          <span className="dropzone-hint">{picked ? formatSize(picked.size) : "PDF or Word (.docx), up to 4 MB"}</span>
        </label>
        <button className="btn-primary" disabled={!picked || busy || !storeReady}>
          <Exclaims />
          {busy ? "uploading…" : resume ? "replace résumé →" : "upload résumé →"}
        </button>
      </form>
      <p className="admin-status" role="status">
        {status}
      </p>
      <p className="admin-note">
        Everyone downloads from <a href="/resume">/resume</a>, so links you&apos;ve already shared keep
        working after every update.
      </p>
    </div>
  );
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function Inbox({ initialMessages, dbReady }: { initialMessages: Message[]; dbReady: boolean }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [open, setOpen] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [show, setShow] = useState<"all" | "unread">("all");
  const [status, setStatus] = useState("");

  async function call(method: "PATCH" | "DELETE", body: object) {
    const res = await fetch("/api/admin/messages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    if (res?.status === 401) {
      router.refresh();
      return false;
    }
    if (!res?.ok) {
      setStatus((await res?.json().catch(() => null))?.message ?? "Something went wrong.");
      return false;
    }
    setStatus("");
    return true;
  }
  async function toggleRead(m: Message, read = !m.read) {
    setMessages((all) => all.map((x) => (x.id === m.id ? { ...x, read } : x)));
    if (!(await call("PATCH", { id: m.id, read })))
      setMessages((all) => all.map((x) => (x.id === m.id ? { ...x, read: m.read } : x)));
  }
  async function remove(m: Message) {
    if (await call("DELETE", { id: m.id })) setMessages((all) => all.filter((x) => x.id !== m.id));
    setConfirming(null);
  }
  async function refresh() {
    const res = await fetch("/api/admin/messages").catch(() => null);
    if (res?.status === 401) return router.refresh();
    const data = await res?.json().catch(() => null);
    if (res?.ok) {
      setMessages(data.messages);
      setStatus("");
    } else setStatus(data?.message ?? "Couldn't load messages.");
  }

  if (!dbReady)
    return (
      <div className="admin-panel">
        <p className="admin-warning">
          The database isn&apos;t connected yet. In Vercel, add a Neon Postgres database under Storage and connect
          it to this project (it sets DATABASE_URL), then redeploy. Until then, messages still arrive by email.
        </p>
      </div>
    );

  const shown = show === "unread" ? messages.filter((m) => !m.read) : messages;
  return (
    <div className="admin-panel">
      <div className="inbox-tools">
        <div className="sticker-filters small" role="group" aria-label="Filter messages">
          {(["all", "unread"] as const).map((v) => (
            <button key={v} className={show === v ? "active" : ""} aria-pressed={show === v} onClick={() => setShow(v)}>
              {v} <sup>{v === "all" ? messages.length : messages.filter((m) => !m.read).length}</sup>
            </button>
          ))}
        </div>
        <button className="admin-signout" onClick={refresh}>
          refresh ↻
        </button>
      </div>
      {shown.length === 0 ? (
        <p className="admin-empty">{show === "unread" ? "All caught up." : "No messages yet."}</p>
      ) : (
        <ul className="inbox">
          {shown.map((m) => {
            const expanded = open === m.id;
            return (
              <li key={m.id} className={`inbox-item ${m.read ? "" : "unread"} ${expanded ? "open" : ""}`}>
                <button
                  className="inbox-summary"
                  aria-expanded={expanded}
                  onClick={() => {
                    setOpen(expanded ? null : m.id);
                    if (!m.read && !expanded) toggleRead(m, true);
                  }}
                >
                  <span className="inbox-dot" aria-label={m.read ? "Read" : "Unread"} />
                  <span className="inbox-from">
                    <strong>{m.name}</strong>
                    <span>{m.email}</span>
                  </span>
                  <span className="inbox-preview">{m.message}</span>
                  <span className="inbox-date">{when(m.created_at)}</span>
                </button>
                {expanded && (
                  <div className="inbox-body">
                    <p>{m.message}</p>
                    <div className="inbox-actions">
                      <a
                        className="btn-primary"
                        href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message on my portfolio")}`}
                      >
                        reply by email →
                      </a>
                      <button className="admin-signout" onClick={() => toggleRead(m)}>
                        mark as {m.read ? "unread" : "read"}
                      </button>
                      {confirming === m.id ? (
                        <>
                          <button className="admin-danger" onClick={() => remove(m)}>
                            yes, delete it forever
                          </button>
                          <button className="admin-signout" onClick={() => setConfirming(null)}>
                            keep it
                          </button>
                        </>
                      ) : (
                        <button className="admin-signout" onClick={() => setConfirming(m.id)}>
                          delete…
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="admin-status" role="status">
        {status}
      </p>
    </div>
  );
}

function Dashboard(props: {
  storeReady: boolean;
  initialResume: ResumeInfo | null;
  dbReady: boolean;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"messages" | "resume">("messages");
  const unread = props.initialMessages.filter((m) => !m.read).length;
  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }
  return (
    <div className="admin-card admin-wide">
      <span className="tape tape-center" style={{ background: "var(--tape-marigold)" }} />
      <div className="admin-row">
        <div className="admin-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "messages"} onClick={() => setTab("messages")}>
            messages{unread > 0 && <span className="admin-badge">{unread}</span>}
          </button>
          <button role="tab" aria-selected={tab === "resume"} onClick={() => setTab("resume")}>
            résumé
          </button>
        </div>
        <button className="admin-signout" onClick={signOut}>
          sign out
        </button>
      </div>
      {tab === "messages" ? (
        <Inbox initialMessages={props.initialMessages} dbReady={props.dbReady} />
      ) : (
        <ResumeManager initialResume={props.initialResume} storeReady={props.storeReady} />
      )}
    </div>
  );
}

export default function AdminClient({
  configured,
  storeReady,
  signedIn,
  initialResume,
  dbReady,
  initialMessages,
}: {
  configured: boolean;
  storeReady: boolean;
  signedIn: boolean;
  initialResume: ResumeInfo | null;
  dbReady: boolean;
  initialMessages: Message[];
}) {
  if (!configured)
    return (
      <div className="admin-card">
        <p className="admin-warning">
          Admin is switched off. Set ADMIN_PASSWORD (12+ characters) and ADMIN_SESSION_SECRET (32+ characters)
          in your environment, then redeploy.
        </p>
      </div>
    );
  return signedIn ? (
    <Dashboard
      storeReady={storeReady}
      initialResume={initialResume}
      dbReady={dbReady}
      initialMessages={initialMessages}
    />
  ) : (
    <SignIn />
  );
}
