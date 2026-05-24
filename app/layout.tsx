import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  title: "Propiedades Sosa | Inmobiliaria",
  description:
    "Encontrá tu próxima propiedad con Propiedades Sosa. Casas, departamentos, terrenos y locales en venta y alquiler.",
  icons: { icon: "/sosapropiedades.webp", apple: "/sosapropiedades.webp" },
  openGraph: {
    title: "Propiedades Sosa | Inmobiliaria",
    description:
      "Encontrá tu próxima propiedad con Propiedades Sosa. Casas, departamentos, terrenos y locales en venta y alquiler.",
    locale: "es_AR",
    type: "website",
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
