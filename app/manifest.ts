import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Propiedades Sosa",
    short_name: "Propiedades Sosa",
    description: "Inmobiliaria en Baradero desde 2021. Compra, venta y alquiler de propiedades.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F5F0",
    theme_color: "#1C3557",
    icons: [
      {
        src: "/sosapropiedades.webp",
        sizes: "any",
        type: "image/webp",
      },
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
