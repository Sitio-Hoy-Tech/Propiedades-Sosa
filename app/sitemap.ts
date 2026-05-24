import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const BASE_URL = "https://propiedadessosa.com.ar";
const NOW = new Date();

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: NOW, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE_URL}/catalogo`, lastModified: NOW, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE_URL}/nosotros`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/contacto`, lastModified: NOW, changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

  if (!tenantId) {
    const { MOCK_PROPERTIES } = await import("@/lib/mock-properties");
    return [
      ...STATIC_PAGES,
      ...MOCK_PROPERTIES.map((p) => ({
        url: `${BASE_URL}/producto/${p.slug}`,
        lastModified: NOW,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  }

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("tenant_id", tenantId)
      .eq("active", true);

    return [
      ...STATIC_PAGES,
      ...(data ?? []).map((p) => ({
        url: `${BASE_URL}/producto/${p.slug as string}`,
        lastModified: p.updated_at ? new Date(p.updated_at as string) : NOW,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return STATIC_PAGES;
  }
}
