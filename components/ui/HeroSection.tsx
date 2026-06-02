"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import AnimatedCounter from "./AnimatedCounter";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const HERO_IMG = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=85&auto=format&fit=crop";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LINE_WRAP: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const WORD: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.75, ease: EASE } },
};

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const STAGGER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

function WordLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="block overflow-hidden" aria-hidden>
      <motion.span
        className="flex flex-wrap gap-x-[0.25em] gap-y-0"
        variants={LINE_WRAP}
        custom={delay}
      >
        {words.map((w, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              variants={WORD}
              transition={{ delay: delay + i * 0.06, duration: 0.75, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export default function HeroSection({ whatsapp }: { whatsapp: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.55, 0.8]);
  const contentYLaptop = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const contentYDesktop = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh md:h-dvh min-h-[640px] flex items-start md:items-center grain-overlay bg-brand-dark"
      aria-label="Inicio Propiedades Sosa"
    >
      <div className="absolute inset-0 overflow-hidden">
      {!isDesktop ? (
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Propiedad destacada"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        </div>
      ) : (
        <motion.div
          className="absolute"
          style={{
            y: imageY,
            top: "-15%",
            bottom: "-15%",
            left: 0,
            right: 0,
          }}
        >
          <Image
            src={HERO_IMG}
            alt="Propiedad destacada"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        </motion.div>
      )}
      </div>

      {!isDesktop ? (
        <div className="absolute inset-0 bg-brand-dark/60" />
      ) : (
        <motion.div
          className="absolute inset-0 bg-brand-dark"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-10 md:pb-16 md:pt-20 lg:pt-24 lg:pb-20"
        style={{ y: isDesktop ? (isLargeDesktop ? contentYDesktop : contentYLaptop) : 0 }}
      >
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Headline */}
          <motion.h1
            variants={STAGGER}
            initial="hidden"
            animate="visible"
            className="font-display font-bold text-white mt-3 md:mt-8 mb-4 md:mb-6 xl:mb-8 leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: !isDesktop
                ? "clamp(2.5rem, 8vw, 3.5rem)"
                : isLargeDesktop
                ? "clamp(2.25rem, 7vw, 5.5rem)"
                : "clamp(2rem, 5vw, 3.25rem)",
            }}
            aria-label="Encontrá tu propiedad ideal"
          >
            <WordLine text="Encontrá tu" delay={0.1} />
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block italic text-brand-accent"
                variants={WORD}
                style={{
                  fontSize: !isDesktop
                    ? "clamp(3rem, 10vw, 4rem)"
                    : isLargeDesktop
                    ? "clamp(2.75rem, 8vw, 6.5rem)"
                    : "clamp(2.5rem, 6vw, 4rem)",
                  transition: "0s",
                }}
                transition={{ delay: 0.4, duration: 0.85, ease: EASE }}
              >
                propiedad ideal.
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={FADE_UP}
            className="text-white/65 text-sm sm:text-base md:text-lg leading-relaxed mb-4 md:mb-6 xl:mb-10 max-w-xl"
          >
            Casas, departamentos, terrenos y locales comerciales en la mejor zona.
            Asesoramiento personalizado en cada etapa de tu inversión.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 md:mb-8 xl:mb-16">
            <Link
              href="/catalogo"
              className="group inline-flex items-center justify-center gap-3 bg-brand-accent text-white font-semibold px-8 py-3 sm:py-4 transition-all duration-300 hover:bg-brand-accent/90 hover:gap-4 hover:-translate-y-0.5 shadow-lg shadow-brand-accent/25"
              style={{ borderRadius: "4px" }}
            >
              Ver propiedades
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href={getWhatsAppUrl(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-white/25 text-white font-medium px-8 py-3 sm:py-4 transition-all duration-300 hover:border-white/50 hover:bg-white/5"
              style={{ borderRadius: "4px" }}
            >
              Consultar por WhatsApp
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={FADE_UP}
            className="flex items-center flex-wrap gap-6 md:gap-8 xl:gap-10 pt-4 md:pt-5 xl:pt-8 border-t border-white/10"
          >
            {[
              { to: 100, suffix: "+", label: "Propiedades gestionadas" },
              { to: 4, suffix: " años", label: "En Baradero" },
              { to: 98, suffix: "%", label: "Clientes satisfechos" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-display text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <AnimatedCounter to={stat.to} suffix={stat.suffix} />
                </p>
                <p className="text-white/45 text-xs mt-1 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden md:flex absolute bottom-8 right-10 z-10 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span
          className="text-white/30 text-[10px] tracking-[0.25em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px bg-white/20"
          animate={{ height: [16, 48, 16] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
