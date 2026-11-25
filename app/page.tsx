import { pageMetadata } from "./data/site";
import Link from "next/link";
import { WorkSection } from "./components/PortfolioSections";
import { Doodle } from "./components/Doodles";
import BottomFade from "./components/BottomFade";
import { Exclaims } from "./components/ui";
export const metadata = pageMetadata("/");

// Words of the headline rise in one by one; `em` words are the coloured italics.
const headline: [string, "plain" | "em" | "mark"][] = [
  ["hi,", "plain"], ["i'm", "plain"], ["an", "plain"],
  ["AI engineer", "mark"],
  ["who", "plain"], ["ships", "plain"],
  ["LLM", "em"], ["agents,", "em"], ["voice", "em"], ["interfaces", "em"],
  ["and", "plain"], ["the", "plain"], ["stack", "plain"], ["around", "plain"], ["them.", "plain"],
];

export default function Home() {
  return (
    <div className="home">
      <Doodle name="asterisk" className="margin-doodle" style={{ top: 120, right: 56, width: 64, rotate: "12deg" }} wobble="c" duration={5.6} delay={0.3} />
      <Doodle name="spiral" className="margin-doodle" style={{ top: 980, left: 40, width: 72, rotate: "-8deg" }} wobble="d" duration={6.2} delay={0.8} />
      <Doodle name="star" className="margin-doodle" style={{ top: 1560, right: 40, width: 84, rotate: "14deg" }} wobble="a" duration={7.1} />
      <Doodle name="braces" className="margin-doodle" style={{ top: 2280, left: 48, width: 76, rotate: "-6deg" }} wobble="b" duration={6.6} delay={1.2} />
      <Doodle name="bolt" className="margin-doodle" style={{ top: 3000, right: 60, width: 60, rotate: "10deg" }} wobble="c" duration={5.9} delay={0.5} />

      <section id="home" className="hero">
        <div className="hero-portrait">
          <Doodle name="desk" className="hero-desk" label="A doodle of a laptop with code on screen, a mug of tea and a sticky note" />
          <span className="hero-aside">
            my natural habitat
            <Doodle name="arrow" className="hero-aside-arrow" />
          </span>
          <span className="hero-signature">sarbesh, 2026</span>
        </div>
        <div className="hero-meta">
          <span>GURUGRAM, INDIA</span>
          <i>•</i>
          <span>AI ENGINEER @ QUESS CORP × ETHARA.AI</span>
          <i>•</i>
          <span>OPEN TO WORK: ANYWHERE IN INDIA OR REMOTE</span>
        </div>
        <h1>
          {headline.map(([word, kind], i) => {
            const style = { animationDelay: `${0.15 + i * 0.05}s` };
            if (kind === "mark")
              return (
                <span key={i} className="hero-mark">
                  {word.split(" ").map((w, j) => (
                    <span key={w} className="hero-word" style={{ animationDelay: `${0.15 + (i + j) * 0.05}s` }}>
                      {w}{" "}
                    </span>
                  ))}
                  <svg viewBox="0 0 240 22" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 12 Q40 4, 90 10 Q140 16, 200 8 Q220 5, 238 11" filter="url(#brush)" />
                  </svg>{" "}
                </span>
              );
            return (
              <span key={i} className={`hero-word ${kind === "em" ? "em" : ""}`} style={style}>
                {word}{" "}
              </span>
            );
          })}
        </h1>
        <p className="hero-sub">
          I take generative AI from prompt to production: agents with guardrails, models running locally, and the APIs and interfaces people actually use.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="#work">
            <Exclaims />
            see my work →
          </a>
          <Link className="btn-secondary" href="/about">
            <Exclaims />
            more about me
          </Link>
        </div>
        <a className="hero-cue" href="#work">
          <span>flip through my work</span>
          <span className="hero-cue-arrow" aria-hidden="true">↓</span>
        </a>
      </section>

      <WorkSection />
      <BottomFade />
    </div>
  );
}
