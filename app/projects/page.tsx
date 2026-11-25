import { pageMetadata } from "../data/site";
import Link from "next/link";
import ProjectsClient from "./ProjectsClient";
import { projects } from "../data/portfolio";
import { Doodle } from "../components/Doodles";
import { Exclaims } from "../components/ui";
import BottomFade from "../components/BottomFade";
export const metadata = pageMetadata("/projects");

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  return (
    <div className="sketch-page">
      <Doodle name="braces" className="margin-doodle" style={{ top: 150, left: 46, width: 66, rotate: "-8deg" }} wobble="c" duration={6.1} />
      <Doodle name="cursor" className="margin-doodle" style={{ top: 1300, right: 44, width: 60, rotate: "10deg" }} wobble="a" duration={6.6} delay={0.8} />

      <header className="sketch-header">
        <p className="kicker">THE ARCHIVE · {projects.length} PROJECTS</p>
        <h1>
          every <span className="ink-mark">project</span>, filed away in one <em>drawer</em>.
        </h1>
        <p>
          AI agents and tools, production web platforms, Flutter apps and the odd experiment.
          Filter by kind, or search for a tool you care about.
        </p>
      </header>

      <section className="sketch-section archive">
        <ProjectsClient
          initialFilter={filter === "ai" ? "AI & experiments" : filter === "featured" ? "Featured" : "All projects"}
        />
      </section>

      <section className="sketch-cta">
        <span className="hand-note">like what you see?</span>
        <div className="about-actions">
          <Link className="btn-primary" href="/contact">
            <Exclaims />
            let&apos;s talk →
          </Link>
          <Link className="btn-secondary" href="/#work">
            <Exclaims />
            the highlights
          </Link>
        </div>
      </section>
      <BottomFade />
    </div>
  );
}
