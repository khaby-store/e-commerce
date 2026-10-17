"use client";

import type { Product } from "@/models/product";
import { useProductCatalog } from "@/viewmodels/use-product-catalog";
import { ProductCard } from "@/views/product-card";

interface ProductCatalogViewProps {
  initialProducts: Product[];
}

export function ProductCatalogView({ initialProducts }: ProductCatalogViewProps) {
  const vm = useProductCatalog(initialProducts);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Catalog rendered through the MVVM flow: View → ViewModel → Service →
          Model.
        </p>
      </header>

      <input
        type="search"
        value={vm.query}
        onChange={(e) => vm.setQuery(e.target.value)}
        placeholder="Search products…"
        className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm outline-none ring-emerald-500 focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900"
      />

      {vm.status === "loading" && (
        <p className="text-sm text-neutral-500">Reloading products…</p>
      )}

      {vm.status === "error" && (
        <div className="flex items-center gap-3 text-sm text-red-600 dark:text-red-400">
          <span>Could not load products.</span>
          <button
            onClick={() => vm.reload()}
            className="rounded-lg border border-current px-2 py-1"
          >
            Retry
          </button>
        </div>
      )}

      {vm.products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No products match “{vm.query}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vm.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              formattedPrice={vm.formatPrice(
                product.priceCents,
                product.currency,
              )}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-400">
        Showing {vm.totalVisible} product{vm.totalVisible === 1 ? "" : "s"}
      </p>
    </section>
  );
}
