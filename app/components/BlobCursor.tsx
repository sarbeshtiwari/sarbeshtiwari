"use client";
import { useEffect, useRef, useState } from "react";

// A trail of six ink blobs that chase the pointer, each a little slower,
// smaller and softer than the one before. Elements with `data-cursor-tag`
// show that text in a pill beside the pointer.
const blobs = [
  { size: 22, color: "var(--tomato)", shape: "62% 38% 58% 42% / 50% 60% 40% 50%", opacity: 1 },
  { size: 16, color: "var(--marigold)", shape: "38% 62% 42% 58% / 60% 40% 60% 40%", opacity: 0.85 },
  { size: 12, color: "var(--rose)", shape: "52% 48% 38% 62% / 42% 58% 42% 58%", opacity: 0.7 },
  { size: 10, color: "var(--lake)", shape: "60% 40% 60% 40% / 40% 60% 40% 60%", opacity: 0.55 },
  { size: 8, color: "var(--sage)", shape: "40% 60% 50% 50% / 60% 30% 70% 40%", opacity: 0.45 },
  { size: 6, color: "var(--grape)", shape: "50% 50% 60% 40% / 50% 50% 50% 50%", opacity: 0.35 },
];

export default function BlobCursor() {
  const trail = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (
      matchMedia("(pointer: coarse)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const points = blobs.map(() => ({ ...target }));
    setEnabled(true);
    document.documentElement.classList.add("has-blob-cursor");

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target instanceof Element ? e.target : null;
      setHot(!!el?.closest("a, button, summary, [data-hot]"));
      setLabel(el?.closest("[data-cursor-tag]")?.getAttribute("data-cursor-tag") ?? null);
    };
    addEventListener("mousemove", move);

    let frame = 0;
    let last = performance.now();
    let prevX = points[0].x;
    let prevY = points[0].y;
    const tick = (now: number) => {
      const dt = Math.min(60, Math.max(0, now - last));
      last = now;
      points.forEach((p, i) => {
        const lead = i === 0 ? target : points[i - 1];
        const k = 1 - Math.exp(-(0.022 - 0.0025 * i) * dt);
        p.x += (lead.x - p.x) * k;
        p.y += (lead.y - p.y) * k;
      });
      // Blobs drift in small orbits when the pointer rests and tighten when it moves.
      const speed = dt > 0 ? Math.hypot(points[0].x - prevX, points[0].y - prevY) / dt : 0;
      prevX = points[0].x;
      prevY = points[0].y;
      const calm = 1 / (1 + 8 * speed);
      const nodes = trail.current?.children;
      if (nodes)
        points.forEach((p, i) => {
          const node = nodes[i] as HTMLElement | undefined;
          if (!node) return;
          const phase = now / (520 + 90 * i) + 0.7 * i;
          const radius = (i === 0 ? 0 : 0.6 + 0.4 * i) * calm;
          node.style.transform = `translate3d(${p.x + Math.cos(phase) * radius}px, ${p.y + Math.sin(1.13 * phase) * radius}px, 0)`;
        });
      if (tag.current)
        tag.current.style.transform = `translate3d(${target.x + 18}px, ${target.y + 18}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-blob-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className="blob-cursor" aria-hidden="true">
      <div ref={trail}>
        {blobs.map((b, i) => (
          <div className="blob-anchor" key={b.color}>
            <div
              className="blob"
              style={{
                width: b.size,
                height: b.size,
                marginLeft: -b.size / 2,
                marginTop: -b.size / 2,
                background: b.color,
                borderRadius: b.shape,
                opacity: b.opacity,
                transform: `scale(${hot && i === 0 ? (b.size + 6) / b.size : 1})`,
                filter: i === 0 ? "none" : `blur(${0.4 * i}px)`,
              }}
            />
          </div>
        ))}
      </div>
      <div ref={tag} className="cursor-tag" style={{ opacity: label ? 1 : 0 }}>
        {label}
      </div>
    </div>
  );
}
