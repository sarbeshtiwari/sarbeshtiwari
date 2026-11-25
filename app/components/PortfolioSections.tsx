import Link from "next/link";
import { projects } from "../data/portfolio";
import { Exclaims, Icon } from "./ui";
import Reveal from "./Reveal";

type Cover = {
  bg: string;
  fg: string;
  caption: string;
  brand: [string, string];
  icon: string;
  steps: [string, string][];
};
type Showcase = {
  project: string;
  cover: Cover;
  title: string;
  text: string;
  features: string[];
};
const selected: Showcase[] = [
  {
    project: "VoicePilot",
    cover: {
      bg: "var(--lake-deep)",
      fg: "#fffefd",
      caption: "voice, not keyboard",
      brand: ["voice", "pilot."],
      icon: "mic",
      steps: [["speak", "mic"], ["agent works", "code"], ["hear reply", "volume"]],
    },
    title: "Talking to terminal AI agents",
    text: "A voice layer that wraps any terminal agent (Claude, Codex, Aider, Ollama), reads its reply aloud when it finishes and types your next spoken prompt. Solo mode controls the computer itself.",
    features: [
      "Works with any terminal agent",
      "Local speech recognition, no API keys",
      "Solo mode with a custom wake word",
    ],
  },
  {
    project: "ATS: AI-Assisted Trading System",
    cover: {
      bg: "var(--sage-deep)",
      fg: "#fffefd",
      caption: "agents, with guardrails",
      brand: ["ats", "agents."],
      icon: "nodes",
      steps: [["research", "spark"], ["risk check", "check"], ["order", "chart"]],
    },
    title: "LLM agents that can't bypass the risk rules",
    text: "Claude-backed research agents read the market and propose trades, but every order has to pass a deterministic risk engine the model can't override, in paper, supervised and live modes.",
    features: [
      "Claude API research agents",
      "Deterministic risk engine as a hard guardrail",
      "Full audit trail of agent decisions",
    ],
  },
  {
    project: "AdPilot",
    cover: {
      bg: "var(--grape)",
      fg: "#fffefd",
      caption: "attention, monetised",
      brand: ["ad", "pilot."],
      icon: "spark",
      steps: [["model thinks", "spark"], ["one card", "layers"], ["viewer earns", "check"]],
    },
    title: "An ad network for AI thinking time",
    text: "A browser extension that notices when ChatGPT, Claude or Gemini start generating and shows one sponsored card, plus the ad server and portals for advertisers, earners and the platform team.",
    features: [
      "Chrome extension (Manifest V3)",
      "Geo targeting down to city and area",
      "Advertisers only ever see aggregates",
    ],
  },
  {
    project: "Arc-AGI-3 Games Platform",
    cover: {
      bg: "var(--marigold)",
      fg: "#1a1715",
      caption: "reasoning, as a game",
      brand: ["arc", "agi-3."],
      icon: "layers",
      steps: [["play", "layers"], ["reason", "nodes"], ["track", "chart"]],
    },
    title: "An interactive platform for an AI reasoning benchmark",
    text: "At Quess Corp, working for Ethara.ai, I work on gameplay interactions, multi-user authentication and activity tracking for a platform built around ARC-AGI-3 games.",
    features: [
      "Interactive gameplay",
      "Multi-user authentication",
      "Player activity tracking",
    ],
  },
  {
    project: "Inkwell",
    cover: {
      bg: "var(--tomato)",
      fg: "#fffefd",
      caption: "outreach, organised",
      brand: ["ink", "well."],
      icon: "mail",
      steps: [["write", "mail"], ["send", "send"], ["track", "chart"]],
    },
    title: "Outreach and the job search in one place",
    text: "Campaigns sent from the user's own email, reply detection that works out what each person wants, application tracking from the inbox, job matches and a no-code website builder.",
    features: [
      "Personal email & WhatsApp campaigns",
      "Reply detection & application tracking",
      "Encrypted at rest",
    ],
  },
];

const tapes = [
  ["var(--tape-marigold)", "var(--tape-sage)"],
  ["var(--tape-rose)", "var(--tape-lake)"],
  ["var(--tape-sage)", "var(--tape-marigold)"],
  ["var(--tape-lake)", "var(--tape-rose)"],
];
const stickers: Record<string, [string, string]> = {
  Active: ["live", "var(--sage)"],
  "In Progress": ["in progress", "var(--marigold)"],
  Completed: ["shipped", "var(--sage)"],
  Personal: ["side quest", "var(--rose)"],
};

// A bold book-cover for each project: its name, a three-step flow and a big glyph.
function CoverArt({ cover, index }: { cover: Cover; index: number }) {
  return (
    <span className="cover-art" style={{ background: cover.bg, color: cover.fg }}>
      <span className="cover-caption">{cover.caption}</span>
      <span className="cover-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="cover-brand">
        {cover.brand[0]}
        <i>{cover.brand[1]}</i>
      </span>
      <span className="cover-steps">
        {cover.steps.map(([label, icon], i) => (
          <span key={label} className="cover-step-wrap">
            {i > 0 && (
              <svg className="cover-arrow" viewBox="0 0 40 16" aria-hidden="true">
                <path d="M2 9c8-6 18-6 30-1M26 3l7 5-7 5" />
              </svg>
            )}
            <span className="cover-step" style={{ transitionDelay: `${i * 70}ms` }}>
              <Icon name={icon} />
              {label}
            </span>
          </span>
        ))}
      </span>
      <span className="cover-glyph">
        <Icon name={cover.icon} />
      </span>
    </span>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="work">
      <div className="work-head">
        <p className="kicker">SELECTED WORK · /01</p>
        <h2>
          things i&apos;ve <span className="ink-mark">built</span> lately
        </h2>
        <span className="hand-note">mostly agents, newest first</span>
      </div>
      <div className="spreads">
        {selected.map((item, i) => {
          const project = projects.find((p) => p.title === item.project)!;
          const live = project.url && project.url !== "#" && !project.url.includes("github.com") ? project.url : "";
          const code = project.repo || (project.url?.includes("github.com") ? project.url : "");
          const href = live || code;
          const flip = i % 2 === 1;
          const [sticker, stickerColor] = stickers[project.status] ?? ["shipped", "var(--sage)"];
          const name = project.title.split(":")[0];
          const art = <CoverArt cover={item.cover} index={i} />;
          return (
            <Reveal key={project.title}>
              <article className={`spread ${flip ? "flip" : ""}`} style={{ ["--tilt" as string]: `${flip ? 0.7 : -0.7}deg` }}>
                <span className="tape tape-left" style={{ background: tapes[i % 4][0] }} />
                <span className="tape tape-right" style={{ background: tapes[i % 4][1] }} />
                {href ? (
                  <a
                    className="spread-cover"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-tag={live ? "visit the site" : "read the code"}
                    aria-label={`${name}: ${live ? "visit the live site" : "view the code"}`}
                  >
                    {art}
                  </a>
                ) : (
                  <div className="spread-cover">{art}</div>
                )}
                <div className="spread-copy">
                  <div className="spread-meta">
                    <span className="spread-category">{project.category}</span>
                    <span className="sticker" style={{ background: stickerColor, rotate: `${flip ? 3 : -3}deg` }}>
                      {sticker}
                    </span>
                  </div>
                  <h3>{name}</h3>
                  <p className="spread-title">{item.title}</p>
                  <p className="spread-text">{item.text}</p>
                  <ul className="checklist">
                    {item.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="tags">
                    {project.tech.slice(0, 5).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  {href && (
                    <div className="spread-links">
                      {live && (
                        <a className="text-link" href={live} target="_blank" rel="noreferrer">
                          visit live <Icon name="external" />
                        </a>
                      )}
                      {code && (
                        <a className="text-link" href={code} target="_blank" rel="noreferrer">
                          read the code <Icon name="external" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <div className="work-more">
        <span className="hand-note">there&apos;s more where that came from</span>
        <Link href="/projects" className="btn-secondary">
          <Exclaims />
          browse all {projects.length} projects →
        </Link>
      </div>
    </section>
  );
}
