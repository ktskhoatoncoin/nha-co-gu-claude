import { Article } from "@/lib/types";
import { articles as seedArticles } from "@/lib/data/articles";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type ArticleStatus = "draft" | "published" | "hidden";

export interface ArticleWriteInput {
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  readingTimeMinutes: number;
  category: string;
  content: Article["content"];
  relatedProductSlugs: string[];
  hasAffiliateLinks: boolean;
  status: ArticleStatus;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function fromRow(row: Record<string, unknown>): Article & { status: ArticleStatus } {
  return {
    id: String(row.id),
    slug: String(row.slug ?? slugify(String(row.title ?? ""))),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    coverImage: String(row.cover_image ?? ""),
    author: String(row.author ?? "Nhà Có Gu"),
    date: String(row.published_at ?? row.created_at ?? new Date().toISOString()),
    readingTimeMinutes: Number(row.reading_time_minutes ?? 1),
    category: String(row.category ?? "Góc kiến trúc sư"),
    content: (row.content ?? []) as Article["content"],
    relatedProductSlugs: (row.related_product_slugs ?? []) as string[],
    hasAffiliateLinks: Boolean(row.has_affiliate_links),
    status: (row.status ?? "published") as ArticleStatus,
  };
}

function toRow(input: ArticleWriteInput, id?: string) {
  const now = new Date().toISOString();
  return {
    ...(id ? { id } : {}),
    slug: slugify(input.title),
    title: input.title,
    excerpt: input.excerpt,
    cover_image: input.coverImage,
    author: input.author,
    published_at: input.status === "published" ? now : null,
    reading_time_minutes: input.readingTimeMinutes,
    category: input.category,
    content: input.content,
    related_product_slugs: input.relatedProductSlugs,
    has_affiliate_links: input.hasAffiliateLinks,
    status: input.status,
    updated_at: now,
  };
}

function toInput(article: Article): ArticleWriteInput {
  return {
    title: article.title,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    author: article.author,
    readingTimeMinutes: article.readingTimeMinutes,
    category: article.category,
    content: article.content,
    relatedProductSlugs: article.relatedProductSlugs,
    hasAffiliateLinks: article.hasAffiliateLinks,
    status: "published",
  };
}

export async function getCmsArticles(options?: { includeUnpublished?: boolean }) {
  if (!hasSupabaseAdminConfig()) return seedArticles.map((article) => ({ ...article, status: "published" as const }));
  let query = createSupabaseAdminClient().from("articles").select("*").order("published_at", { ascending: false, nullsFirst: false });
  if (!options?.includeUnpublished) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
}

/** Explicit one-time seed operation. Never call from a page or GET handler. */
export async function seedCmsArticles() {
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase admin chưa được cấu hình.");

  const supabase = createSupabaseAdminClient();
  const { data: existing, error: lookupError } = await supabase.from("articles").select("id").limit(1);
  if (lookupError) throw new Error(lookupError.message);
  if (existing?.length) throw new Error("Chỉ được nhập seed bài viết khi bảng articles đang rỗng.");

  const rows = seedArticles.map((article) => toRow(toInput(article), article.id));
  const { data, error } = await supabase.from("articles").insert(rows).select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
}

export async function getCmsArticle(slug: string, includeUnpublished = false) {
  if (!hasSupabaseAdminConfig()) return seedArticles.find((article) => article.slug === slug);
  let query = createSupabaseAdminClient().from("articles").select("*").eq("slug", slug);
  if (!includeUnpublished) query = query.eq("status", "published");
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as Record<string, unknown>) : undefined;
}

export async function createCmsArticle(input: ArticleWriteInput) {
  const id = `art-${crypto.randomUUID()}`;
  const { data, error } = await createSupabaseAdminClient().from("articles").insert(toRow(input, id)).select("*").single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function updateCmsArticle(id: string, input: ArticleWriteInput) {
  const { data, error } = await createSupabaseAdminClient().from("articles").update(toRow(input, id)).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function deleteCmsArticle(id: string) {
  const { error } = await createSupabaseAdminClient().from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
