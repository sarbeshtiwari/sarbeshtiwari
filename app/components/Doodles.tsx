import type { CSSProperties, ReactNode } from "react";

// Ink doodles drawn as SVG. A shared turbulence filter roughens the edges so
// they read as marker on paper; `wobble` jitters them in stepped frames.
const ink = "var(--doodle-ink)";
const stroke = { fill: "none", stroke: ink, strokeWidth: 9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const shapes: Record<string, ReactNode> = {
  braces: (
    <g {...stroke} strokeWidth={11}>
      <path d="M40 14c-14 0-16 8-16 20v14c0 8-4 12-12 12 8 0 12 4 12 12v14c0 12 2 20 16 20" />
      <path d="M80 14c14 0 16 8 16 20v14c0 8 4 12 12 12-8 0-12 4-12 12v14c0 12-2 20-16 20" />
      <circle cx="60" cy="60" r="5" fill={ink} stroke="none" />
    </g>
  ),
  bolt: <path d="M70 6 24 66h30l-10 48 52-66H64l14-42Z" fill={ink} />,
  spiral: (
    <path
      {...stroke}
      strokeWidth={8}
      d="M62 60c0-4 6-5 8-1 3 6-3 12-10 12-10 0-15-10-12-19 4-12 18-17 29-12 14 6 18 23 11 36-8 16-29 21-45 13C24 79 18 55 27 38 38 18 64 11 84 21"
    />
  ),
  cursor: (
    <g>
      <path d="M22 10v86l24-22 16 36 18-8-16-35h33L22 10Z" fill={ink} />
      <path d="M34 36v38l12-11" fill="none" stroke="var(--paper)" strokeWidth="5" strokeLinecap="round" opacity=".55" />
    </g>
  ),
  star: <path d="M60 8 72 44l38 2-30 23 11 38-31-22-31 22 11-38L10 46l38-2L60 8Z" fill={ink} />,
  asterisk: (
    <g {...stroke} strokeWidth={13}>
      <path d="M60 14v92M20 37l80 46M20 83l80-46" />
    </g>
  ),
  arrow: (
    <g {...stroke} strokeWidth={6}>
      <path d="M108 26C82 18 50 28 34 56c-6 10-8 20-8 30" />
      <path d="m12 70 14 20 18-16" />
    </g>
  ),
  squiggle: <path {...stroke} strokeWidth={7} d="M6 60c10-22 20-22 30 0s20 22 30 0 20-22 30 0 14 18 20 8" />,
  // The hero illustration: a laptop with an editor open, a mug, and a sticky note.
  desk: (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 86h164l12 20H8l12-20Z" fill="var(--paper-tint)" stroke={ink} strokeWidth="5" />
      <rect x="32" y="12" width="140" height="74" rx="8" fill="var(--grape)" stroke={ink} strokeWidth="5" />
      <rect x="42" y="22" width="120" height="54" rx="3" fill="var(--paper)" stroke={ink} strokeWidth="3" />
      <g strokeWidth="5" fill="none">
        <path d="M52 36h22" stroke="var(--tomato)" />
        <path d="M80 36h30" stroke="var(--lake)" />
        <path d="M60 48h40" stroke="var(--sage)" />
        <path d="M106 48h18" stroke="var(--marigold)" />
        <path d="M60 60h26" stroke="var(--lake)" />
        <path d="M52 68h12" stroke="var(--tomato)" />
      </g>
      <path d="M140 36l8 8-8 8" fill="none" stroke={ink} strokeWidth="4" />
      <path d="M86 96h32" stroke={ink} strokeWidth="4" />
      <path d="M178 66h20v30c0 6-4 9-10 9s-10-3-10-9V66Z" fill="var(--tomato)" stroke={ink} strokeWidth="4.5" />
      <path d="M198 72c8 0 9 12 0 12" fill="none" stroke={ink} strokeWidth="4" />
      <path d="M184 58c-2-6 4-8 2-14M192 58c-2-6 4-8 2-14" fill="none" stroke={ink} strokeWidth="3" opacity=".6" />
      <path d="M150 2h26v24h-26z" fill="var(--marigold)" stroke={ink} strokeWidth="3.5" transform="rotate(8 163 14)" />
      <path d="M155 11h16M155 18h11" stroke={ink} strokeWidth="2.5" transform="rotate(8 163 14)" />
    </g>
  ),
};

const boxes: Record<string, string> = { desk: "0 -6 212 120", squiggle: "0 30 124 60" };

export function Doodle({
  name,
  className = "",
  style,
  wobble,
  duration = 5.6,
  delay = 0,
  label,
}: {
  name: keyof typeof shapes;
  className?: string;
  style?: CSSProperties;
  wobble?: "a" | "b" | "c" | "d";
  duration?: number;
  delay?: number;
  label?: string;
}) {
  return (
    <span className={`doodle ${className}`} style={style} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg
        viewBox={boxes[name] ?? "0 0 120 120"}
        style={wobble ? { animation: `wobble-${wobble} ${duration}s step-end ${delay}s infinite` } : undefined}
      >
        <g filter="url(#rough-ink)">{shapes[name]}</g>
      </svg>
    </span>
  );
}

// Mounted once in the layout; every doodle references it.
export function DoodleDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="rough-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
        <filter id="brush" x="-5%" y="-50%" width="110%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="2.5" />
        </filter>
      </defs>
    </svg>
  );
}
