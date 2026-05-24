import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId } from "@/lib/tenant";
import { TAGS } from "@/lib/cache-tags";
import CatalogClient from "./CatalogClient";
import { MOCK_PROPERTIES } from "@/lib/mock-properties";
import type { PropertyData } from "@/components/ui/PropertyCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades | Propiedades Sosa",
  description: "Explorá nuestro catálogo de casas, departamentos, terrenos y locales en venta y alquiler.",
};

const useRealData = Boolean(process.env.NEXT_PUBLIC_TENANT_ID);

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;

const getProducts = unstable_cache(
  async () => {
    try {
      const supabaseAdmin = createAdminClient();

      const { data, error } = await supabaseAdmin
        .from("products")
        .select(`
          id, name, slug, price, description, featured,
          product_images (id, url, alt, position)
        `)
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

function mapDbToPropertyData(p: Record<string, unknown>): PropertyData {
  const images = (p.product_images as Array<{ url: string; position: number }> | undefined)
    ?.sort((a, b) => a.position - b.position);
  const name = String(p.name ?? "Propiedad");
  const slug = String(p.slug ?? "");

  const nameLower = name.toLowerCase();
  let operation: string | undefined;
  if (nameLower.includes("alquiler") || nameLower.includes("arrend")) operation = "Alquiler";
  else if (nameLower.includes("venta") || nameLower.includes("subdiv")) operation = "Venta";

  const rawPrice = p.price as number | undefined;

  return {
    slug,
    name,
    description: p.description ? String(p.description) : undefined,
    price: rawPrice && rawPrice > 0 ? rawPrice : undefined,
    currency: "USD",
    operation,
    imageUrl: images?.[0]?.url ?? `https://loremflickr.com/800/600/house,architecture?lock=1`,
  };
}

export default async function CatalogPage() {
  let properties: PropertyData[];

  if (useRealData) {
    const dbProducts = await getProducts();
    properties = dbProducts.map(mapDbToPropertyData);
  } else {
    properties = MOCK_PROPERTIES;
  }

  return <CatalogClient properties={properties} />;
}
