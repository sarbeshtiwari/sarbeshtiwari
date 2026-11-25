"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Exclaims } from "../components/ui";

// The form reads as a letter: the inputs sit inside the sentences on ruled
// paper. On a successful send the sheet folds away before the thank-you page.
export default function ContactClient() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setMessage("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/sendQuery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
        signal: controller.signal,
      });
      if (response.ok) {
        setSent(true);
        setTimeout(() => router.push("/thank-you"), 700);
        return;
      }
      setMessage("Your message could not be sent. Please try again or email me directly.");
    } catch {
      setMessage("Unable to connect. Please try again or use the email link.");
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  return (
    <form className={`letter ${sent ? "is-sent" : ""}`} onSubmit={submit} aria-busy={busy}>
      <span className="tape tape-center" style={{ background: "var(--tape-rose)" }} />
      <p className="letter-date">gurugram · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      <p className="letter-line letter-greeting">Hi Sarbesh,</p>
      <p className="letter-line">
        my name is{" "}
        <label className="sr-only" htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" autoComplete="name" placeholder="your name" required maxLength={100} />
        and you can reach me at{" "}
        <label className="sr-only" htmlFor="contact-email">Email address</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} />
      </p>
      <label className="letter-line" htmlFor="contact-message">
        I&apos;m writing because…
      </label>
      <textarea
        id="contact-message"
        name="message"
        placeholder="a GenAI role, a project, or just a hello"
        rows={6}
        required
        maxLength={5000}
      />
      <div className="letter-foot">
        <span className="letter-sign">yours, someone with a good idea</span>
        <button className="btn-primary" type="submit" disabled={busy || sent}>
          <Exclaims />
          {sent ? "sent ✓" : busy ? "sealing the envelope…" : "send it →"}
        </button>
      </div>
      <p className="form-status" role="status">
        {message}
      </p>
    </form>
  );
}
