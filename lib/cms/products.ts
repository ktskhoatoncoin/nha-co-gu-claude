import { Product, ScoreBreakdown } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
export { OTHER_CATEGORY_ID, OTHER_CATEGORY_NAME } from "./constants";

export interface ProductWriteInput {
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
  platform: Product["platform"];
  merchantName: string;
  affiliateUrl: string;
  commissionRate: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  scores: ScoreBreakdown;
  badges: Product["badges"];
  isFeatured: boolean;
  isHero: boolean;
  isActive: boolean;
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

function scoreOf(scores: ScoreBreakdown) {
  return Math.round(((scores.design + scores.price + scores.function + scores.material + scores.value + scores.content) / 6) * 10) / 10;
}

function fromRow(row: Record<string, unknown>): Product {
  const scores = (row.scores ?? {
    design: row.design_score ?? 0,
    price: row.price_score ?? 0,
    function: row.function_score ?? 0,
    material: row.material_score ?? 0,
    value: row.value_score ?? 0,
    content: row.content_score ?? 0,
  }) as ScoreBreakdown;
  const categoryId = String(row.category_id ?? "");
  const roomIds = (row.room_ids ?? []) as string[];
  const styleIds = (row.style_ids ?? []) as string[];

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? slugify(String(row.name ?? ""))),
    description: String(row.description ?? ""),
    shortDescription: String(row.short_description ?? ""),
    categoryId,
    subcategory: String(row.subcategory ?? ""),
    roomIds,
    styleIds,
    price: Number(row.price ?? 0),
    originalPrice: row.original_price == null ? null : Number(row.original_price),
    currency: "VND",
    imageUrl: String(row.image_url ?? ""),
    gallery: (row.gallery ?? []) as string[],
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    soldCount: Number(row.sold_count ?? 0),
    merchantName: String(row.merchant_name ?? ""),
    platform: (row.platform ?? "other") as Product["platform"],
    affiliateUrl: String(row.affiliate_url ?? ""),
    commissionRate: Number(row.commission_rate ?? 0),
    commissionType: (row.commission_type ?? "percentage") as Product["commissionType"],
    commissionUpdatedAt: String(row.commission_updated_at ?? row.updated_at ?? new Date().toISOString()),
    ourScore: Number(row.our_score ?? scoreOf(scores)),
    scores,
    badges: (row.badges ?? []) as Product["badges"],
    suitedFor: (row.suited_for ?? { rooms: roomIds, styles: styleIds, size: "", budget: "" }) as Product["suitedFor"],
    pros: (row.pros ?? []) as string[],
    cons: (row.cons ?? []) as string[],
    isFeatured: Boolean(row.is_featured),
    isHero: Boolean(row.is_hero),
    isActive: Boolean(row.is_active),
    isDemoData: Boolean(row.is_demo_data),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function toRow(input: ProductWriteInput, id?: string) {
  const now = new Date().toISOString();
  const slug = slugify(input.name);
  return {
    ...(id ? { id } : {}),
    name: input.name,
    slug,
    description: input.description,
    short_description: input.shortDescription,
    category_id: input.categoryId,
    subcategory: input.subcategory,
    room_ids: input.roomIds,
    style_ids: input.styleIds,
    price: input.price,
    original_price: input.originalPrice,
    currency: "VND",
    image_url: input.imageUrl,
    gallery: input.gallery,
    rating: input.rating,
    review_count: input.reviewCount,
    sold_count: input.soldCount,
    merchant_name: input.merchantName,
    platform: input.platform,
    affiliate_url: input.affiliateUrl,
    commission_rate: input.commissionRate,
    commission_type: "percentage",
    commission_updated_at: now,
    our_score: scoreOf(input.scores),
    scores: input.scores,
    badges: input.badges,
    suited_for: { rooms: input.roomIds, styles: input.styleIds, size: "", budget: "" },
    pros: [],
    cons: [],
    is_featured: input.isFeatured,
    is_hero: input.isHero,
    is_active: input.isActive,
    is_demo_data: false,
    updated_at: now,
  };
}

function toInput(product: Product): ProductWriteInput {
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

export async function getCmsProducts(): Promise<Product[]> {
  if (!hasSupabaseAdminConfig()) return seedProducts;
  const { data, error } = await createSupabaseAdminClient().from("products").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  if (!data?.length && seedProducts.length) {
    const seededRows = seedProducts.map((product) => toRow(toInput(product), product.id));
    const seeded = await createSupabaseAdminClient().from("products").insert(seededRows).select("*");
    if (seeded.error) throw new Error(seeded.error.message);
    return (seeded.data ?? []).map((row) => fromRow(row as Record<string, unknown>));
  }
  return (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
}

export async function getCmsProduct(id: string) {
  if (!hasSupabaseAdminConfig()) return seedProducts.find((product) => product.id === id);
  const { data, error } = await createSupabaseAdminClient().from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as Record<string, unknown>) : undefined;
}

export async function getCmsProductBySlug(slug: string) {
  const product = (await getCmsProducts()).find((item) => item.slug === slug && item.isActive);
  return product;
}

export async function createCmsProduct(input: ProductWriteInput) {
  const id = `prod-${crypto.randomUUID()}`;
  const { data, error } = await createSupabaseAdminClient().from("products").insert(toRow(input, id)).select("*").single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function updateCmsProduct(id: string, input: ProductWriteInput) {
  const { data, error } = await createSupabaseAdminClient().from("products").update(toRow(input, id)).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function deleteCmsProduct(id: string) {
  const { error } = await createSupabaseAdminClient().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
