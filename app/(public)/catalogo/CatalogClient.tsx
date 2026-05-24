"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import PropertyCard, { type PropertyData } from "@/components/ui/PropertyCard";

const TABS = ["Todos", "Venta", "Alquiler"];

interface CatalogClientProps {
  properties: PropertyData[];
}

export default function CatalogClient({ properties }: CatalogClientProps) {
  const [activeTab, setActiveTab] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = properties;

    if (activeTab !== "Todos") {
      list = list.filter((p) => p.operation === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [properties, activeTab, search]);

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
            Catálogo
          </span>
          <h1
            className="font-display text-4xl md:text-5xl font-bold text-brand-navy mt-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nuestras propiedades
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <div className="flex bg-white border border-neutral-200 rounded-xl p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-brand-primary rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar propiedad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"
            />
          </div>

          <span className="text-neutral-400 text-sm ml-auto">
            {filtered.length} {filtered.length === 1 ? "propiedad" : "propiedades"}
          </span>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeTab + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((prop, i) => (
                <PropertyCard key={prop.slug} property={prop} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">No hay propiedades en esta categoría.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
