// Pure Top Picks shelf logic: types + small helpers. No DOM, no React.

export type TopPickColor = {
  /** Color name from the captured swatch's aria-label. */
  name: string;
  /** Local tiny chip image (/assets/media/<file>) used by the captured style. */
  chipUrl: string;
  /** Chip file name — key into the generated COLORWAY_IMAGES manifest. */
  chipFile: string;
  /** Vendored full-size colorway image, when captured. */
  imageUrl?: string;
};

export type TopPickProduct = {
  name: string;
  brand: string;
  /** Captured main product image (local). */
  image: string;
  /** Visual price block from the card (captured markup, trusted). */
  priceHtml: string;
  /** Strikethrough previous price block, when present. */
  prevPriceHtml?: string;
  /** Captured rating stars + count markup. */
  ratingHtml: string;
  /** e.g. "4.1 out of 5 stars". */
  ratingLabel: string;
  colors: TopPickColor[];
};

/** Generic size options for the Quick View scaffolding (no size data in capture). */
export const QUICK_VIEW_SIZES = ["XS", "S", "M", "L", "XL", "One Size"] as const;

/** Basename of a local /assets/media url (works for url("…") CSS values too). */
export function mediaFileFromUrl(url: string): string {
  const m = url.match(/\/media\/([^/)"']+)/);
  return m ? m[1] : "";
}

/** Dollar amounts in the *visible text* of a captured price fragment.
 * Strips tags first so digits inside class names (e.g. `dls-ihm460`) and
 * aria-hidden/SR-only attributes never leak into the numbers. */
export function priceAmounts(priceHtml: string): number[] {
  const text = priceHtml.replace(/<[^>]*>/g, " ");
  return (text.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

/**
 * "Up to N% off select items" note for the Quick View price row, derived from
 * the lowest current price vs the highest previous price on the card.
 */
export function discountNote(
  currentHtml: string,
  prevHtml?: string,
): string | null {
  if (!prevHtml) return null;
  const current = priceAmounts(currentHtml).filter((n) => n > 0);
  const prev = priceAmounts(prevHtml).filter((n) => n > 0);
  if (!current.length || !prev.length) return null;
  const low = Math.min(...current);
  const high = Math.max(...prev);
  if (high <= low) return null;
  return `Up to ${Math.round((1 - low / high) * 100)}% off select items`;
}

/** "WASHED OXBLOOD" → "Washed Oxblood" for the Quick View color label. */
export function colorDisplayName(name: string): string {
  return name
    .toLowerCase()
    .replace(/(^|[\s/&-])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** Quick View gallery: main image first, then unique full-size colorways. */
export function galleryFor(product: TopPickProduct): string[] {
  const images: string[] = [product.image];
  for (const color of product.colors) {
    if (color.imageUrl && !images.includes(color.imageUrl)) {
      images.push(color.imageUrl);
    }
  }
  return images;
}

/** Gallery index that shows the given colorway image. */
export function galleryIndexForColor(
  images: string[],
  color: TopPickColor | undefined,
): number {
  if (!color?.imageUrl) return 0;
  const i = images.indexOf(color.imageUrl);
  return i < 0 ? 0 : i;
}
