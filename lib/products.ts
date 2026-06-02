import type { PropertyData } from "@/components/ui/PropertyCard";

export const PRODUCT_SELECT =
  "id, name, slug, price, description, featured, " +
  "categories (name, slug), " +
  "product_images (id, url, alt, position), " +
  "product_attributes (id, name, position, product_attribute_values (id, value, position))";

export interface Feature {
  type: "bed" | "bath" | "area" | "lot" | "pool" | "floor" | "garage" | "location" | "generic";
  label: string;
  value: string;
}

type AttrRow = {
  name: string;
  position: number;
  product_attribute_values: Array<{ value: string; position: number }>;
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function extractFeaturesFromAttributes(attrs: AttrRow[]): Feature[] {
  const features: Feature[] = [];

  for (const attr of [...attrs].sort((a, b) => a.position - b.position)) {
    const key = normalize(attr.name);
    const vals = [...attr.product_attribute_values]
      .sort((a, b) => a.position - b.position)
      .map((v) => v.value)
      .filter(Boolean);
    const first = vals[0];
    if (!first) continue;

    if (/^(dormitorios?|domitorios?|ambientes?)$/.test(key)) {
      features.push({ type: "bed", label: "Dormitorios", value: first });
    } else if (/^banos?$/.test(key)) {
      features.push({ type: "bath", label: "Baños", value: first });
    } else if (/^(superficie|area|metros?)$/.test(key)) {
      features.push({ type: "area", label: "Superficie", value: first.includes("m") ? first : `${first} m²` });
    } else if (/^(lote|terreno)$/.test(key)) {
      features.push({ type: "lot", label: "Lote", value: first.includes("m") ? first : `${first} m²` });
    } else if (/^pileta$/.test(key)) {
      features.push({ type: "pool", label: "Pileta", value: first });
    } else if (/^piso$/.test(key)) {
      features.push({ type: "floor", label: "Piso", value: first });
    } else if (/^(garages?|cocheras?)$/.test(key)) {
      features.push({ type: "garage", label: "Garage", value: first });
    } else if (/^ubicacion$/.test(key)) {
      features.push({ type: "location", label: "Ubicación", value: vals.join(", ") });
    } else {
      features.push({ type: "generic", label: attr.name, value: vals.join(", ") });
    }
  }

  return features;
}

export function getCategoryOperation(categoryName?: string | null): string | undefined {
  if (!categoryName) return undefined;
  const n = normalize(categoryName);
  if (n.includes("alquiler")) return "Alquiler";
  if (n.includes("venta")) return "Venta";
  return categoryName;
}

export function mapDbProductToPropertyData(
  p: Record<string, unknown>,
  options?: { withBadge?: boolean }
): PropertyData {
  const images = (p.product_images as Array<{ url: string; position: number }> | undefined)
    ?.sort((a, b) => a.position - b.position);

  const category = p.categories as { name: string } | null | undefined;
  const attrs = p.product_attributes as AttrRow[] | undefined;
  const features = attrs ? extractFeaturesFromAttributes(attrs) : [];

  const bed = features.find((f) => f.type === "bed");
  const bath = features.find((f) => f.type === "bath");
  const area = features.find((f) => f.type === "area");

  const rawPrice = p.price as number | undefined;

  return {
    slug: String(p.slug ?? ""),
    name: String(p.name ?? "Propiedad"),
    description: p.description ? String(p.description) : undefined,
    price: rawPrice && rawPrice > 0 ? rawPrice : undefined,
    currency: "USD",
    operation: getCategoryOperation(category?.name),
    bedrooms: bed ? parseInt(bed.value, 10) || undefined : undefined,
    bathrooms: bath ? parseInt(bath.value, 10) || undefined : undefined,
    area: area ? parseFloat(area.value) || undefined : undefined,
    imageUrl: images?.[0]?.url ?? "https://loremflickr.com/800/600/house,architecture?lock=1",
    badge: options?.withBadge && (p.featured as boolean) ? "Destacada" : undefined,
  };
}
