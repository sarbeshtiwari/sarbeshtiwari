import type { Metadata } from "next";

export const site = {
  url: "https://sarbeshtiwari.vercel.app",
  name: "Sarbesh Kumar Tiwari",
  title: "Sarbesh Kumar Tiwari | AI Engineer, Generative AI & LLM Apps",
  description:
    "Sarbesh Kumar Tiwari is an AI engineer building generative AI products: LLM agents, voice interfaces and the full stack around them. Explore his projects, experience and skills.",
};

export const publicPages = [
  { path: "/", title: site.title, description: site.description },
  {
    path: "/about",
    title: "About & Skills",
    description:
      "Meet Sarbesh Kumar Tiwari, an AI engineer in Gurugram with a B.Tech in Data Science & AI who builds LLM-powered products end to end.",
  },
  {
    path: "/projects",
    title: "Projects | AI, Web & Mobile",
    description:
      "Explore Sarbesh Kumar Tiwari’s projects: Reachout, AdPilot, VoicePilot, Ziptat, AI gaming, computer vision, e-commerce, real estate platforms, and Flutter mobile applications.",
  },
  {
    path: "/experience",
    title: "Engineering Experience",
    description:
      "Explore Sarbesh Kumar Tiwari’s engineering work at Quess Corp (for Ethara.ai), Ecorp Infosystems, Aayan India, and iWashhub, plus his Data Science & AI education.",
  },
  {
    path: "/certifications",
    title: "Certifications & Achievements",
    description:
      "View Sarbesh Kumar Tiwari’s 14 credentials, including IBM machine learning, Python, SQL, Flutter, and Smart India Hackathon, with certificate scans and badges.",
  },
  {
    path: "/contact",
    title: "Contact & Collaboration",
    description:
      "Contact Sarbesh Kumar Tiwari about AI engineer and generative AI roles, LLM application projects and collaborations. Based in Gurugram, open to roles anywhere in India or remote.",
  },
];

export function pageMetadata(path: string): Metadata {
  const page = publicPages.find((entry) => entry.path === path);
  if (!page) throw new Error(`Missing page metadata: ${path}`);
  const title = path === "/" ? site.title : `${page.title} | ${site.name}`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: new URL(path, site.url).href },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      url: new URL(path, site.url).href,
      title,
      description: page.description,
      images: [
        {
          url: `${site.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: site.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: [`${site.url}/opengraph-image`],
    },
  };
}
