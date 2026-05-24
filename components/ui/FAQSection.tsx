"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "¿Cómo es el proceso de compra de una propiedad?",
    a: "El proceso comienza con la búsqueda y selección de la propiedad. Luego se firma una reserva, seguida de un boleto de compraventa. Finalmente se lleva a cabo la escrituración ante escribano público. Nuestro equipo te acompaña en cada paso.",
  },
  {
    q: "¿Qué documentación necesito para alquilar?",
    a: "Para alquilar necesitás DNI vigente, recibos de sueldo o comprobante de ingresos de los últimos 3 meses, y un garante propietario con título de propiedad. También aceptamos seguro de caución como alternativa al garante.",
  },
  {
    q: "¿Cuáles son los gastos al comprar una propiedad?",
    a: "Al comprar una propiedad los gastos habituales incluyen: honorarios inmobiliarios (3–4% del precio), gastos de escrituración (3–5%), y sellado provincial. Te asesoramos con un presupuesto detallado para cada caso.",
  },
  {
    q: "¿Puedo tasar mi propiedad sin compromiso?",
    a: "Sí. Ofrecemos tasaciones gratuitas y sin compromiso. Un martillero matriculado visita tu propiedad y te entrega una valoración profesional basada en el mercado actual de la zona.",
  },
  {
    q: "¿Trabajan con propiedades fuera de la zona?",
    a: "Nos especializamos en la zona local y alrededores. Para propiedades fuera del radio habitual, contamos con una red de profesionales asociados a quienes podemos referirte.",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 px-6 bg-neutral-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-20">

        {/* Left: heading sticky */}
        <div className="lg:sticky lg:top-28 self-start">
          <span className="flex items-center gap-3 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="h-px w-8 bg-brand-accent" />
            FAQ
          </span>
          <h2
            className="font-display font-bold text-brand-navy leading-[1.1]"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
          >
            Preguntas
            <br />
            <em>frecuentes.</em>
          </h2>
          <p className="text-neutral-500 text-sm mt-5 leading-relaxed max-w-xs">
            ¿Tenés dudas? Encontrá respuestas a las consultas más comunes de nuestros clientes.
          </p>

          <a
            href="https://wa.me/5493329696105"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 text-brand-accent font-medium text-sm link-underline"
          >
            ¿Otra consulta? Escribinos
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Right: accordion */}
        <div className="divide-y divide-neutral-200">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-start gap-5 py-7 text-left group transition-colors cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span
                  className={`font-display text-xs font-bold flex-shrink-0 mt-1 w-6 transition-colors duration-300 ${open === i ? "text-brand-accent" : "text-neutral-300 group-hover:text-brand-accent/60"}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {toRoman(i + 1)}
                </span>
                <span
                  className={`flex-1 font-medium text-base transition-colors duration-300 ${open === i ? "text-brand-navy" : "text-neutral-700 group-hover:text-brand-navy"}`}
                >
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className={`flex-shrink-0 mt-1 transition-colors duration-300 ${open === i ? "text-brand-accent" : "text-neutral-300 group-hover:text-brand-accent/50"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pl-11 text-neutral-500 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
