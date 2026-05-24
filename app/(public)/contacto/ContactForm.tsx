"use client";

import { useState } from "react";

const INPUT_CLASS =
  "w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors";

export default function ContactForm() {
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

  if (status === "ok") {
    return (
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
    );
  }

  return (
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
  );
}
