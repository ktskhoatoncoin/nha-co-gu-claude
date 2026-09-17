"use client";

import { Article } from "@/lib/types";
import { ArticleStatus } from "@/lib/cms/articles";

export interface ArticleFormValues {
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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? "Không thể hoàn thành thao tác.");
  return body as T;
}

export function getAdminArticles() {
  return request<(Article & { status: ArticleStatus })[]>("/api/admin/articles", { cache: "no-store" });
}

export function createAdminArticle(values: ArticleFormValues) {
  return request<Article>("/api/admin/articles", { method: "POST", body: JSON.stringify(values) });
}

export function updateAdminArticle(id: string, values: ArticleFormValues) {
  return request<Article>(`/api/admin/articles/${id}`, { method: "PUT", body: JSON.stringify(values) });
}

export function deleteAdminArticle(id: string) {
  return request<void>(`/api/admin/articles/${id}`, { method: "DELETE" });
}
