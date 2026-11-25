"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/portfolio";
import { Icon } from "./ui";

const links = [
  { label: "work", href: "/#work", match: ["/", "/projects"] },
  { label: "about", href: "/about", match: ["/about"] },
  { label: "experience", href: "/experience", match: ["/experience", "/certifications"] },
  { label: "resume", href: profile.resume, match: [] as string[], download: true },
  { label: "contact", href: "/contact", match: ["/contact", "/thank-you"] },
];

export function Squiggle({ className = "nav-squig" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 5 Q10 1, 18 5 T34 5 T50 5 T66 5 T82 5 T98 5" />
    </svg>
  );
}

function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);
  const pick = (next: "light" | "dark") => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* Storage is optional. */
    }
  };
  return (
    <div className="theme-switch" role="group" aria-label="Theme switcher">
      <button type="button" aria-label="Light mode" aria-pressed={theme === "light"} onClick={() => pick("light")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </button>
      <button type="button" aria-label="Dark mode" aria-pressed={theme === "dark"} onClick={() => pick("dark")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);

  // Slide away while scrolling down, come back on any scroll up.
  useEffect(() => {
    let last = scrollY;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        const delta = y - last;
        if (Math.abs(delta) > 6) {
          if (delta > 0 && y > 80) setHidden(true);
          else if (delta < 0) setHidden(false);
          last = y;
        }
        queued = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const outside = (e: PointerEvent) => {
      if (!nav.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  return (
    <header className={`nav-shell ${hidden && !open ? "is-hidden" : ""}`}>
      <div className="nav-left">
        <ThemeSwitch />
        <Link href="/" className="wordmark" aria-label="Sarbesh Tiwari home">
          sarbesh <span>·</span> tiwari
        </Link>
      </div>
      <nav ref={nav} aria-label="Main navigation">
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
        <div id="nav-links" className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map((link, i) => {
            const active = link.match.includes(pathname);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
                {...(link.download ? { download: true } : {})}
                onClick={() => setOpen(false)}
              >
                <span className="nav-num">/0{i + 1}</span>
                <span className="nav-word">
                  {link.label}
                  <Squiggle />
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
