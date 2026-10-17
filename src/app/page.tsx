import { Suspense } from "react";
import { getProducts } from "@/services/product-service";
import { ProductCatalogView } from "@/views/product-catalog";

async function ProductCatalogSection() {
  const products = await getProducts();
  return <ProductCatalogView initialProducts={products} />;
}

function CatalogFallback() {
  return (
    <p className="mx-auto w-full max-w-5xl px-6 py-12 text-sm text-neutral-500">
      Loading products…
    </p>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={<CatalogFallback />}>
        <ProductCatalogSection />
      </Suspense>
    </main>
  );
}
