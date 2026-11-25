import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Caveat, Fraunces, IBM_Plex_Serif, Karla } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransitions from "./components/PageFlip";
import BlobCursor from "./components/BlobCursor";
import { DoodleDefs } from "./components/Doodles";
import "./globals.css";
import { site } from "./data/site";
const inter = localFont({
  src: "../public/fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});
const jetbrains = localFont({
  src: "../public/fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains",
  weight: "400 500",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});
const plex = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-plex",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
const karla = Karla({ subsets: ["latin"], variable: "--font-karla", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
// Runs before paint so a saved dark theme never flashes light.
// Also marks the page as covered so entrance animations wait for the intro.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("page-covered")`;
const { title, description } = site;
export const viewport: Viewport = {
  themeColor: "#fffefd",
  colorScheme: "light dark",
};
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Sarbesh Kumar Tiwari" },
  description,
  keywords: [
    "Sarbesh Kumar Tiwari",
    "AI Engineer",
    "Generative AI Engineer",
    "LLM Applications",
    "AI Agents",
    "Claude API",
    "Gemini API",
    "Python",
    "TensorFlow",
    "React",
    "Next.js",
    "Node.js",
    "Flutter",
    "AWS",
  ],
  authors: [{ name: "Sarbesh Kumar Tiwari" }],
  creator: "Sarbesh Kumar Tiwari",
  publisher: site.name,
  applicationName: "Sarbesh Tiwari Portfolio",
  category: "technology",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sarbesh Kumar Tiwari",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    icon: [{ url: "/favicon.svg?v=3", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.ico?v=3",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: { google: "EML1vh2mWaTVeo-4ltN28peNm262eeyjqmNjxJURu_U" },
};
const person = {
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: "Sarbesh Kumar Tiwari",
  url: site.url,
  jobTitle: "AI Engineer",
  description,
  sameAs: [
    "https://github.com/sarbeshtiwari",
    "https://www.linkedin.com/in/sarbeshtiwari",
  ],
  knowsAbout: [
    "Generative AI",
    "Large language models",
    "AI agents",
    "Speech recognition",
    "Machine learning",
    "Computer vision",
    "Full-stack development",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gurugram",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Shri Ramswaroop Memorial University",
  },
};
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    person,
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en-IN",
      author: { "@id": `${site.url}/#person` },
    },
  ],
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} ${fraunces.variable} ${plex.variable} ${karla.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <DoodleDefs />
        <div id="top" />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <PageTransitions />
        <BlobCursor />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
