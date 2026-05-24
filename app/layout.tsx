import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://propiedadessosa.com.ar";

const displayFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodyFont = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Propiedades Sosa | Inmobiliaria en Baradero",
    template: "%s | Propiedades Sosa",
  },
  description:
    "Inmobiliaria en Baradero desde 2021. Comprá, alquilá o tasá tu propiedad con asesoramiento profesional. Casas, departamentos, terrenos y locales.",
  keywords: [
    "inmobiliaria Baradero",
    "propiedades en venta Baradero",
    "alquiler Baradero",
    "casas en venta Baradero",
    "departamentos Baradero",
    "terrenos Baradero",
    "Propiedades Sosa",
    "tasaciones Baradero",
    "comprar propiedad Baradero",
    "martillero Baradero",
  ],
  authors: [{ name: "Propiedades Sosa", url: SITE_URL }],
  creator: "Propiedades Sosa",
  publisher: "Propiedades Sosa",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/sosapropiedades.webp",
    apple: "/sosapropiedades.webp",
  },
  openGraph: {
    title: "Propiedades Sosa | Inmobiliaria en Baradero",
    description:
      "Inmobiliaria en Baradero desde 2021. Comprá, alquilá o tasá tu propiedad con asesoramiento profesional.",
    url: SITE_URL,
    siteName: "Propiedades Sosa",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/sosapropiedades.webp",
        width: 1200,
        height: 630,
        alt: "Propiedades Sosa — Inmobiliaria en Baradero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propiedades Sosa | Inmobiliaria en Baradero",
    description:
      "Inmobiliaria en Baradero desde 2021. Comprá, alquilá o tasá tu propiedad.",
    images: ["/sosapropiedades.webp"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const umamiSrc =
    process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head />
      <body>
        {umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            data-domains={process.env.NEXT_PUBLIC_SITE_DOMAIN}
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
