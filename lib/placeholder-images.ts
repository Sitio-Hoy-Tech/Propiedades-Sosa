const RUBRO_KEYWORDS: Record<string, string> = {
  // Inmobiliaria
  inmobiliaria: "house,architecture",
  propiedad: "house,property",
  casa: "house,architecture",
  departamento: "apartment,modern",
  depto: "apartment,interior",
  terreno: "landscape,field",
  lote: "field,green",
  local: "commercial,building",
  oficina: "office,modern",
  duplex: "house,modern",
  emprendimiento: "building,architecture",
  country: "luxury,house",
  chalet: "house,countryside",
  // Otros rubros
  cafe: "coffee,espresso",
  cafeteria: "coffee,cafe",
  hamburguesa: "burger,hamburger",
  ropa: "fashion,clothing",
  skincare: "skincare,cosmetics",
  joyeria: "jewelry,ring",
  libro: "book,library",
  muebles: "furniture,interior",
  tech: "technology,gadget",
};

function deriveKeyword(nameOrRubro: string): string {
  const clean = nameOrRubro
    .toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/g, "").trim();

  if (RUBRO_KEYWORDS[clean]) return RUBRO_KEYWORDS[clean];

  const firstWord = clean.split(/\s+/)[0];
  if (RUBRO_KEYWORDS[firstWord]) return RUBRO_KEYWORDS[firstWord];

  for (const [key, val] of Object.entries(RUBRO_KEYWORDS)) {
    if (clean.includes(key)) return val;
  }

  return "house,architecture";
}

function deterministicLock(seed: string): number {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return (hash % 50) + 1;
}

export function getFlickrImage(keyword: string, width = 800, height = 600, lock?: number): string {
  const kw = deriveKeyword(keyword);
  const lockNum = lock ?? deterministicLock(keyword);
  return `https://loremflickr.com/${width}/${height}/${kw}?lock=${lockNum}`;
}

export function getProductImage(
  product: { name: string; product_images?: { url: string; alt?: string | null }[] },
  width = 800,
  height = 600
): string {
  if (product.product_images?.[0]?.url) {
    return product.product_images[0].url;
  }
  return getFlickrImage(product.name, width, height);
}

export function getSectionImage(keyword: string, width = 1200, height = 800, lock?: number): string {
  return getFlickrImage(keyword, width, height, lock);
}

export function getProductImageByRubro(rubro: string, index: number, width = 800, height = 600): string {
  const kw = deriveKeyword(rubro);
  return `https://loremflickr.com/${width}/${height}/${kw}?lock=${(index % 20) + 1}`;
}
