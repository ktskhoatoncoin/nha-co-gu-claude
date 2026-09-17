"use client";

// PRODUCT CURATOR V2 — persistence layer.
//
// Stores the full product list in localStorage, seeded once from
// lib/curator/seed.ts. This is deliberately the ONLY module in the curator
// that knows where data physically lives: pages and components go through
// the functions below, so replacing localStorage with a real database in a
// later version means rewriting this file and nothing else.

import { CuratedProduct, ProductStatus } from "@/lib/curator/types";
import { computeGuScore } from "@/lib/curator/scoring";
import { seedCuratedProducts } from "@/lib/curator/seed";

const STORAGE_KEY = "ncg_curator_products_v2";
const EVENT = "ncg_curator_change";

function isBrowser() {
  return typeof window !== "undefined";
}

/** Reads the store, seeding it on first run. */
export function loadProducts(): CuratedProduct[] {
  if (!isBrowser()) return seedCuratedProducts;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCuratedProducts));
      return seedCuratedProducts;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedCuratedProducts;
  } catch {
    return seedCuratedProducts;
  }
}

function persist(products: CuratedProduct[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeToProducts(callback: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getProduct(id: string): CuratedProduct | undefined {
  return loadProducts().find((p) => p.id === id);
}

export function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Everything the add/edit form collects. guScore, slug and timestamps are
 *  derived here rather than trusted from the form. */
export type ProductDraft = Omit<CuratedProduct, "id" | "slug" | "guScore" | "createdAt" | "updatedAt" | "featured">;

export function createProduct(draft: ProductDraft): CuratedProduct {
  const now = new Date().toISOString();
  const product: CuratedProduct = {
    ...draft,
    id: `cur-${Date.now()}`,
    slug: slugify(draft.name),
    guScore: computeGuScore(draft.scores),
    featured: draft.status === "FEATURED",
    createdAt: now,
    updatedAt: now,
  };
  persist([product, ...loadProducts()]);
  return product;
}

export function updateProduct(id: string, draft: Partial<ProductDraft>): CuratedProduct | undefined {
  const products = loadProducts();
  let updated: CuratedProduct | undefined;

  const next = products.map((p) => {
    if (p.id !== id) return p;
    const merged: CuratedProduct = {
      ...p,
      ...draft,
      slug: draft.name ? slugify(draft.name) : p.slug,
      updatedAt: new Date().toISOString(),
    };
    if (draft.scores) merged.guScore = computeGuScore(draft.scores);
    if (draft.status) merged.featured = draft.status === "FEATURED";
    updated = merged;
    return merged;
  });

  persist(next);
  return updated;
}

/** Status transitions go through here so `featured` can never drift out of
 *  sync with `status`. */
export function setStatus(id: string, status: ProductStatus) {
  return updateProduct(id, { status });
}

export function deleteProduct(id: string) {
  persist(loadProducts().filter((p) => p.id !== id));
}

/** Restores the demo dataset — useful after experimenting in the curator. */
export function resetToSeed() {
  persist(seedCuratedProducts);
}
