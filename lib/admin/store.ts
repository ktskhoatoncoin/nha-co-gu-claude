"use client";

// V1 DEMO ADMIN STORE.
// Persists admin edits in the browser's localStorage as an "overlay" on top
// of the static seed data, so the admin UI feels real without a backend.
// In production this entire file is replaced by Supabase queries — no other
// file in app/admin should need to change, since everything reads through
// getAdminProducts()/saveAdminProduct()/deleteAdminProduct() below.

import { Badge, Platform, Product, ScoreBreakdown } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";

const OVERRIDES_KEY = "ncg_admin_product_overrides";
const NEW_PRODUCTS_KEY = "ncg_admin_new_products";
const DELETED_KEY = "ncg_admin_deleted_ids";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getAdminProducts(): Product[] {
  const overrides = readJSON<Record<string, Partial<Product>>>(OVERRIDES_KEY, {});
  const created = readJSON<Product[]>(NEW_PRODUCTS_KEY, []);
  const deleted = new Set(readJSON<string[]>(DELETED_KEY, []));

  const merged = seedProducts
    .filter((p) => !deleted.has(p.id))
    .map((p) => ({ ...p, ...overrides[p.id] }));

  const createdActive = created.filter((p) => !deleted.has(p.id));

  return [...merged, ...createdActive];
}

export function getAdminProduct(id: string): Product | undefined {
  return getAdminProducts().find((p) => p.id === id);
}

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function computeOverallScore(scores: ScoreBreakdown) {
  const avg = (scores.design + scores.price + scores.function + scores.material + scores.value + scores.content) / 6;
  return Math.round(avg * 10) / 10;
}

export interface ProductFormValues {
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  subcategory: string;
  roomIds: string[];
  styleIds: string[];
  price: number;
  originalPrice: number | null;
  platform: Platform;
  merchantName: string;
  affiliateUrl: string;
  commissionRate: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  scores: ScoreBreakdown;
  badges: Badge[];
  isFeatured: boolean;
  isHero: boolean;
  isActive: boolean;
}

export function createAdminProduct(values: ProductFormValues): Product {
  const created = readJSON<Product[]>(NEW_PRODUCTS_KEY, []);
  const now = new Date().toISOString();
  const id = `prod-admin-${Date.now()}`;
  const overallScore = computeOverallScore(values.scores);

  const product: Product = {
    id,
    name: values.name,
    slug: slugify(values.name),
    description: values.description,
    shortDescription: values.shortDescription,
    categoryId: values.categoryId,
    subcategory: values.subcategory,
    roomIds: values.roomIds,
    styleIds: values.styleIds,
    price: values.price,
    originalPrice: values.originalPrice,
    currency: "VND",
    imageUrl: `https://picsum.photos/seed/${slugify(values.name)}/900/1125`,
    gallery: [1, 2, 3].map((n) => `https://picsum.photos/seed/${slugify(values.name)}-${n}/1200/1200`),
    rating: values.rating,
    reviewCount: values.reviewCount,
    soldCount: values.soldCount,
    merchantName: values.merchantName,
    platform: values.platform,
    affiliateUrl: values.affiliateUrl,
    commissionRate: values.commissionRate,
    commissionType: "percentage",
    commissionUpdatedAt: now,
    ourScore: overallScore,
    scores: values.scores,
    badges: values.badges,
    suitedFor: { rooms: values.roomIds, styles: values.styleIds, size: "", budget: "" },
    pros: [],
    cons: [],
    isFeatured: values.isFeatured,
    isHero: values.isHero,
    isActive: values.isActive,
    isDemoData: true,
    createdAt: now,
    updatedAt: now,
  };

  writeJSON(NEW_PRODUCTS_KEY, [...created, product]);
  return product;
}

export function updateAdminProduct(id: string, values: Partial<ProductFormValues>) {
  const isSeed = seedProducts.some((p) => p.id === id);
  const now = new Date().toISOString();

  if (isSeed) {
    const overrides = readJSON<Record<string, Partial<Product>>>(OVERRIDES_KEY, {});
    const patch: Partial<Product> = { ...values, updatedAt: now };
    if (values.scores) patch.ourScore = computeOverallScore(values.scores);
    overrides[id] = { ...overrides[id], ...patch };
    writeJSON(OVERRIDES_KEY, overrides);
  } else {
    const created = readJSON<Product[]>(NEW_PRODUCTS_KEY, []);
    const next = created.map((p) => {
      if (p.id !== id) return p;
      const patch: Partial<Product> = { ...values, updatedAt: now };
      if (values.scores) patch.ourScore = computeOverallScore(values.scores);
      return { ...p, ...patch };
    });
    writeJSON(NEW_PRODUCTS_KEY, next);
  }
}

export function deleteAdminProduct(id: string) {
  const deleted = readJSON<string[]>(DELETED_KEY, []);
  if (!deleted.includes(id)) writeJSON(DELETED_KEY, [...deleted, id]);
}

export function setAdminProductFlag(id: string, flag: "isFeatured" | "isHero" | "isActive", value: boolean) {
  updateAdminProduct(id, { [flag]: value } as Partial<ProductFormValues>);
}

export function resetAdminOverrides() {
  window.localStorage.removeItem(OVERRIDES_KEY);
  window.localStorage.removeItem(NEW_PRODUCTS_KEY);
  window.localStorage.removeItem(DELETED_KEY);
}
