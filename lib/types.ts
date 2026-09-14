// Core data model for Nhà Có Gu.
// In V1 this is served from static seed data (see lib/data/*).
// The shape here is designed to map 1:1 onto Supabase/Postgres tables
// documented in README.md, so swapping the data source later doesn't
// require touching any UI component.

export type Platform = "shopee" | "tiktok_shop" | "lazada" | "brand" | "other";

export type CommissionType = "percentage" | "fixed";

export type Badge =
  | "nha_co_gu_chon"
  | "dang_tien"
  | "duoi_500k"
  | "phu_hop_nha_nho"
  | "san_pham_noi_bat";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  commonProblems: string[];
  heroImage: string;
}

export interface Style {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
}

export interface BudgetTier {
  id: string;
  slug: string;
  name: string;
  min: number;
  max: number | null; // null = no upper bound
  description: string;
}

export interface ScoreBreakdown {
  design: number;
  price: number;
  function: number;
  material: number;
  value: number;
  content: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string; // editorial write-up, our own words
  shortDescription: string;
  categoryId: string;
  subcategory: string;
  roomIds: string[];
  styleIds: string[];
  price: number;
  originalPrice: number | null;
  currency: "VND";
  imageUrl: string;
  gallery: string[];
  rating: number; // 0-5
  reviewCount: number;
  soldCount: number;
  merchantName: string;
  platform: Platform;
  affiliateUrl: string;
  commissionRate: number;
  commissionType: CommissionType;
  commissionUpdatedAt: string; // ISO date
  ourScore: number; // 0-10 overall
  scores: ScoreBreakdown;
  badges: Badge[];
  suitedFor: {
    rooms: string[]; // display labels
    styles: string[];
    size: string;
    budget: string;
  };
  pros: string[];
  cons: string[];
  isFeatured: boolean;
  isHero: boolean;
  isActive: boolean;
  isDemoData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string; // ISO date
  readingTimeMinutes: number;
  category: string;
  content: ArticleBlock[];
  relatedProductSlugs: string[];
  hasAffiliateLinks: boolean;
}

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface AffiliateClickEvent {
  id: string;
  productId: string;
  platform: Platform;
  timestamp: string;
  referrer: string;
  page: string;
  deviceType: "mobile" | "desktop" | "tablet";
  sessionId: string;
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
}
