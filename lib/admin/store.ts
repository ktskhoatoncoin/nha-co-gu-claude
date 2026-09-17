"use client";

import { Badge, Platform, Product, ScoreBreakdown } from "@/lib/types";

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
  imageUrl: string;
  gallery: string[];
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

function toInput(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    categoryId: product.categoryId,
    subcategory: product.subcategory,
    roomIds: product.roomIds,
    styleIds: product.styleIds,
    price: product.price,
    originalPrice: product.originalPrice,
    imageUrl: product.imageUrl,
    gallery: product.gallery,
    platform: product.platform,
    merchantName: product.merchantName,
    affiliateUrl: product.affiliateUrl,
    commissionRate: product.commissionRate,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldCount: product.soldCount,
    scores: product.scores,
    badges: product.badges,
    isFeatured: product.isFeatured,
    isHero: product.isHero,
    isActive: product.isActive,
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? "Không thể hoàn thành thao tác.");
  return body as T;
}

export function getAdminProducts() {
  return request<Product[]>("/api/admin/products", { cache: "no-store" });
}

export function getAdminProduct(id: string) {
  return request<Product>(`/api/admin/products/${id}`, { cache: "no-store" });
}

export function createAdminProduct(values: ProductFormValues) {
  return request<Product>("/api/admin/products", { method: "POST", body: JSON.stringify(values) });
}

export function updateAdminProduct(id: string, values: Partial<ProductFormValues>) {
  return getAdminProduct(id).then((product) =>
    request<Product>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...toInput(product), ...values }),
    }),
  );
}

export function deleteAdminProduct(id: string) {
  return request<void>(`/api/admin/products/${id}`, { method: "DELETE" });
}

export function setAdminProductFlag(id: string, flag: "isFeatured" | "isHero" | "isActive", value: boolean) {
  return updateAdminProduct(id, { [flag]: value });
}
