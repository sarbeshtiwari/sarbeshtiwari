import type { MetadataRoute } from "next";
import { site } from "./data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: "Sarbesh Tiwari",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#fffefd",
    theme_color: "#f25c3b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
