// NHÀ CÓ GU — PRODUCT CURATOR V2
// Domain model for the internal curation system.
//
// Deliberately separate from lib/types.ts (the V1 public-website Product),
// because the two answer different questions: the V1 type describes a
// product already published to readers, while CuratedProduct describes one
// moving through the curation pipeline and carries fields the public site
// never sees (editor notes, rejection reasons, source provenance).
// lib/curator/service.ts is the bridge between them.

/** Where a product record originated. V2 only produces "manual", but the
 *  field exists so V4 (Shopee/Lazada/TikTok import) needs no migration. */
export type ProductSource = "manual" | "shopee" | "lazada" | "tiktok_shop" | "supplier" | "other";

export const productSources: { value: ProductSource; label: string }[] = [
  { value: "manual", label: "Nhập thủ công" },
  { value: "shopee", label: "Shopee" },
  { value: "lazada", label: "Lazada" },
  { value: "tiktok_shop", label: "TikTok Shop" },
  { value: "supplier", label: "Nhà cung cấp" },
  { value: "other", label: "Khác" },
];

export type ProductStatus = "DRAFT" | "REVIEW" | "APPROVED" | "FEATURED" | "REJECTED" | "ARCHIVED";

export const productStatuses: ProductStatus[] = [
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "FEATURED",
  "REJECTED",
  "ARCHIVED",
];

export const statusLabels: Record<ProductStatus, string> = {
  DRAFT: "Nháp",
  REVIEW: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  FEATURED: "Nổi bật",
  REJECTED: "Từ chối",
  ARCHIVED: "Lưu trữ",
};

/** The five components of a GU Score, each on a 0–100 scale. */
export interface GuScoreBreakdown {
  visual: number;
  style: number;
  quality: number;
  value: number;
  editorial: number;
}

export interface ProductDimensions {
  width?: number; // cm
  depth?: number; // cm
  height?: number; // cm
  note?: string; // free text, e.g. "đường kính 45cm"
}

export interface CuratedProduct {
  id: string;
  name: string;
  slug: string;

  categoryId: string;
  subcategoryId: string | null;

  description: string;
  shortDescription: string;

  image: string;
  additionalImages: string[];

  price: number;
  originalPrice: number | null;
  currency: "VND";

  rating: number; // 0–5
  reviewCount: number;
  soldCount: number;

  shopName: string;
  source: ProductSource;
  productUrl: string;
  affiliateUrl: string;

  /** Primary style, used for single-value displays and grouping. */
  style: string;
  /** All styles this product fits, including the primary one. */
  styles: string[];

  color: string;
  material: string;
  dimensions: ProductDimensions;

  guScore: number; // 0–100, always derived from scores via computeGuScore()
  scores: GuScoreBreakdown;

  editorNote: string;

  status: ProductStatus;
  featured: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Style {
  id: string;
  name: string;
  description: string;
}
