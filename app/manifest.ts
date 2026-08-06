import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const name = process.env.NEXT_PUBLIC_APP_NAME ?? "LowPOS";

  return {
    name,
    short_name: name,
    description:
      process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
      "Aplicación monolítica con acceso offline controlado",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
