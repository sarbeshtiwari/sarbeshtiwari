"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { certs } from "../data/certifications";
import { Icon } from "../components/ui";

const tapes = ["var(--tape-marigold)", "var(--tape-sage)", "var(--tape-rose)", "var(--tape-lake)"];
const tilts = [-2.2, 1.6, -1, 2.4, -1.8, 1.1];

// Certificates pinned up like a scrapbook wall; the Smart India Hackathon
// finalist certificate gets the spotlight above the rest.
export default function CertificationsClient() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<(typeof certs)[number] | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const images = selected ? [{ image: selected.image, label: "Certificate" }, ...selected.relatedImages] : [];
  const currentImage = images[imageIndex];
  const categories = ["All", ...new Set(certs.map((c) => c.category))];
  const [spotlight, ...rest] = certs;
  const visible = rest.filter((c) => filter === "All" || c.category === filter);
  const showSpotlight = filter === "All" || filter === spotlight.category;
  const open = (cert: (typeof certs)[number]) => {
    setImageIndex(0);
    setSelected(cert);
  };
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  return (
    <>
      {showSpotlight && (
        <button className="trophy" onClick={() => open(spotlight)} data-cursor-tag="take a closer look">
          <span className="tape tape-left" style={{ background: "var(--tape-marigold)" }} />
          <span className="tape tape-right" style={{ background: "var(--tape-rose)" }} />
          <span className="trophy-image">
            <Image src={spotlight.image} alt={`${spotlight.name} certificate`} fill sizes="(max-width: 900px) 90vw, 520px" priority />
          </span>
          <span className="trophy-copy">
            <span className="rosette" aria-hidden="true">
              <span>2022</span>
            </span>
            <span className="kicker">THE ONE I&apos;M PROUDEST OF</span>
            <strong>{spotlight.name}</strong>
            <span className="trophy-issuer">{spotlight.issued}</span>
            <span className="hand-note">finalist at a national hackathon</span>
          </span>
        </button>
      )}

      <div className="sticker-filters" role="group" aria-label="Filter certifications">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            aria-pressed={filter === cat}
            onClick={() => setFilter(cat)}
            style={{ rotate: `${(i % 3) - 1}deg` }}
          >
            {cat.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="cert-wall">
        {visible.map((cert, i) => (
          <button
            key={cert.name}
            className="cert-print"
            style={{ ["--tilt" as string]: `${tilts[i % tilts.length]}deg`, animationDelay: `${(i % 6) * 60}ms` }}
            onClick={() => open(cert)}
            aria-label={`View ${cert.name} certificate`}
            data-cursor-tag="open it up"
          >
            <span className="tape tape-center" style={{ background: tapes[i % 4] }} />
            <span className="cert-print-image">
              <Image src={cert.image} alt="" fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 330px" />
            </span>
            <span className="cert-print-label">{cert.category}</span>
            <strong>{cert.name}</strong>
            <span className="cert-print-issuer">
              {cert.issued}
              {cert.relatedImages.length > 0 && ` · ${cert.relatedImages.length + 1} pages`}
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="certificate-title"
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        <div className="lightbox-sheet">
          <span className="tape tape-left" style={{ background: "var(--tape-lake)" }} />
          <span className="tape tape-right" style={{ background: "var(--tape-marigold)" }} />
          <div className="lightbox-head">
            <div>
              <span className="kicker">{selected?.category}</span>
              <h2 id="certificate-title">{selected?.name}</h2>
              <p>{selected?.issued}</p>
            </div>
            <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close certificate">
              <Icon name="close" />
            </button>
          </div>
          {images.length > 1 && (
            <div className="sticker-filters small" role="group" aria-label="Certificate pages and badges">
              {images.map((item, index) => (
                <button
                  key={item.image}
                  className={index === imageIndex ? "active" : ""}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                >
                  {item.label.toLowerCase()}
                </button>
              ))}
            </div>
          )}
          {selected && currentImage && (
            <div className="lightbox-image">
              <Image src={currentImage.image} alt={`${selected.name}: ${currentImage.label}`} fill sizes="850px" />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
