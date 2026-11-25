import { pageMetadata } from "../data/site";
import Image from "next/image";
import Link from "next/link";
import { profile, skillGroups } from "../data/portfolio";
import { Doodle } from "../components/Doodles";
import { Exclaims } from "../components/ui";
import Reveal from "../components/Reveal";
import BottomFade from "../components/BottomFade";
export const metadata = pageMetadata("/about");

const notes = [
  { label: "currently", text: "Full stack engineer (AI) at Quess Corp, working for Ethara.ai on a platform around the ARC-AGI-3 reasoning benchmark.", color: "var(--note-marigold)", tilt: -2.5 },
  { label: "studied", text: "B.Tech in Data Science & Artificial Intelligence, SRMU Lucknow, 2020–2024.", color: "var(--note-sage)", tilt: 1.8 },
  { label: "based in", text: "Gurugram, India. Open to roles anywhere in India, or fully remote.", color: "var(--note-rose)", tilt: -1.2 },
  { label: "side quests", text: "Voice-driving terminal agents, LLM trading agents with hard guardrails, ads for AI thinking time.", color: "var(--note-lake)", tilt: 2.4 },
  { label: "proudest moment", text: "Smart India Hackathon 2022 finalist.", color: "var(--note-marigold)", tilt: -1.6, href: "/certifications" },
  { label: "how i work", text: "Prototype fast, then put the guardrails, tests and logs in before anyone depends on it.", color: "var(--note-sage)", tilt: 1.4 },
];

const tapes = ["var(--tape-marigold)", "var(--tape-sage)", "var(--tape-rose)", "var(--tape-lake)"];

export default function About() {
  return (
    <div className="sketch-page">
      <Doodle name="star" className="margin-doodle" style={{ top: 140, right: 48, width: 70, rotate: "12deg" }} wobble="a" duration={6.4} />
      <Doodle name="squiggle" className="margin-doodle" style={{ top: 900, left: 36, width: 90, rotate: "-10deg" }} wobble="c" duration={5.8} delay={0.6} />
      <Doodle name="asterisk" className="margin-doodle" style={{ top: 1700, right: 52, width: 56, rotate: "8deg" }} wobble="d" duration={6.1} delay={1.1} />

      <section className="about-hero">
        <figure className="polaroid" data-cursor-tag="hi there!">
          <span className="tape tape-left" style={{ background: "var(--tape-marigold)" }} />
          <span className="tape tape-right" style={{ background: "var(--tape-lake)" }} />
          <div className="polaroid-photo">
            <Image src="/assets/sarbesh.jpg" alt="Portrait of Sarbesh Kumar Tiwari" width={460} height={460} priority />
          </div>
          <figcaption>me, probably debugging a prompt</figcaption>
        </figure>
        <div className="about-intro">
          <span className="hand-note about-hello">
            <Doodle name="arrow" className="about-hello-arrow" />
            that&apos;s me!
          </span>
          <p className="kicker">ABOUT · /02</p>
          <h1>
            hi, i&apos;m <span className="ink-mark">sarbesh</span>. i build products on top of{" "}
            <em>generative AI</em>.
          </h1>
          <p>
            I started out in data science and found I kept wanting to ship things, not just
            train models. These days I build LLM agents, voice interfaces and AI tools, plus the
            backends, APIs and screens that turn them into products people can use.
          </p>
          <p>
            Before AI took over my side projects I spent a few years shipping web platforms,
            Flutter apps and AWS deployments. That background is why I care about the boring parts:
            auth, logging, guardrails and what happens when the model is wrong.
          </p>
          <div className="about-actions">
            <a className="btn-primary" href={profile.resume} download>
              <Exclaims />
              grab my résumé ↓
            </a>
            <Link className="btn-secondary" href="/experience">
              <Exclaims />
              where i&apos;ve worked →
            </Link>
          </div>
        </div>
      </section>

      <section className="sketch-section">
        <h2 className="sketch-heading">
          <span className="hand-note">a few things about me</span>
        </h2>
        <div className="note-board">
          {notes.map((n, i) => {
            const body = (
              <>
                <span className="pin" />
                <span className="note-label">{n.label}</span>
                <p>{n.text}</p>
              </>
            );
            return (
              <Reveal key={n.label}>
                {n.href ? (
                  <Link href={n.href} className="sticky-note" style={{ background: n.color, rotate: `${n.tilt}deg`, animationDelay: `${i * 0.4}s` }}>
                    {body}
                  </Link>
                ) : (
                  <div className="sticky-note" style={{ background: n.color, rotate: `${n.tilt}deg`, animationDelay: `${i * 0.4}s` }}>
                    {body}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="sketch-section">
        <h2 className="sketch-heading">
          <span className="hand-note">my toolkit</span>
        </h2>
        <div className="toolkit">
          {skillGroups.map((g, i) => (
            <Reveal key={g.name}>
              <article className="index-card" style={{ ["--tilt" as string]: `${i % 2 ? 1 : -1}deg` }}>
                <span className="tape tape-center" style={{ background: tapes[i % 4] }} />
                <header>
                  <span className="index-num">0{i + 1}</span>
                  <h3>{g.name}</h3>
                </header>
                <p>{g.description}</p>
                <div className="tags">
                  {g.skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sketch-cta">
        <span className="hand-note">want the longer version?</span>
        <div className="about-actions">
          <Link className="btn-primary" href="/contact">
            <Exclaims />
            say hello →
          </Link>
          <Link className="btn-secondary" href="/certifications">
            <Exclaims />
            certifications
          </Link>
        </div>
      </section>
      <BottomFade />
    </div>
  );
}
