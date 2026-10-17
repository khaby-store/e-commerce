import type { Product } from "@/models/product";

interface ProductCardProps {
  product: Product;
  formattedPrice: string;
}

export function ProductCard({ product, formattedPrice }: ProductCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div
        className="flex h-36 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800"
        aria-hidden
      >
        <span className="text-4xl">👟</span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{product.name}</h3>
        <span className="whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">
          {formattedPrice}
        </span>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {product.description}
      </p>
      <span
        className={
          product.inStock
            ? "self-start rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : "self-start rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
        }
      >
        {product.inStock ? "In stock" : "Out of stock"}
      </span>
    </article>
  );
}
