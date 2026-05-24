"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const INPUT_CLASS =
  "w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      {/* Hero strip */}
      <div className="bg-brand-primary py-16 px-6">
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

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        {/* Form */}
        <ScrollReveal direction="left">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
            <h2
              className="font-display text-2xl font-bold text-brand-navy mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Envianos tu consulta
            </h2>
            <p className="text-neutral-500 text-sm mb-8">
              Completá el formulario y te respondemos en menos de 24 horas.
            </p>

            {status === "ok" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-brand-navy mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  ¡Mensaje enviado!
                </h3>
                <p className="text-neutral-500 text-sm">Te respondemos a la brevedad. También podés escribirnos por WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Nombre *
                    </label>
                    <input id="name" name="name" placeholder="Tu nombre completo" required className={INPUT_CLASS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      Email *
                    </label>
                    <input id="email" name="email" type="email" placeholder="tu@email.com" required className={INPUT_CLASS} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Teléfono
                  </label>
                  <input id="phone" name="phone" placeholder="+54 9 11 1234 5678" className={INPUT_CLASS} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="¿En qué podemos ayudarte? Indicanos el tipo de propiedad, zona y presupuesto si querés."
                    required
                    rows={5}
                    className={INPUT_CLASS + " resize-none"}
                  />
                </div>

                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    Hubo un error al enviar. Por favor, escribinos directamente por WhatsApp.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-60 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-accent/20 cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Enviar consulta"
                  )}
                </button>
              </form>
            )}
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
                href="https://wa.me/5493329696105"
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
                  <p className="text-white font-medium">info@propiedadessosa.com.ar</p>
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
