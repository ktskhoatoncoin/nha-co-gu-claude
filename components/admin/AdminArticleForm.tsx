"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/lib/types";
import { ArticleFormValues, createAdminArticle, updateAdminArticle } from "@/lib/admin/articles";
import { ArticleStatus } from "@/lib/cms/articles";

function toValues(article?: Article & { status?: ArticleStatus }): ArticleFormValues {
  return {
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    coverImage: article?.coverImage ?? "",
    author: article?.author ?? "Đội ngũ Nhà Có Gu",
    readingTimeMinutes: article?.readingTimeMinutes ?? 5,
    category: article?.category ?? "Góc kiến trúc sư",
    content: article?.content ?? [],
    relatedProductSlugs: article?.relatedProductSlugs ?? [],
    hasAffiliateLinks: article?.hasAffiliateLinks ?? false,
    status: article?.status ?? "draft",
  };
}

function contentToText(content: Article["content"]) {
  return content.map((block) => block.type === "list" ? block.items.map((item) => `- ${item}`).join("\n") : block.text).join("\n\n");
}

function textToContent(text: string): Article["content"] {
  const blocks: Article["content"] = [];
  text.split(/\n\s*\n/).forEach((part) => {
    const lines = part.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;
    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({ type: "list", items: lines.map((line) => line.slice(2)) });
    } else if (part.trim().startsWith("# ")) {
      blocks.push({ type: "heading", text: part.trim().slice(2) });
    } else {
      blocks.push({ type: "paragraph", text: part.trim() });
    }
  });
  return blocks;
}

export default function AdminArticleForm({ article }: { article?: Article & { status?: ArticleStatus } }) {
  const router = useRouter();
  const [values, setValues] = useState<ArticleFormValues>(() => toValues(article));
  const [content, setContent] = useState(() => contentToText(article?.content ?? []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const update = <K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) => setValues((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const input = { ...values, content: textToContent(content) };
    try {
      if (article) await updateAdminArticle(article.id, input);
      else await createAdminArticle(input);
      router.push("/admin/articles");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu bài viết.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <Field label="Tiêu đề"><input required className="input" value={values.title} onChange={(event) => update("title", event.target.value)} /></Field>
      <Field label="Ảnh đại diện (URL)"><input required type="url" className="input" value={values.coverImage} onChange={(event) => update("coverImage", event.target.value)} /></Field>
      <Field label="Mô tả ngắn"><textarea required rows={3} className="input" value={values.excerpt} onChange={(event) => update("excerpt", event.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Chuyên mục"><input required className="input" value={values.category} onChange={(event) => update("category", event.target.value)} /></Field>
        <Field label="Thời gian đọc (phút)"><input required type="number" min={1} className="input" value={values.readingTimeMinutes} onChange={(event) => update("readingTimeMinutes", Number(event.target.value))} /></Field>
      </div>
      <Field label="Nội dung"><textarea required rows={18} className="input" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Mỗi đoạn cách nhau một dòng trống. Dòng bắt đầu bằng - sẽ thành danh sách; # sẽ thành tiêu đề." /></Field>
      <Field label="Trạng thái"><select className="input" value={values.status} onChange={(event) => update("status", event.target.value as ArticleStatus)}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option><option value="hidden">Ẩn</option></select></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={values.hasAffiliateLinks} onChange={(event) => update("hasAffiliateLinks", event.target.checked)} className="accent-wood" /> Có liên kết affiliate</label>
      {error && <p className="text-sm text-alert">{error}</p>}
      <div className="flex gap-3"><button disabled={saving} className="rounded-full bg-ink text-paper px-6 py-3 text-sm">{saving ? "Đang lưu..." : article ? "Lưu thay đổi" : "Lưu bài viết"}</button><button type="button" onClick={() => router.push("/admin/articles")} className="rounded-full border border-linen px-6 py-3 text-sm">Hủy</button></div>
      <style jsx global>{`.input { width: 100%; border: 1px solid var(--color-linen); border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; background: var(--color-paper); }`}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs text-stone mb-1">{label}</span>{children}</label>;
}
