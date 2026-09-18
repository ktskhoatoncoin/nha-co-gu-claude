import { Product, ScoreBreakdown } from "@/lib/types";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

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

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function scoreOf(scores: ScoreBreakdown): number {
  return Math.round(
    (scores.design +
      scores.price +
      scores.function +
      scores.material +
      scores.value +
      scores.content) /
      6
  );
}

function fromRow(row: Record<string, unknown>): Product {
  const scores: ScoreBreakdown = {
    design: Number(row.design_score ?? 0),
    price: Number(row.price_score ?? 0),
    function: Number(row.function_score ?? 0),
    material: Number(row.material_score ?? 0),
    value: Number(row.value_score ?? 0),
    content: Number(row.content_score ?? 0),
  };

  const isActive =
    String(row.status ?? "draft").toLowerCase() === "published";

  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    shortDescription: "",
    categoryId:
      row.category_id == null ? "" : String(row.category_id),
    subcategory: "",
    roomIds: [],
    styleIds: [],
    price: Number(row.price ?? 0),
    originalPrice: null,
    currency: "VND",
    imageUrl: String(row.image_url ?? ""),
    gallery: [],
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    merchantName: "",
    platform: "other",
    affiliateUrl: String(row.affiliate_url ?? ""),
    commissionRate: 0,
    commissionType: "percentage",
    commissionUpdatedAt: String(
      row.created_at ?? new Date().toISOString()
    ),
    ourScore: scoreOf(scores),
    scores,
    badges: [],
    suitedFor: {
      rooms: [],
      styles: [],
      size: "",
      budget: "",
    },
    pros: [],
    cons: [],
    isFeatured: Boolean(row.is_featured),
    isHero: false,
    isActive,
    isDemoData: false,
    createdAt: String(
      row.created_at ?? new Date().toISOString()
    ),
    updatedAt: String(
      row.created_at ?? new Date().toISOString()
    ),
  };
}

function toRow(input: ProductWriteInput) {
  return {
    name: input.name,
    slug: slugify(input.name),
    description: input.description,
    category_id: input.categoryId
      ? Number(input.categoryId)
      : null,
    price: input.price || null,
    affiliate_url: input.affiliateUrl || null,
    image_url: input.imageUrl || null,
    status: input.isActive ? "published" : "draft",
    is_featured: input.isFeatured,
  };
}

export async function getCmsProducts(): Promise<Product[]> {
  if (!hasSupabaseAdminConfig()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    fromRow(row as Record<string, unknown>)
  );
}

export async function getCmsProduct(
  id: string
): Promise<Product | undefined> {
  if (!hasSupabaseAdminConfig()) {
    return undefined;
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? fromRow(data as Record<string, unknown>)
    : undefined;
}

export async function createCmsProduct(
  input: ProductWriteInput
): Promise<Product> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin chưa được cấu hình.");
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .insert(toRow(input))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return fromRow(data as Record<string, unknown>);
}

export async function updateCmsProduct(
  id: string,
  input: ProductWriteInput
): Promise<Product> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin chưa được cấu hình.");
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .update(toRow(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return fromRow(data as Record<string, unknown>);
}

export async function deleteCmsProduct(id: string): Promise<void> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin chưa được cấu hình.");
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}