import ScrollReveal from "@/components/ui/ScrollReveal";
import { getSectionImage } from "@/lib/placeholder-images";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiénes Somos — Inmobiliaria en Baradero desde 2021",
  description:
    "Conocé al equipo de Propiedades Sosa: Eduardo Sosa (Martillero Matriculado), Valeria Sosa y Marcos Pérez. Eficiencia, honestidad, ética y confidencialidad desde 2021.",
  alternates: { canonical: "https://propiedadessosa.com.ar/nosotros" },
  openGraph: {
    title: "Quiénes Somos | Propiedades Sosa",
    description:
      "Inmobiliaria arraigada en Baradero desde 2021. Eficiencia, honestidad, ética y confidencialidad en cada operación.",
    url: "https://propiedadessosa.com.ar/nosotros",
    type: "website",
  },
};

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Propiedades Sosa",
  url: "https://propiedadessosa.com.ar",
  logo: "https://propiedadessosa.com.ar/logo.png",
  telephone: "+54-9-3329-69-6105",
  email: "info@propiedadessosa.com.ar",
  foundingDate: "2021",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Baradero",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  employee: [
    {
      "@type": "Person",
      name: "Eduardo Sosa",
      jobTitle: "Titular — Martillero Matriculado",
    },
    {
      "@type": "Person",
      name: "Valeria Sosa",
      jobTitle: "Asesora Inmobiliaria",
    },
    {
      "@type": "Person",
      name: "Marcos Pérez",
      jobTitle: "Corredor Inmobiliario",
    },
  ],
  description:
    "Inmobiliaria arraigada en Baradero desde 2021. Eficiencia, honestidad, ética y confidencialidad en cada operación.",
};

const VALUES = [
  {
    title: "Eficiencia",
    desc: "Gestionamos cada operación con agilidad y precisión para que alcances tus objetivos en el menor tiempo posible.",
  },
  {
    title: "Honestidad",
    desc: "Información clara y veraz en cada etapa, sin letra chica ni promesas vacías.",
  },
  {
    title: "Ética",
    desc: "Actuamos con integridad y responsabilidad profesional en cada negociación.",
  },
  {
    title: "Confidencialidad",
    desc: "Respeto absoluto por la privacidad de nuestros clientes en todas las operaciones.",
  },
];

const TEAM = [
  {
    name: "Eduardo Sosa",
    role: "Titular · Martillero Matriculado",
    img: getSectionImage("profesional", 400, 400, 42),
  },
  {
    name: "Valeria Sosa",
    role: "Asesora Inmobiliaria",
    img: getSectionImage("profesional", 400, 400, 38),
  },
  {
    name: "Marcos Pérez",
    role: "Corredor Inmobiliario",
    img: getSectionImage("profesional", 400, 400, 29),
  },
];

export default function NosotrosPage() {
  const heroImg = getSectionImage("arquitectura moderna edificio", 1600, 900, 23);
  const officImg = getSectionImage("oficina moderna interior", 1200, 800, 31);

  return (
    <div className="min-h-screen bg-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
      />
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src={heroImg}
          alt="Propiedades Sosa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-brand-primary/70" />
        <div className="relative z-10 flex items-end h-full max-w-7xl mx-auto px-6 lg:px-10 pb-14">
          <div>
            <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
              Nuestra empresa
            </span>
            <h1
              className="font-display text-4xl md:text-6xl font-bold text-white mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nosotros
            </h1>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
              Nuestra historia
            </span>
            <h2
              className="font-display text-4xl font-bold text-brand-navy mt-3 mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sabemos lo que
              <br />
              necesitás
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Nos identificamos como una inmobiliaria arraigada en la ciudad de Baradero desde 2021. Desde nuestros inicios, nos hemos comprometido a guiar nuestra labor profesional mediante valores fundamentales como la eficiencia, la honestidad, la ética y el respeto absoluto por la confidencialidad en los negocios.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Nuestro principal propósito es brindar un servicio integral y asesoramiento completo, proporcionando a nuestros clientes todas las opciones disponibles para asegurar su plena satisfacción, cumpliendo con sus necesidades y requisitos en todo momento.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={officImg}
                alt="Nuestra oficina"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/30 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-brand-primary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
              Lo que nos define
            </span>
            <h2
              className="font-display text-4xl font-bold text-white mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nuestros valores
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="border border-white/10 rounded-2xl p-7 hover:bg-white/5 transition-colors">
                  <div className="w-8 h-1 bg-brand-accent rounded-full mb-5" />
                  <h3
                    className="font-display text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
              Equipo
            </span>
            <h2
              className="font-display text-4xl font-bold text-brand-navy mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quiénes somos
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.12} className="text-center">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                    unoptimized
                  />
                </div>
                <h3
                  className="font-display font-semibold text-brand-navy"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {member.name}
                </h3>
                <p className="text-neutral-500 text-sm mt-1">{member.role}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-neutral-100">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2
              className="font-display text-3xl font-bold text-brand-navy mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-neutral-600 mb-8">
              Contactanos hoy y recibí asesoramiento personalizado, sin compromisos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
              >
                Enviar consulta
              </Link>
              <a
                href="https://wa.me/5493329696105"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
