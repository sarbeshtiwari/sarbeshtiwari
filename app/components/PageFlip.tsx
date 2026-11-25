"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Doodle } from "./Doodles";

// Page turns. On every full load the notebook cover shows, gets scribbled
// over in marker, then peels away from the bottom-right corner. Internal link
// clicks do the same without the cover: blank paper, scribble, peel, with the
// next page already rendered underneath.
const COVER = 2000;
const SCRIBBLE = 2000;
const PAUSE = 250;
const PEEL = 1000;

type Mode = "intro" | "nav";
type Pt = [number, number];

const poly = (pts: Pt[]) =>
  pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(", ");

// Four zig-zag marker sweeps that together blacken a 1280×720 sheet.
const scribblePaths = (() => {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return [0, 1, 2, 3].map((k) => {
    let y = -90 + k * 45;
    let right = k % 2 === 0;
    let d = `M ${right ? -100 : 1380} ${y}`;
    while (y < 820) {
      const ny = y + 160 + rnd() * 50;
      const cx = 640 + (rnd() - 0.5) * 520;
      d += ` Q ${cx.toFixed(0)} ${(y + ny) / 2 - 140 + rnd() * 60} ${right ? 1380 : -100} ${ny.toFixed(0)}`;
      y = ny;
      right = !right;
    }
    return d;
  });
})();

function Scribble({ active }: { active: boolean }) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const [lengths, setLengths] = useState<number[] | null>(null);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    setLengths(refs.current.map((p) => p?.getTotalLength() ?? 6000));
  }, []);
  useEffect(() => {
    if (!active || !lengths) return;
    const frame = requestAnimationFrame(() => setDrawing(true));
    return () => cancelAnimationFrame(frame);
  }, [active, lengths]);
  return (
    <svg className="scribble" viewBox="0 0 1280 720" preserveAspectRatio="none">
      {scribblePaths.map((d, i) => {
        const len = lengths?.[i] ?? 99999;
        return (
          <path
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            d={d}
            style={{
              strokeDasharray: len,
              strokeDashoffset: drawing ? 0 : len,
              transition: drawing ? `stroke-dashoffset ${SCRIBBLE}ms linear` : "none",
            }}
          />
        );
      })}
    </svg>
  );
}

function Cover() {
  return (
    <>
      <div className="cover">
        <div className="cover-line light">
          dev log v1.0
          <br />
          maintained by:
        </div>
        <div className="cover-name">
          <span>sarbesh</span>
          <svg viewBox="0 0 300 24" preserveAspectRatio="none">
            <path d="M4 14 Q26 4 48 13 T92 13 T136 12 T180 13 T224 12 T268 13 T296 11" />
          </svg>
        </div>
        <div className="cover-line">
          if it compiles,
          <br />
          ship it (after the tests)
        </div>
      </div>
      <Doodle name="braces" className="cover-doodle" style={{ top: "7%", left: "5%", rotate: "-9deg" }} wobble="c" />
      <Doodle name="bolt" className="cover-doodle" style={{ top: "9%", right: "5%", rotate: "12deg" }} wobble="d" />
      <Doodle name="spiral" className="cover-doodle" style={{ top: "54%", left: "5%", rotate: "-4deg" }} wobble="a" delay={1.8} />
      <Doodle name="cursor" className="cover-doodle" style={{ bottom: "7%", right: "6%", rotate: "8deg" }} wobble="b" delay={0.6} />
    </>
  );
}

function PageFlip({ mode, onReveal, onDone }: { mode: Mode; onReveal: () => void; onDone: () => void }) {
  const hold = mode === "intro" ? COVER : 0;
  // 0 cover · 1 scribbling · 2 inked · 3 peeling
  const [stage, setStage] = useState(mode === "intro" ? 0 : 1);
  const [t, setT] = useState(0);
  const [size, setSize] = useState({ w: 1240, h: 820 });
  const callbacks = useRef({ onReveal, onDone });
  callbacks.current = { onReveal, onDone };

  useEffect(() => {
    const measure = () => setSize({ w: innerWidth, h: innerHeight });
    measure();
    addEventListener("resize", measure);
    const timers = [
      setTimeout(() => setStage(1), hold),
      setTimeout(() => setStage(2), hold + SCRIBBLE),
      setTimeout(() => {
        setStage(3);
        callbacks.current.onReveal();
      }, hold + SCRIBBLE + PAUSE),
      setTimeout(() => callbacks.current.onDone(), hold + SCRIBBLE + PAUSE + PEEL + 120),
    ];
    return () => {
      timers.forEach(clearTimeout);
      removeEventListener("resize", measure);
    };
  }, [hold]);

  useEffect(() => {
    if (stage !== 3) return;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / PEEL);
      setT(p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  // The fold line travels along the diagonal from the bottom-right corner to
  // the top-left. `front` is what remains of the sheet; `flap` is the folded
  // part, mirrored across the fold line to show the back of the page.
  const { w, h } = size;
  const d = w * w + h * h;
  const fx = w * (1 - t);
  const fy = h * (1 - t);
  const top = (d * (1 - t)) / w;
  const right = h - (t * d) / h;
  const bottom = w - (t * d) / w;
  const left = (d * (1 - t)) / h;
  const within = (v: number, max: number) => v >= -0.01 && v <= max + 0.01;
  let front: Pt[] | null = null;
  let folded: Pt[] = [];
  if (t > 0.0005 && t < 0.9995) {
    if (within(right, h) && within(bottom, w)) {
      front = [[0, 0], [w, 0], [w, right], [bottom, h], [0, h]];
      folded = [[bottom, h], [w, h], [w, right]];
    } else if (within(top, w) && within(bottom, w)) {
      front = [[0, 0], [top, 0], [bottom, h], [0, h]];
      folded = [[top, 0], [w, 0], [w, h], [bottom, h]];
    } else if (within(top, w) && within(left, h)) {
      front = [[0, 0], [top, 0], [0, left]];
      folded = [[top, 0], [w, 0], [w, h], [0, h], [0, left]];
    }
  } else if (t >= 0.9995) {
    front = [];
    folded = [[0, 0], [w, 0], [w, h], [0, h]];
  }
  const flap = folded.map(([x, y]): Pt => {
    const k = (2 * ((x - fx) * w + (y - fy) * h)) / d;
    return [x - k * w, y - k * h];
  });
  const crease = 1.4 * Math.sqrt(d);
  const angle = (180 * Math.atan2(w, -h)) / Math.PI;

  return (
    <div className="page-curl" aria-hidden="true" style={{ pointerEvents: stage < 3 ? "auto" : "none" }}>
      {(front === null || front.length >= 3) && (
        <div className="page-curl-front" style={front ? { clipPath: `polygon(${poly(front)})` } : undefined}>
          {mode === "intro" && <Cover />}
          <Scribble active={stage >= 1} />
        </div>
      )}
      {t > 0.01 && t < 0.985 && (
        <div
          className="page-curl-crease"
          style={{ left: fx - crease / 2, top: fy - 55, width: crease, transform: `rotate(${angle}deg)`, opacity: Math.min(1, 4 * t) }}
        />
      )}
      {flap.length >= 3 && t > 0.005 && <div className="page-curl-back" style={{ clipPath: `polygon(${poly(flap)})` }} />}
    </div>
  );
}

const setCovered = (on: boolean) => document.documentElement.classList.toggle("page-covered", on);

export default function PageTransitions() {
  const router = useRouter();
  const [run, setRun] = useState<{ mode: Mode; id: number } | null>({ mode: "intro", id: 0 });
  const busy = useRef(true);
  busy.current = run !== null;

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRun(null);
      setCovered(false);
    }
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (busy.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest("a") : null;
      const href = link?.getAttribute("href");
      if (!link || !href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      busy.current = true;
      setCovered(true);
      setRun({ mode: "nav", id: performance.now() });
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  if (!run) return null;
  return <PageFlip key={run.id} mode={run.mode} onReveal={() => setCovered(false)} onDone={() => setRun(null)} />;
}
