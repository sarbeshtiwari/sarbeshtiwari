"use client";
import { useEffect, useState } from "react";

// Pages dissolve into the paper at the bottom edge once the reader is past
// the hero, and the fade lifts again near the footer.
export default function BottomFade() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const update = () => {
      const footer = document.querySelector("footer")?.getBoundingClientRect().top ?? Infinity;
      setOn(scrollY > 160 && footer > innerHeight + 40);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);
  return <div className={`bottom-fade ${on ? "is-on" : ""}`} aria-hidden="true" />;
}
