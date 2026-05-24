"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface PropertyData {
  slug: string;
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  operation?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  imageUrl: string;
  badge?: string;
}

interface PropertyCardProps {
  property: PropertyData;
  index?: number;
  tall?: boolean;
}

const CURRENCY_SYMBOL: Record<string, string> = {
  ARS: "$",
  USD: "U$S",
  usd: "U$S",
  ars: "$",
};

function formatPrice(price: number, currency = "USD"): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? currency;
  if (price >= 1_000_000) return `${symbol} ${(price / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (price >= 1_000) return `${symbol} ${Math.round(price / 1000)}K`;
  return `${symbol} ${price.toLocaleString("es-AR")}`;
}

const SPEC_ICONS = {
  bed: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
    </svg>
  ),
  bath: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a6 6 0 0112 0v1H6v-1z" />
    </svg>
  ),
  area: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  ),
};

export default function PropertyCard({ property, index = 0, tall = false }: PropertyCardProps) {
  const [hovered, setHovered] = useState(false);
  const hasSpecs = property.bedrooms != null || property.bathrooms != null || property.area != null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 25 } }}
      style={{ willChange: "transform" }}
      className="group"
    >
      <Link href={`/producto/${property.slug}`} className="block relative overflow-hidden" style={{ borderRadius: "4px" }}>
        {/* Image */}
        <div
          className={`relative overflow-hidden ${
            tall
              ? "h-[260px] sm:h-[380px] lg:h-[520px]"
              : "h-[220px] sm:h-[280px] lg:h-[380px]"
          }`}
        >
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 ease-out"
            style={{ transform: hovered ? "scale(1.07)" : "scale(1.0)" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            unoptimized
          />

          {/* Permanent gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />

          {/* Badges */}
          {property.badge && (
            <span
              className="absolute top-4 left-4 bg-brand-accent text-white text-xs font-semibold px-3 py-1 tracking-wider uppercase"
              style={{ borderRadius: "2px" }}
            >
              {property.badge}
            </span>
          )}
          {property.operation && (
            <span className="absolute top-4 right-4 text-white/80 text-xs tracking-[0.15em] uppercase border border-white/20 px-2.5 py-1 backdrop-blur-sm" style={{ borderRadius: "2px" }}>
              {property.operation}
            </span>
          )}

          {/* Static bottom info (always visible) */}
          <div className="absolute inset-x-0 bottom-0 p-5 z-10">
            <h3
              className="font-display font-bold text-white text-xl leading-tight line-clamp-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {property.name}
            </h3>
            <p className="text-brand-accent font-semibold text-base mt-1">
              {property.price
                ? formatPrice(property.price, property.currency ?? "USD")
                : "Consultar precio"}
            </p>
          </div>

          {/* Hover reveal panel */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-x-0 bottom-0 z-20 bg-brand-dark/96 backdrop-blur-md p-5"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
              >
                {property.operation && (
                  <span className="text-brand-accent text-xs tracking-[0.2em] uppercase font-medium block mb-2">
                    {property.operation}
                  </span>
                )}
                <h3
                  className="font-display font-bold text-white text-lg leading-tight mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {property.name}
                </h3>

                {property.description && (
                  <p className="text-white/55 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {property.description}
                  </p>
                )}

                {hasSpecs && (
                  <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                    {property.bedrooms != null && (
                      <span className="flex items-center gap-1.5">
                        {SPEC_ICONS.bed} {property.bedrooms} amb.
                      </span>
                    )}
                    {property.bathrooms != null && (
                      <span className="flex items-center gap-1.5">
                        {SPEC_ICONS.bath} {property.bathrooms} baño{property.bathrooms !== 1 ? "s" : ""}
                      </span>
                    )}
                    {property.area != null && (
                      <span className="flex items-center gap-1.5">
                        {SPEC_ICONS.area} {property.area} m²
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p
                    className="font-display font-bold text-brand-accent text-xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {property.price
                      ? formatPrice(property.price, property.currency ?? "USD")
                      : "Consultar precio"}
                  </p>
                  <span className="flex items-center gap-1.5 text-white/40 text-xs tracking-wider uppercase">
                    Ver más
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gold sweep line at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-brand-accent z-30"
            animate={{ width: hovered ? "100%" : "0%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Link>
    </motion.article>
  );
}
