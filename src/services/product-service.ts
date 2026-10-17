import type { Product } from "@/models/product";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Aero Running Shoe",
    description: "Lightweight trainer with responsive foam midsole.",
    priceCents: 12900,
    currency: "USD",
    imageUrl: "/products/running-shoe.svg",
    inStock: true,
  },
  {
    id: "p-2",
    name: "Trail Hydration Pack",
    description: "1.5L bladder, breathable back panel, 3 pockets.",
    priceCents: 8900,
    currency: "USD",
    imageUrl: "/products/hydration-pack.svg",
    inStock: true,
  },
  {
    id: "p-3",
    name: "Merino Base Layer",
    description: "Ultra-soft 17.5 micron merino, odor resistant.",
    priceCents: 7400,
    currency: "USD",
    imageUrl: "/products/base-layer.svg",
    inStock: false,
  },
];

export async function getProducts(): Promise<Product[]> {
  await delay(400);
  return PRODUCTS;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  await delay(200);
  return PRODUCTS.find((p) => p.id === id);
}
