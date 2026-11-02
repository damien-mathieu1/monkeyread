import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "monkeyread",
    short_name: "monkeyread",
    description: "A minimalistic, customizable speed reader. Works offline.",
    start_url: "/",
    display: "standalone",
    background_color: "#323437",
    theme_color: "#323437",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
