function sanitizeNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `549${digits}`;
  if (digits.length === 11 && digits.startsWith("54")) return `549${digits.slice(2)}`;
  return digits;
}

export function getWhatsAppUrl(raw: string): string {
  return `https://wa.me/${sanitizeNumber(raw)}`;
}

export function buildWhatsAppLink(
  raw: string,
  { message, productName, productUrl }: { message?: string; productName?: string; productUrl?: string } = {}
): string {
  const number = sanitizeNumber(raw);
  let text = message;

  if (!text && productName) {
    text = `Hola, quiero consultar sobre: *${productName}*`;
    if (productUrl) text += `\n${productUrl}`;
  }

  if (!text) text = "Hola, quiero hacer una consulta.";

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
