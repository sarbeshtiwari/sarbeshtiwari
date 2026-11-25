import { pageMetadata } from "../data/site";
import Link from "next/link";
import { experiences } from "../data/portfolio";
import { Doodle } from "../components/Doodles";
import { Exclaims } from "../components/ui";
import Reveal from "../components/Reveal";
import BottomFade from "../components/BottomFade";
export const metadata = pageMetadata("/experience");

const education = [
  ["2020 – 2024", "B.Tech · Data Science & Artificial Intelligence", "Shri Ramswaroop Memorial University, Lucknow", "var(--note-marigold)"],
  ["2019 – 2020", "Intermediate · Class 12", "Kendriya Vidyalaya Lucknow Cantt", "var(--note-sage)"],
  ["2017 – 2018", "High School · Class 10", "Kendriya Vidyalaya Lucknow Cantt", "var(--note-rose)"],
];

const stickers: Record<string, [string, string]> = {
  "Full-time": ["full-time", "var(--lake)"],
  Internship: ["internship", "var(--marigold)"],
};
const tapes = ["var(--tape-marigold)", "var(--tape-sage)", "var(--tape-rose)", "var(--tape-lake)"];

export default function Experience() {
  return (
    <div className="sketch-page">
      <Doodle name="bolt" className="margin-doodle" style={{ top: 150, left: 52, width: 60, rotate: "-10deg" }} wobble="b" duration={6.2} />
      <Doodle name="spiral" className="margin-doodle" style={{ top: 1100, right: 44, width: 70, rotate: "8deg" }} wobble="d" duration={6.8} delay={0.7} />

      <header className="sketch-header">
        <p className="kicker">EXPERIENCE · /03</p>
        <h1>
          where i&apos;ve <span className="ink-mark">worked</span>, and what i <em>learned</em> there.
        </h1>
        <p>
          From Flutter internships to production web platforms on AWS, and now AI platforms.
          Newest first.
        </p>
      </header>

      <section className="timeline" aria-label="Work history">
        <svg className="timeline-line" viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M10 0 C 16 60, 4 120, 10 180 S 16 300, 10 360 S 4 480, 10 540 S 16 660, 10 720 S 4 840, 10 900 S 14 970, 10 1000" />
        </svg>
        {experiences.map((exp, i) => {
          const [label, color] = stickers[exp.type] ?? stickers["Full-time"];
          const side = i % 2 ? "right" : "left";
          return (
            <Reveal key={exp.company} className={`timeline-item ${side}`}>
              <span className={`timeline-node ${exp.current ? "is-current" : ""}`} aria-hidden="true" />
              <span className="timeline-date">{exp.period}</span>
              <article className="job-card" style={{ ["--tilt" as string]: `${side === "left" ? -0.8 : 0.8}deg` }}>
                <span className="tape tape-left" style={{ background: tapes[i % 4] }} />
                <span className="sticker" style={{ background: color, rotate: `${side === "left" ? 3 : -3}deg` }}>
                  {exp.current ? "now" : label}
                </span>
                <h2>{exp.company}</h2>
                {"client" in exp && exp.client && (
                  <p className="job-client">
                    working for <strong>{exp.client}</strong>
                  </p>
                )}
                <p className="job-role">
                  {exp.role} <span>· {exp.location}</span>
                </p>
                <ul>
                  {exp.description.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="tags">
                  {exp.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      <section className="sketch-section">
        <h2 className="sketch-heading">
          <span className="hand-note">where it started</span>
        </h2>
        <div className="report-cards">
          {education.map(([years, title, school, color], i) => (
            <Reveal key={title}>
              <article className="report-card" style={{ ["--tilt" as string]: `${[-1.5, 1, -0.6][i]}deg` }}>
                <span className="report-margin" style={{ background: color }} />
                <span className="report-years">{years}</span>
                <h3>{title}</h3>
                <p>{school}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sketch-cta">
        <span className="hand-note">the receipts</span>
        <div className="about-actions">
          <Link className="btn-primary" href="/certifications">
            <Exclaims />
            see certifications →
          </Link>
          <Link className="btn-secondary" href="/projects">
            <Exclaims />
            all projects
          </Link>
        </div>
      </section>
      <BottomFade />
    </div>
  );
}
