export type ProductId = string;

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  imageUrl: string;
  inStock: boolean;
}

export function formatPrice(priceCents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q)
  );
}
