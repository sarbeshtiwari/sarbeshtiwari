import { pageMetadata } from "../data/site";
import Link from "next/link";
import CertificationsClient from "./CertificationsClient";
import { certs } from "../data/certifications";
import { Doodle } from "../components/Doodles";
import { Exclaims } from "../components/ui";
import BottomFade from "../components/BottomFade";
export const metadata = pageMetadata("/certifications");

export default function Certifications() {
  return (
    <div className="sketch-page">
      <Doodle name="asterisk" className="margin-doodle" style={{ top: 150, right: 56, width: 58, rotate: "10deg" }} wobble="a" duration={6} />
      <Doodle name="spiral" className="margin-doodle" style={{ top: 1250, left: 40, width: 68, rotate: "-8deg" }} wobble="c" duration={6.6} delay={0.9} />

      <header className="sketch-header">
        <p className="kicker">CERTIFICATIONS · {certs.length} PINNED</p>
        <h1>
          the <span className="ink-mark">receipts</span>, pinned to the <em>wall</em>.
        </h1>
        <p>
          Machine learning, data science, programming and a hackathon finalist spot. Click any
          certificate to look at it up close.
        </p>
      </header>

      <section className="sketch-section">
        <CertificationsClient />
      </section>

      <section className="sketch-cta">
        <span className="hand-note">certificates are nice. shipped projects are nicer.</span>
        <div className="about-actions">
          <Link className="btn-primary" href="/#work">
            <Exclaims />
            see my work →
          </Link>
          <Link className="btn-secondary" href="/experience">
            <Exclaims />
            experience
          </Link>
        </div>
      </section>
      <BottomFade />
    </div>
  );
}
