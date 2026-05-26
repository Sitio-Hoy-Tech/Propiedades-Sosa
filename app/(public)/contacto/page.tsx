import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "./ContactForm";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { getTenantConfig } from "@/lib/tenant";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a Propiedades Sosa. Respondemos en menos de 24 horas. También podés escribirnos por WhatsApp al +54 9 3329 69-6105.",
  alternates: { canonical: "https://propiedadessosa.com.ar/contacto" },
  openGraph: {
    title: "Contacto | Propiedades Sosa",
    description:
      "Escribinos y te asesoramos sin compromiso. Respondemos en menos de 24 horas.",
    url: "https://propiedadessosa.com.ar/contacto",
    type: "website",
  },
};

const CONTACT_PAGE_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto — Propiedades Sosa",
  url: "https://propiedadessosa.com.ar/contacto",
  description: "Formulario de contacto de Propiedades Sosa. Respondemos en menos de 24 horas.",
  mainEntity: {
    "@type": "RealEstateAgent",
    name: "Propiedades Sosa",
    telephone: "+54-9-3329-69-6105",
    email: "info@propiedadessosa.com.ar",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  },
};

export default async function ContactPage() {
  const tenant = await getTenantConfig();
  const whatsapp = tenant.whatsapp ?? "";
  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_PAGE_LD) }}
      />

      {/* Hero strip */}
      <div className="bg-brand-primary py-10 px-4 sm:px-6 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
            Contacto
          </span>
          <h1
            className="font-display text-4xl md:text-5xl font-bold text-white mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Hablemos
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
        {/* Form */}
        <ScrollReveal direction="left">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 sm:p-8">
            <h2
              className="font-display text-2xl font-bold text-brand-navy mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Envianos tu consulta
            </h2>
            <p className="text-neutral-500 text-sm mb-8">
              Completá el formulario y te respondemos en menos de 24 horas.
            </p>
            <ContactForm />
          </div>
        </ScrollReveal>

        {/* Contact info */}
        <ScrollReveal direction="right" className="flex flex-col gap-6">
          <div className="bg-brand-primary rounded-2xl p-8 text-white">
            <h3
              className="font-display text-xl font-bold mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Información de contacto
            </h3>

            <div className="flex flex-col gap-5">
              <a
                href={getWhatsAppUrl(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-brand-accent group-hover:fill-white transition-colors">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-0.5">WhatsApp</p>
                  <p className="text-white font-medium">+54 9 3329 69-6105</p>
                </div>
              </a>

              <a
                href="mailto:info@propiedadessosa.com.ar"
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent transition-colors">
                  <svg className="w-5 h-5 text-brand-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-0.5">Email</p>
                  <p className="text-white font-medium break-all">info@propiedadessosa.com.ar</p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-0.5">Horario de atención</p>
                  <p className="text-white font-medium">Lunes a Viernes</p>
                  <p className="text-white/70 text-sm">9:00 a 18:00 hs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
            <p className="text-neutral-500 text-sm leading-relaxed">
              También podés visitarnos en nuestra oficina. ¡Te esperamos para charlar sin compromisos sobre tu próxima propiedad!
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
