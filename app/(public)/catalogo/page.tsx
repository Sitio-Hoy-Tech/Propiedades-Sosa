import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { TAGS } from "@/lib/cache-tags";
import { PRODUCT_SELECT, mapDbProductToPropertyData } from "@/lib/products";
import CatalogClient from "./CatalogClient";
import { MOCK_PROPERTIES } from "@/lib/mock-properties";
import type { PropertyData } from "@/components/ui/PropertyCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades en Venta y Alquiler en Baradero",
  description:
    "Explorá el catálogo completo de Propiedades Sosa: casas, departamentos, terrenos y locales en venta y alquiler en Baradero y zona.",
  alternates: { canonical: "https://propiedadessosa.com.ar/catalogo" },
  openGraph: {
    title: "Propiedades en Venta y Alquiler en Baradero | Propiedades Sosa",
    description:
      "Casas, departamentos, terrenos y locales en venta y alquiler en Baradero. Consultá con nuestros asesores.",
    url: "https://propiedadessosa.com.ar/catalogo",
    type: "website",
  },
};

const useRealData = Boolean(process.env.NEXT_PUBLIC_TENANT_ID);
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;

const getProducts = unstable_cache(
  async () => {
    try {
      const supabaseAdmin = createAdminClient();
      const { data, error } = await supabaseAdmin
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("tenant_id", tenantId)
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("position", { ascending: true })
        .limit(50);

      if (error) console.error("[catalog] products error:", error.message);
      return data ?? [];
    } catch (e) {
      console.error("[catalog] products exception:", e);
      return [];
    }
  },
  [`catalog-products-${tenantId}`],
  { tags: [TAGS.PRODUCTS] }
);

export default async function CatalogPage() {
  let properties: PropertyData[];

  if (useRealData) {
    const dbProducts = await getProducts();
    properties = (dbProducts as unknown[]).map((p) =>
      mapDbProductToPropertyData(p as Record<string, unknown>, { withBadge: true })
    );
  } else {
    properties = MOCK_PROPERTIES;
  }

  return <CatalogClient properties={properties} />;
}
