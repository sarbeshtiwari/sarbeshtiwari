import Link from "next/link";
import { profile } from "../data/portfolio";

const socials = [
  {
    label: "GitHub",
    href: profile.github,
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13v5.42h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.84 1.25-1.84 2.54v4.88H9.5v-11Z",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    path: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.3V17h16V7.3l-8 5.6-8-5.6ZM5.4 7l6.6 4.6L18.6 7H5.4Z",
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <Link href="/" className="wordmark">
        sarbesh <span>·</span> tiwari
      </Link>
      <div className="footer-socials">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d={s.path} fill="currentColor" fillRule="evenodd" />
            </svg>
          </a>
        ))}
      </div>
      <p className="footer-credit">
        <span>
          designed &amp; developed by{" "}
          <a href="https://reachout-web.netlify.app" target="_blank" rel="noreferrer">
            inkwell&apos;s AI agent ↗
          </a>
        </span>
        <span className="footer-credit-sub">
          …and inkwell&apos;s AI agent was designed &amp; developed by <Link href="/about">sarbesh</Link>
        </span>
      </p>
      <div className="footer-note">
        <Link href="/projects">all projects</Link>
        <span>•</span>
        <Link href="/certifications">certifications</Link>
        <span>•</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
