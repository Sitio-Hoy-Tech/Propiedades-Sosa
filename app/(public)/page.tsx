import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { TAGS } from "@/lib/cache-tags";
import HeroSection from "@/components/ui/HeroSection";
import FAQSection from "@/components/ui/FAQSection";
import PropertyCard, { type PropertyData } from "@/components/ui/PropertyCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { getSectionImage } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades Sosa | Inmobiliaria en Baradero",
  description:
    "Inmobiliaria en Baradero desde 2021. Comprá, alquilá o tasá tu propiedad con asesoramiento profesional. Casas, departamentos, terrenos y locales.",
  alternates: { canonical: "https://propiedadessosa.com.ar" },
};

const SERVICES = [
  {
    num: "01",
    title: "Compra & Venta",
    desc: "Gestionamos cada etapa del proceso con asesoramiento legal y financiero incluido. Seguridad y transparencia en cada operación.",
  },
  {
    num: "02",
    title: "Alquiler",
    desc: "Administración profesional de alquileres. Seleccionamos al inquilino ideal y te acompañamos durante toda la relación contractual.",
  },
  {
    num: "03",
    title: "Tasaciones",
    desc: "Valuación profesional con análisis actualizado del mercado. Servicio gratuito y sin compromisos para que tomes la mejor decisión.",
  },
  {
    num: "04",
    title: "Asesoramiento",
    desc: "Consultoría integral en inversión inmobiliaria. Desde la búsqueda hasta la escrituración, te guiamos en cada decisión.",
  },
];

const getFeaturedProperties = unstable_cache(
  async (): Promise<PropertyData[]> => {
    try {
      const tenantId = getTenantId();
      const supabase = createAdminClient();

      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, description, featured, product_images (url, alt, position)")
        .eq("tenant_id", tenantId)
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("position", { ascending: true })
        .limit(6);

      if (!data?.length) return [];

      return data.map((p) => {
        const imgs = (p.product_images as Array<{ url: string; position: number }> | undefined)
          ?.sort((a, b) => a.position - b.position);
        const nameLower = (p.name as string).toLowerCase();
        let operation: string | undefined;
        if (nameLower.includes("alquiler")) operation = "Alquiler";
        else if (nameLower.includes("venta")) operation = "Venta";

        return {
          slug: p.slug as string,
          name: p.name as string,
          description: p.description ? String(p.description) : undefined,
          price: (p.price as number) > 0 ? (p.price as number) : undefined,
          currency: "USD",
          operation,
          imageUrl: imgs?.[0]?.url ?? "https://loremflickr.com/800/600/house",
          badge: p.featured ? "Destacada" : undefined,
        };
      });
    } catch {
      return [];
    }
  },
  [`home-featured-${process.env.NEXT_PUBLIC_TENANT_ID}`],
  { tags: [TAGS.PRODUCTS] }
);

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Propiedades Sosa",
  url: "https://propiedadessosa.com.ar",
  logo: "https://propiedadessosa.com.ar/logo.png",
  image: "https://propiedadessosa.com.ar/sosapropiedades.webp",
  telephone: "+54-9-3329-69-6105",
  email: "info@propiedadessosa.com.ar",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Baradero",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  description:
    "Inmobiliaria en Baradero desde 2021. Compra, venta, alquiler y tasaciones de propiedades.",
  areaServed: { "@type": "City", name: "Baradero" },
  priceRange: "$$",
  knowsAbout: ["compraventa inmobiliaria", "alquiler", "tasaciones", "asesoramiento inmobiliario"],
  foundingDate: "2021",
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo es el proceso de compra de una propiedad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El proceso comienza con la búsqueda y selección de la propiedad. Luego se firma una reserva, seguida de un boleto de compraventa. Finalmente se lleva a cabo la escrituración ante escribano público. Nuestro equipo te acompaña en cada paso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué documentación necesito para alquilar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para alquilar necesitás DNI vigente, recibos de sueldo o comprobante de ingresos de los últimos 3 meses, y un garante propietario con título de propiedad. También aceptamos seguro de caución como alternativa al garante.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los gastos al comprar una propiedad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Al comprar una propiedad los gastos habituales incluyen: honorarios inmobiliarios (3–4% del precio), gastos de escrituración (3–5%), y sellado provincial. Te asesoramos con un presupuesto detallado para cada caso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo tasar mi propiedad sin compromiso?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Ofrecemos tasaciones gratuitas y sin compromiso. Un martillero matriculado visita tu propiedad y te entrega una valoración profesional basada en el mercado actual de la zona.",
      },
    },
    {
      "@type": "Question",
      name: "¿Trabajan con propiedades fuera de la zona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nos especializamos en la zona local y alrededores. Para propiedades fuera del radio habitual, contamos con una red de profesionales asociados a quienes podemos referirte.",
      },
    },
  ],
};

export default async function HomePage() {
  const nosotrosImg = getSectionImage("arquitectura moderna exterior", 1400, 900, 19);
  const properties = await getFeaturedProperties();

  const largeProp = properties[0];
  const smallProps = properties.slice(1, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <HeroSection />

      {/* ── Featured Properties (Editorial Bento) ── */}
      <section className="py-28 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="flex items-center gap-3 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                <span className="h-px w-8 bg-brand-accent" />
                Propiedades destacadas
              </span>
              <h2
                className="font-display font-bold text-brand-navy leading-[1.1]"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
              >
                Oportunidades
                <br />
                <em>del mes.</em>
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="link-underline text-brand-navy/60 hover:text-brand-navy text-sm font-medium tracking-wide transition-colors flex-shrink-0 flex items-center gap-2"
            >
              Ver catálogo completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </ScrollReveal>

          {/* Bento grid: 1 large + 2 stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
            {largeProp && (
              <ScrollReveal direction="left">
                <PropertyCard property={largeProp} index={0} tall />
              </ScrollReveal>
            )}

            <div className="flex flex-col gap-4">
              {smallProps.map((prop, i) => (
                <ScrollReveal key={prop.slug} direction="right" delay={i * 0.12}>
                  <PropertyCard property={prop} index={i + 1} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Animated Numbers Band ── */}
      <section className="py-24 px-6 bg-brand-dark overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-4">
            {[
              { to: 4, suffix: " años", label: "De trayectoria", desc: "en el mercado de Baradero" },
              { to: 100, suffix: "+", label: "Propiedades gestionadas", desc: "en ventas y alquileres" },
              { to: 98, suffix: "%", label: "Clientes satisfechos", desc: "recomiendan nuestro servicio" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.15} direction="up">
                <div className="text-center sm:text-left border-t border-white/10 pt-8">
                  <p
                    className="font-display font-bold text-white leading-none mb-2"
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 6vw, 5rem)" }}
                  >
                    <AnimatedCounter to={stat.to} suffix={stat.suffix} />
                  </p>
                  <p className="text-brand-accent font-semibold text-sm tracking-wide uppercase">{stat.label}</p>
                  <p className="text-white/35 text-xs mt-1">{stat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services — numbered list ── */}
      <section className="py-28 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
          <ScrollReveal direction="left" className="lg:sticky lg:top-28">
            <span className="flex items-center gap-3 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              <span className="h-px w-8 bg-brand-accent" />
              Servicios
            </span>
            <h2
              className="font-display font-bold text-brand-navy leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              Todo lo que
              <br />
              <em>necesitás.</em>
            </h2>
            <p className="text-neutral-500 mt-6 leading-relaxed text-sm max-w-xs">
              Un equipo completo de profesionales para que cada decisión inmobiliaria sea la correcta.
            </p>
          </ScrollReveal>

          <div className="divide-y divide-neutral-200">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 0.08} direction="right">
                <div className="group py-7 flex gap-6 items-start cursor-default hover:bg-white hover:-mx-6 hover:px-6 transition-all duration-300">
                  <span
                    className="font-display text-neutral-200 group-hover:text-brand-accent transition-colors duration-300 text-sm font-bold flex-shrink-0 mt-0.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.num}
                  </span>
                  <div>
                    <h3
                      className="font-display font-semibold text-brand-navy text-lg mb-2 group-hover:text-brand-dark transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-200 group-hover:text-brand-accent transition-all duration-300 flex-shrink-0 mt-1 ml-auto group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nosotros teaser ── */}
      <section className="overflow-hidden bg-brand-primary">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          <ScrollReveal direction="left" className="relative min-h-[360px] lg:min-h-0">
            <Image
              src={nosotrosImg}
              alt="Propiedades Sosa — equipo"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-brand-dark/20" />
            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm px-6 py-5 shadow-xl" style={{ borderRadius: "4px" }}>
              <p className="font-display text-3xl font-bold text-brand-navy" style={{ fontFamily: "var(--font-display)" }}>
                2021
              </p>
              <p className="text-neutral-500 text-xs mt-0.5 tracking-wide">en Baradero</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16">
            <span className="flex items-center gap-3 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <span className="h-px w-8 bg-brand-accent" />
              Sobre nosotros
            </span>
            <h2
              className="font-display font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              Sabemos lo que
              <br />
              <em>necesitás.</em>
            </h2>
            <p className="text-white/65 leading-relaxed mb-3 text-sm">
              Somos una inmobiliaria arraigada en Baradero desde 2021. Nos guiamos por la eficiencia, la honestidad, la ética y el respeto absoluto por la confidencialidad.
            </p>
            <p className="text-white/65 leading-relaxed mb-10 text-sm">
              Nuestro propósito es brindarte un servicio integral con todas las opciones disponibles para asegurar tu plena satisfacción.
            </p>
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-3 text-white font-medium text-sm group w-fit"
            >
              <span className="link-underline">Conocé nuestro equipo</span>
              <svg
                className="w-4 h-4 text-brand-accent transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
