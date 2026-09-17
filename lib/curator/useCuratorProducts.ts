"use client";

import { useSyncExternalStore } from "react";
import { CuratedProduct } from "@/lib/curator/types";
import { loadProducts, subscribeToProducts } from "@/lib/curator/store";
import { seedCuratedProducts } from "@/lib/curator/seed";

function getSnapshot() {
  return window.localStorage.getItem("ncg_curator_products_v2") ?? "";
}

function getServerSnapshot() {
  return "";
}

/** Re-renders whenever the curator store changes, in this tab or another. */
export function useCuratorProducts(): CuratedProduct[] {
  const raw = useSyncExternalStore(subscribeToProducts, getSnapshot, getServerSnapshot);
  if (!raw) return seedCuratedProducts;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : loadProducts();
  } catch {
    return loadProducts();
  }
}
