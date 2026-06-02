"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Header({ whatsapp, onMenuOpenChange }: { whatsapp: string; onMenuOpenChange?: (open: boolean) => void }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    onMenuOpenChange?.(menuOpen);
  }, [menuOpen, onMenuOpenChange]);

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (top) window.scrollTo(0, -parseInt(top, 10));
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [menuOpen]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 1);
  });

  const transparent = isHome && !scrolled;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 border-b"
          animate={{
            backgroundColor: transparent ? "rgba(10,26,46,0)" : "rgba(10,26,46,0.97)",
            borderColor: transparent ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.4 }}
          style={{ backdropFilter: scrolled ? "blur(20px)" : "none" }}
        />

        <div className="relative max-w-7xl mx-auto px-12 lg:px-20 flex items-center justify-between h-[82px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="Sosa Propiedades"
              width={110}
              height={63}
              className="object-contain py-1"
              priority
            />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/" && pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 ${
                    active ? "text-brand-accent" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-0.5 left-0 h-px bg-brand-accent"
                    initial={{ width: active ? "100%" : "0%" }}
                    animate={{ width: active ? "100%" : "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <motion.a
              href={getWhatsAppUrl(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 border border-brand-accent/50 hover:border-brand-accent hover:bg-brand-accent transition-all duration-200"
              style={{ borderRadius: "3px" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Consultar
            </motion.a>

            {/* Hamburger — animated lines */}
            <button
              className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <motion.span
                className="block h-px bg-white origin-center"
                animate={{ width: menuOpen ? "100%" : "20px" }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block h-px bg-white"
                animate={{ width: "14px", x: 0, opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                style={{ marginLeft: "-6px" }}
              />
              <motion.span
                className="block h-px bg-white origin-center"
                animate={{ width: menuOpen ? "100%" : "20px" }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} whatsapp={whatsapp} />
    </>
  );
}
