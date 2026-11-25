import { pageMetadata } from "../data/site";
import ContactClient from "./ContactClient";
import ContactActions from "../components/ContactActions";
import { profile } from "../data/portfolio";
import { Doodle } from "../components/Doodles";
import BottomFade from "../components/BottomFade";
export const metadata = pageMetadata("/contact");

export default function Contact() {
  return (
    <div className="sketch-page">
      <Doodle name="star" className="margin-doodle" style={{ top: 160, left: 48, width: 64, rotate: "-12deg" }} wobble="b" duration={6.3} />
      <Doodle name="squiggle" className="margin-doodle" style={{ top: 760, right: 40, width: 90, rotate: "8deg" }} wobble="d" duration={5.7} delay={0.5} />

      <header className="sketch-header">
        <p className="kicker">CONTACT · /05</p>
        <h1>
          write me a <span className="ink-mark">letter</span>. i <em>read</em> every one.
        </h1>
        <p>
          Hiring for an AI engineer or generative AI role, building something with LLMs, or just
          curious about a project? Drop a note and I&apos;ll get back to you.
        </p>
      </header>

      <div className="contact-desk">
        <aside className="postcard">
          <span className="stamp" aria-hidden="true">
            <span>IN</span>
            <Doodle name="bolt" className="stamp-doodle" />
            <span>₹5</span>
          </span>
          <span className="postmark" aria-hidden="true">
            INDIA
            <br />
            OR REMOTE
          </span>
          <p className="postcard-hi">rather skip the form?</p>
          <ContactActions />
          <ul className="postcard-links">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">github ↗</a>
            </li>
            <li>
              <a href={profile.resume} download>résumé ↓</a>
            </li>
          </ul>
          <p className="postcard-status">
            <span className="status-pulse" /> replying within a day or two
          </p>
        </aside>
        <ContactClient />
      </div>
      <BottomFade />
    </div>
  );
}
