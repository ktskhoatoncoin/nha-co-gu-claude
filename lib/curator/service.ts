"use client";

// PRODUCT CURATOR V2 — service layer.
//
//   Product Curator  →  [ this file ]  →  Public Website
//
// The public site must never read the curator's raw store: it should only
// ever see products that passed curation. Every function here filters to
// APPROVED/FEATURED first, so a DRAFT or REJECTED product cannot leak to
// readers even if a page author forgets to filter.
//
// When the store moves to a real database, only lib/curator/store.ts
// changes — these signatures stay stable for the public site.

import { CuratedProduct, ProductStatus } from "@/lib/curator/types";
import { loadProducts } from "@/lib/curator/store";

const PUBLISHED: ProductStatus[] = ["APPROVED", "FEATURED"];

export function isPublished(product: CuratedProduct) {
  return PUBLISHED.includes(product.status);
}

/** All products cleared for the public website, best GU Score first. */
export function getApprovedProducts(): CuratedProduct[] {
  return loadProducts()
    .filter(isPublished)
    .sort((a, b) => b.guScore - a.guScore);
}

export function getFeaturedProducts(limit?: number): CuratedProduct[] {
  const featured = loadProducts()
    .filter((p) => p.status === "FEATURED")
    .sort((a, b) => b.guScore - a.guScore);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getProductsByCategory(categoryId: string): CuratedProduct[] {
  return getApprovedProducts().filter((p) => p.categoryId === categoryId);
}

export function getProductsByStyle(styleId: string): CuratedProduct[] {
  return getApprovedProducts().filter((p) => p.styles.includes(styleId));
}

export function getPublishedProductBySlug(slug: string): CuratedProduct | undefined {
  return getApprovedProducts().find((p) => p.slug === slug);
}

/** Products at or above a GU Score threshold — e.g. a "Nhà Có Gu chọn"
 *  rail on the homepage could use getTopScoring(85, 8). */
export function getTopScoring(minScore: number, limit?: number): CuratedProduct[] {
  const list = getApprovedProducts().filter((p) => p.guScore >= minScore);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export interface CurationStats {
  total: number;
  draft: number;
  review: number;
  approved: number;
  featured: number;
  rejected: number;
  archived: number;
  averageGuScore: number;
}

export function getCurationStats(): CurationStats {
  const products = loadProducts();
  const byStatus = (status: ProductStatus) => products.filter((p) => p.status === status).length;
  const scored = products.filter((p) => p.guScore > 0);

  return {
    total: products.length,
    draft: byStatus("DRAFT"),
    review: byStatus("REVIEW"),
    approved: byStatus("APPROVED"),
    featured: byStatus("FEATURED"),
    rejected: byStatus("REJECTED"),
    archived: byStatus("ARCHIVED"),
    averageGuScore: scored.length
      ? Math.round(scored.reduce((sum, p) => sum + p.guScore, 0) / scored.length)
      : 0,
  };
}
