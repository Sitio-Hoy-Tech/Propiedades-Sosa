import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTenantId, getTenantConfig } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { TAGS } from "@/lib/cache-tags";
import { PRODUCT_SELECT, extractFeaturesFromAttributes, mapDbProductToPropertyData, type Feature } from "@/lib/products";
import { MOCK_PROPERTIES } from "@/lib/mock-properties";
import { getFlickrImage } from "@/lib/placeholder-images";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PropertyGallery from "./PropertyGallery";
import PropertyMap from "@/components/ui/PropertyMap";
import PropertyCard from "@/components/ui/PropertyCard";

const useRealData = Boolean(process.env.NEXT_PUBLIC_TENANT_ID);

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ", Argentina")}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PropiedadesSosa/1.0 (propiedadessosa.com.ar)" },
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    if (!data.length) return null;
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } catch {
    return null;
  }
}

function getRelatedProducts(excludeSlug: string) {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
  return unstable_cache(
    async () => {
      try {
        const supabase = createAdminClient();
        const { data } = await supabase
          .from("products")
          .select(PRODUCT_SELECT)
          .eq("tenant_id", tenantId)
          .eq("active", true)
          .neq("slug", excludeSlug)
          .order("featured", { ascending: false })
          .order("position", { ascending: true })
          .limit(4);
        return (data as unknown[] ?? []).map((p) =>
          mapDbProductToPropertyData(p as Record<string, unknown>, { withBadge: true })
        );
      } catch {
        return [];
      }
    },
    [`related-${tenantId}-${excludeSlug}`],
    { tags: [TAGS.PRODUCTS] }
  )();
}

function getProduct(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const tenantId = getTenantId();
        const supabaseAdmin = createAdminClient();

        const { data } = await supabaseAdmin
          .from("products")
          .select(PRODUCT_SELECT)
          .eq("tenant_id", tenantId)
          .eq("slug", slug)
          .eq("active", true)
          .single();

        return (data as unknown) as Record<string, unknown> | null;
      } catch {
        return null;
      }
    },
    [`product-${slug}-${process.env.NEXT_PUBLIC_TENANT_ID}`],
    { tags: [TAGS.PRODUCTS, TAGS.PRODUCT(slug)] }
  )();
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
  if (type === "location") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
  if (type === "garage") return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
  // generic fallback for any new attribute type
  return (
    <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
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
  let mapCoordinates: [number, number] | null = null;

  const [dbProduct, tenant, relatedProperties] = await Promise.all([
    useRealData ? getProduct(slug) : Promise.resolve(null),
    getTenantConfig(),
    useRealData ? getRelatedProducts(slug) : Promise.resolve(MOCK_PROPERTIES.filter((p) => p.slug !== slug).slice(0, 4)),
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

    const attrs = dbProduct.product_attributes as Array<{ name: string; position: number; product_attribute_values: Array<{ value: string; position: number }> }> | undefined;
    if (attrs?.length) {
      features = extractFeaturesFromAttributes(attrs);
    }

    const locationFeature = features.find((f) => f.type === "location");
    if (locationFeature) {
      mapCoordinates = await geocodeAddress(locationFeature.value);
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

  const locationLabel = mapCoordinates
    ? (features.find((f) => f.type === "location")?.value ?? name)
    : null;

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

      {mapCoordinates && locationLabel && (
        <ScrollReveal>
          <div className="bg-[#23485B] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="flex items-center gap-3 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                    <span className="h-px w-8 bg-brand-accent" />
                    Ubicación
                  </span>
                  <h2
                    className="font-display font-bold text-white text-2xl md:text-3xl leading-tight mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ¿Dónde está<br /><em>ubicada?</em>
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mt-0.5">
                      <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Dirección</p>
                      {locationLabel.split(", ").map((part, i) => (
                        <p key={i} className={i === 0 ? "text-sm font-semibold text-white" : "text-sm text-white/60 mt-0.5"}>
                          {part}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <PropertyMap coordinates={mapCoordinates} label={locationLabel} />
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {relatedProperties.length > 0 && (
        <ScrollReveal>
          <div className="bg-[#F5F7FC] py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="flex items-center gap-3 text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    <span className="h-px w-8 bg-brand-accent" />
                    Más propiedades
                  </span>
                  <h2
                    className="font-display font-bold text-brand-navy text-2xl md:text-3xl leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    También te puede<br /><em>interesar.</em>
                  </h2>
                </div>
                <Link
                  href="/catalogo"
                  className="hidden sm:flex items-center gap-2 text-brand-navy/60 hover:text-brand-navy text-sm font-medium transition-colors flex-shrink-0"
                >
                  Ver todas
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProperties.map((prop, i) => (
                  <PropertyCard key={prop.slug} property={prop} index={i} />
                ))}
              </div>

              <div className="mt-8 flex justify-center sm:hidden">
                <Link
                  href="/catalogo"
                  className="flex items-center gap-2 border border-neutral-300 hover:border-brand-accent text-neutral-600 hover:text-brand-accent font-medium px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Ver todas las propiedades
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
