"use client";

import { useCallback, useMemo, useState } from "react";
import { formatPrice, matchesQuery, type Product } from "@/models/product";
import { getProducts } from "@/services/product-service";

export type CatalogStatus = "idle" | "loading" | "error";

export interface ProductCatalogViewModel {
  status: CatalogStatus;
  products: Product[];
  query: string;
  totalVisible: number;
  setQuery: (query: string) => void;
  reload: () => void;
  formatPrice: typeof formatPrice;
}

export function useProductCatalog(
  initialProducts: Product[],
): ProductCatalogViewModel {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [status, setStatus] = useState<CatalogStatus>("idle");
  const [query, setQuery] = useState("");

  const reload = useCallback(() => {
    setStatus("loading");
    getProducts()
      .then((next) => {
        setItems(next);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  const products = useMemo(
    () => items.filter((p) => matchesQuery(p, query)),
    [items, query],
  );

  return {
    status,
    products,
    query,
    totalVisible: products.length,
    setQuery,
    reload,
    formatPrice,
  };
}
