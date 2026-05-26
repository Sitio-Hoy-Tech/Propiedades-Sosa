import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId, getTenantConfig } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { TAGS } from "@/lib/cache-tags";
import { MOCK_PROPERTIES } from "@/lib/mock-properties";
import { getFlickrImage } from "@/lib/placeholder-images";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PropertyGallery from "./PropertyGallery";

const useRealData = Boolean(process.env.NEXT_PUBLIC_TENANT_ID);

function getProduct(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const tenantId = getTenantId();
        const supabaseAdmin = createAdminClient();

        const { data } = await supabaseAdmin
          .from("products")
          .select(`
            id, name, slug, price, description, featured,
            product_images (id, url, alt, position),
            product_variants (name)
          `)
          .eq("tenant_id", tenantId)
          .eq("slug", slug)
          .eq("active", true)
          .single();

        return data ?? null;
      } catch {
        return null;
      }
    },
    [`product-${slug}-${process.env.NEXT_PUBLIC_TENANT_ID}`],
    { tags: [TAGS.PRODUCTS, TAGS.PRODUCT(slug)] }
  )();
}

// ── Feature parsing ────────────────────────────────────────────────────────

interface Feature {
  type: "bed" | "bath" | "area" | "lot" | "pool" | "floor" | "garage";
  label: string;
  value: string;
}

function parseFeatures(variantName: string, description: string): Feature[] {
  const features: Feature[] = [];
  const segments = variantName.split("·").map((s) => s.trim());

  for (const seg of segments) {
    if (/^en\s+(venta|alquiler)/i.test(seg)) continue;

    const dormMatch = seg.match(/^(\d+)\s*dorm/i);
    if (dormMatch) {
      features.push({ type: "bed", label: "Dormitorios", value: dormMatch[1] });
      continue;
    }

    const loteMatch = seg.match(/^lote\s+([\d\.,]+)\s*m²/i);
    if (loteMatch) {
      features.push({ type: "lot", label: "Lote", value: `${loteMatch[1]} m²` });
      continue;
    }

    const areaMatch = seg.match(/^([\d\.,]+)\s*m²/i);
    if (areaMatch) {
      features.push({ type: "area", label: "Superficie", value: `${areaMatch[1]} m²` });
      continue;
    }

    if (/^pileta$/i.test(seg)) {
      features.push({ type: "pool", label: "Pileta", value: "Sí" });
      continue;
    }

    const pisoMatch = seg.match(/^piso\s+(\d+)/i);
    if (pisoMatch) {
      features.push({ type: "floor", label: "Piso", value: pisoMatch[1] });
      continue;
    }
  }

  const desc = description.toLowerCase();
  const wordMap: Record<string, string> = { un: "1", una: "1", dos: "2", tres: "3", cuatro: "4" };
  const bathNum = desc.match(/(\d+)\s*baños?/);
  const bathWord = desc.match(/\b(un|una|dos|tres|cuatro)\s+baños?\b/);
  if (bathNum) {
    features.push({ type: "bath", label: "Baños", value: bathNum[1] });
  } else if (bathWord) {
    features.push({ type: "bath", label: "Baños", value: wordMap[bathWord[1]] });
  } else if (desc.includes("baño")) {
    features.push({ type: "bath", label: "Baños", value: "1" });
  }

  if (desc.includes("garage") || desc.includes("cochera")) {
    features.push({ type: "garage", label: "Garage", value: "Sí" });
  }

  return features;
}

function FeatureIcon({ type }: { type: Feature["type"] }) {
  const cls = "w-5 h-5 text-brand-accent flex-shrink-0";
  if (type === "bed") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5v9m0-9a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5m-18 0v9m18-9v9m0 0H3m3-6h.008v.008H6V10.5zm3 0h6" />
    </svg>
  );
  if (type === "bath") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h18v-3.75M3 17.25A2.25 2.25 0 015.25 15H6V6.75A2.25 2.25 0 018.25 4.5h1.5a2.25 2.25 0 012.25 2.25V15h5.25A2.25 2.25 0 0121 17.25M3 17.25h18" />
    </svg>
  );
  if (type === "area") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  );
  if (type === "lot") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0-8.25V4.5m0 2.25H4.5m4.5 0H15M9 15v4.5m0-4.5H4.5m4.5 0H15m0-8.25V4.5m0 2.25h4.5M15 15v4.5m0-4.5h4.5" />
    </svg>
  );
  if (type === "pool") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
  if (type === "floor") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
  // garage
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dbProduct = useRealData ? await getProduct(slug) : null;
  const mock = MOCK_PROPERTIES.find((p) => p.slug === slug);

  const name = (dbProduct?.name as string | undefined) ?? mock?.name ?? "Propiedad";
  const desc =
    (dbProduct?.description as string | undefined) ??
    mock?.description ??
    "Consultá esta propiedad con Propiedades Sosa.";

  const dbImages = dbProduct?.product_images as
    | Array<{ url: string; position: number }>
    | undefined;
  const ogImage =
    dbImages?.sort((a, b) => a.position - b.position)?.[0]?.url ??
    mock?.imageUrl ??
    null;

  return {
    title: name,
    description: desc.slice(0, 160),
    alternates: { canonical: `https://propiedadessosa.com.ar/producto/${slug}` },
    openGraph: {
      title: `${name} | Propiedades Sosa`,
      description: desc.slice(0, 160),
      url: `https://propiedadessosa.com.ar/producto/${slug}`,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Propiedades Sosa`,
      description: desc.slice(0, 160),
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let name = "";
  let description: string | null = null;
  let price: number | null = null;
  let images: string[] = [];
  let features: Feature[] = [];

  const [dbProduct, tenant] = await Promise.all([
    useRealData ? getProduct(slug) : Promise.resolve(null),
    getTenantConfig(),
  ]);
  const mock = MOCK_PROPERTIES.find((p) => p.slug === slug);

  if (!dbProduct && !mock) notFound();

  if (dbProduct) {
    name = dbProduct.name as string;
    description = (dbProduct.description as string | null) ?? null;
    price = dbProduct.price && (dbProduct.price as number) > 0 ? (dbProduct.price as number) : null;

    const dbImages = dbProduct.product_images as Array<{ url: string; alt?: string | null; position: number }> | undefined;
    images = dbImages?.sort((a, b) => a.position - b.position).map((i) => i.url) ?? [];
    if (images.length === 0) images = [getFlickrImage(name, 1200, 800, 1)];

    const variants = dbProduct.product_variants as Array<{ name: string }> | undefined;
    const variantName = variants?.[0]?.name ?? "";
    if (variantName && description) {
      features = parseFeatures(variantName, description);
    }
  } else if (mock) {
    name = mock.name;
    description = mock.description ?? null;
    price = mock.price ?? null;
    images = [
      mock.imageUrl,
      getFlickrImage("casa", 1200, 800, 21),
      getFlickrImage("arquitectura", 1200, 800, 33),
      getFlickrImage("interior", 1200, 800, 17),
    ];
  }

  const whatsappUrl = buildWhatsAppLink(tenant.whatsapp ?? "", {
    message: `Hola, me interesa la propiedad "${name}". ¿Podría darme más información?`,
  });

  const formattedPrice = price
    ? `U$S ${price.toLocaleString("es-AR")}`
    : null;

  const pageUrl = `https://propiedadessosa.com.ar/producto/${slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://propiedadessosa.com.ar" },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: "https://propiedadessosa.com.ar/catalogo" },
      { "@type": "ListItem", position: 3, name: name, item: pageUrl },
    ],
  };

  const listingLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name,
    url: pageUrl,
    description: description ?? undefined,
    ...(images.length > 0 && { image: images }),
    provider: {
      "@type": "RealEstateAgent",
      name: "Propiedades Sosa",
      telephone: "+54-9-3329-69-6105",
      url: "https://propiedadessosa.com.ar",
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-brand-accent transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-neutral-700 line-clamp-1">{name}</span>
          </nav>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* Gallery */}
          <ScrollReveal direction="left">
            <PropertyGallery images={images} name={name} />
          </ScrollReveal>

          {/* Info Panel */}
          <ScrollReveal direction="right" className="flex flex-col gap-6">
            <div>
              <h1
                className="font-display text-3xl md:text-4xl font-bold text-brand-navy leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </h1>

              {formattedPrice ? (
                <p
                  className="font-display text-2xl font-bold text-brand-accent mt-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formattedPrice}
                </p>
              ) : (
                <p className="text-neutral-400 text-base mt-3 italic">Consultar precio</p>
              )}
            </div>

            {/* Features grid */}
            {features.length > 0 && (
              <div className="border-t border-neutral-200 pt-5">
                <div className="grid grid-cols-2 gap-3">
                  {features.map((f) => (
                    <div
                      key={f.type + f.value}
                      className="flex items-center gap-2.5 bg-white border border-neutral-100 rounded-xl px-3.5 py-3 shadow-sm"
                    >
                      <FeatureIcon type={f.type} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider leading-none mb-0.5">
                          {f.label}
                        </p>
                        <p className="text-sm font-semibold text-brand-navy truncate">
                          {f.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {description && (
              <div className="border-t border-neutral-200 pt-6">
                <h2 className="text-xs font-semibold text-neutral-400 tracking-widest uppercase mb-3">
                  Descripción
                </h2>
                <p className="text-neutral-700 leading-relaxed text-sm whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-6 mt-auto flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b859] text-white font-semibold px-6 py-4 rounded-xl transition-colors shadow-lg shadow-green-500/20"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>

              <Link
                href="/catalogo"
                className="flex items-center justify-center gap-2 border border-neutral-200 hover:border-brand-accent text-neutral-600 hover:text-brand-accent font-medium px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Ver más propiedades
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
