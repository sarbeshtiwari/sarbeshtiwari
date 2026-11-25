"use client";
import { useMemo, useState } from "react";
import { projects } from "../data/portfolio";
import { Icon } from "../components/ui";

type Project = (typeof projects)[number];

const ai = ["AI Gaming", "Game Platform", "AI / ML", "Chatbot", "AI Tool", "AI / Fintech", "Ad Tech"];
const web = ["Web Platform", "E-Commerce", "News Portal", "SaaS", "Quick Commerce", "Dashboard", "Ad Tech"];
const filters: [string, (p: Project) => boolean][] = [
  ["All projects", () => true],
  ["Featured", (p) => !!p.featured],
  ["AI & experiments", (p) => ai.includes(p.category)],
  ["Web platforms", (p) => web.includes(p.category)],
  ["Mobile apps", (p) => p.category === "Mobile App"],
  ["Backend", (p) => p.category === "Backend"],
  ["In Progress", (p) => p.status === "In Progress"],
  ["Personal", (p) => p.status === "Personal"],
];

// Folder colour follows the kind of work; the stamp follows its status.
const folderColor = (p: Project) =>
  ai.includes(p.category)
    ? "var(--grape)"
    : p.category === "Mobile App"
      ? "var(--sage-deep)"
      : p.category === "Backend"
        ? "var(--marigold-deep)"
        : web.includes(p.category)
          ? "var(--lake)"
          : "var(--rose-deep)";
const stamps: Record<string, [string, string]> = {
  Active: ["live", "var(--sage-deep)"],
  "In Progress": ["in progress", "var(--marigold-deep)"],
  Completed: ["shipped", "var(--lake-deep)"],
  Personal: ["side quest", "var(--rose-deep)"],
};
const tilts = [-1.4, 0.9, -0.6, 1.5, -1, 0.5];

function Folder({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const live = project.url && project.url !== "#" && !project.url.includes("github.com") ? project.url : "";
  const code = project.repo || (project.url?.includes("github.com") ? project.url : "");
  const [stamp, stampColor] = stamps[project.status] ?? stamps.Completed;
  const long = project.desc.length > 190;
  return (
    <article
      className="folder"
      style={{
        ["--folder" as string]: folderColor(project),
        ["--tilt" as string]: `${tilts[index % tilts.length]}deg`,
        animationDelay: `${Math.min(index, 11) * 45}ms`,
      }}
    >
      <span className="folder-tab">{project.category}</span>
      <div className="folder-body">
        {project.featured && (
          <span className="folder-star" title="Featured project" aria-label="Featured project">
            ★
          </span>
        )}
        <span className="rubber-stamp" style={{ color: stampColor }}>
          {stamp}
        </span>
        <h2>{project.title}</h2>
        <p className={`folder-desc ${long && !open ? "clamped" : ""}`}>{project.desc}</p>
        {long && (
          <button className="folder-more" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "fold it back ↑" : "read the rest ↓"}
          </button>
        )}
        <div className="tags">
          {project.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="folder-links">
          {live && (
            <a className="text-link" href={live} target="_blank" rel="noreferrer">
              visit live <Icon name="external" />
            </a>
          )}
          {code && (
            <a className="text-link" href={code} target="_blank" rel="noreferrer">
              {code === "https://github.com/sarbeshtiwari" ? "my github" : "read the code"} <Icon name="external" />
            </a>
          )}
          {!live && !code && <span className="folder-private">client work · link not public</span>}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsClient({ initialFilter = "All projects" }: { initialFilter?: string }) {
  const [filter, setFilter] = useState(initialFilter);
  const [query, setQuery] = useState("");
  const counts = useMemo(() => Object.fromEntries(filters.map(([name, test]) => [name, projects.filter(test).length])), []);
  const test = filters.find(([name]) => name === filter)?.[1] ?? (() => true);
  const q = query.trim().toLowerCase();
  const shown = projects.filter(
    (p) =>
      test(p) &&
      (!q || [p.title, p.desc, p.category, ...p.tech].some((field) => field.toLowerCase().includes(q))),
  );
  return (
    <>
      <div className="archive-tools">
        <label className="archive-search">
          <span className="sr-only">Search projects</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search by name or tech: claude, flutter, postgres…"
          />
        </label>
        <div className="sticker-filters" role="group" aria-label="Filter projects">
          {filters.map(([name], i) => (
            <button
              key={name}
              className={filter === name ? "active" : ""}
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
              style={{ rotate: `${(i % 3) - 1}deg` }}
            >
              {name.toLowerCase()} <sup>{counts[name]}</sup>
            </button>
          ))}
        </div>
      </div>
      <p className="archive-count" role="status">
        {shown.length === 0
          ? "nothing in this drawer. try another filter?"
          : `${shown.length} ${shown.length === 1 ? "folder" : "folders"} in this drawer`}
      </p>
      <div className="folder-grid" key={filter + q}>
        {shown.map((project, i) => (
          <Folder key={project.title} project={project} index={i} />
        ))}
      </div>
    </>
  );
}
