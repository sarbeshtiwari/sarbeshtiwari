import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "../data/portfolio";
import { Doodle } from "../components/Doodles";
import { Exclaims } from "../components/ui";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

const next = [
  { label: "step 1", text: "Your note is in my inbox.", color: "var(--note-sage)", tilt: -2 },
  { label: "step 2", text: "I read it and reply from my own email.", color: "var(--note-marigold)", tilt: 1.5 },
  { label: "meanwhile", text: "Have a look around: the agents are the fun part.", color: "var(--note-rose)", tilt: -1 },
];

// The letter from /contact, sealed and stamped: the envelope drops in, its
// flap closes, then the postmark lands.
export default function ThankYou() {
  return (
    <div className="sketch-page thanks">
      <Doodle name="star" className="margin-doodle" style={{ top: 120, left: 60, width: 60, rotate: "-12deg" }} wobble="a" duration={5.8} />
      <Doodle name="spiral" className="margin-doodle" style={{ top: 420, right: 56, width: 66, rotate: "10deg" }} wobble="d" duration={6.4} delay={0.6} />

      <div className="envelope-scene" aria-hidden="true">
        <svg className="envelope" viewBox="0 0 320 210">
          <rect className="env-body" x="6" y="40" width="308" height="164" rx="6" />
          <path className="env-fold" d="M6 204 L160 112 L314 204" />
          <path className="env-fold" d="M6 44 L130 128 M314 44 L190 128" />
          <g className="env-flap">
            <path d="M6 44 Q6 40 10 40 L310 40 Q314 40 314 44 L160 150 Z" />
          </g>
          <circle className="env-seal" cx="160" cy="146" r="15" />
          <path className="env-seal-mark" d="M152 146c2-6 14-6 16 0-2 6-14 6-16 0Z" />
          <text className="env-to" x="34" y="182">
            to: sarbesh
          </text>
        </svg>
        <span className="env-stamp">
          <span>IN</span>
          <Doodle name="bolt" className="stamp-doodle" />
          <span>₹5</span>
        </span>
        <span className="env-postmark">
          SENT
          <small>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</small>
        </span>
        <svg className="env-trail" viewBox="0 0 160 60">
          <path d="M4 50 C 40 50, 50 10, 90 18 S 140 40, 156 8" />
        </svg>
      </div>

      <header className="sketch-header thanks-header">
        <p className="kicker">MESSAGE RECEIVED</p>
        <h1>
          your letter&apos;s <span className="ink-mark">in the post</span>. <em>thank you!</em>
        </h1>
        <p>I&apos;ll get back to you at the email address you gave me.</p>
      </header>

      <div className="thanks-notes">
        {next.map((n, i) => (
          <div
            key={n.label}
            className="sticky-note"
            style={{ background: n.color, rotate: `${n.tilt}deg`, animationDelay: `${i * 0.4}s` }}
          >
            <span className="pin" />
            <span className="note-label">{n.label}</span>
            <p>{n.text}</p>
          </div>
        ))}
      </div>

      <div className="sketch-cta">
        <div className="about-actions">
          <Link className="btn-primary" href="/#work">
            <Exclaims />
            see my work →
          </Link>
          <Link className="btn-secondary" href="/">
            <Exclaims />
            back home
          </Link>
          <a className="btn-secondary" href={profile.resume} download>
            <Exclaims />
            grab my résumé ↓
          </a>
        </div>
      </div>
    </div>
  );
}
