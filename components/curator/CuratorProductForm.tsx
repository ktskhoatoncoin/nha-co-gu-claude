"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CuratedProduct, ProductSource, ProductStatus, productSources, productStatuses, statusLabels } from "@/lib/curator/types";
import { curatorCategories, curatorStyles } from "@/lib/curator/taxonomy";
import { GU_SCORE_WEIGHTS, computeGuScore, getGuTier, scoreDescriptions, scoreKeys, scoreLabels, tierStyles } from "@/lib/curator/scoring";
import { createProduct, updateProduct, ProductDraft } from "@/lib/curator/store";
import { Boxes, CircleCheck, Images, Leaf, Link2, Sparkles, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionLabel from "@/components/curator/SectionLabel";

function emptyDraft(): ProductDraft {
  return {
    name: "",
    categoryId: curatorCategories[0].id,
    subcategoryId: curatorCategories[0].subcategories[0]?.id ?? null,
    description: "",
    shortDescription: "",
    image: "",
    additionalImages: [],
    price: 0,
    originalPrice: null,
    currency: "VND",
    rating: 4.5,
    reviewCount: 0,
    soldCount: 0,
    shopName: "",
    source: "manual",
    productUrl: "",
    affiliateUrl: "",
    style: curatorStyles[0].id,
    styles: [curatorStyles[0].id],
    color: "",
    material: "",
    dimensions: {},
    scores: { visual: 70, style: 70, quality: 70, value: 70, editorial: 70 },
    editorNote: "",
    status: "DRAFT",
  };
}

function toDraft(product: CuratedProduct): ProductDraft {
  // id, slug, guScore, featured and timestamps are all derived by the store,
  // so the form never edits them directly.
  return {
    name: product.name,
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId,
    description: product.description,
    shortDescription: product.shortDescription,
    image: product.image,
    additionalImages: product.additionalImages,
    price: product.price,
    originalPrice: product.originalPrice,
    currency: product.currency,
    rating: product.rating,
    reviewCount: product.reviewCount,
    soldCount: product.soldCount,
    shopName: product.shopName,
    source: product.source,
    productUrl: product.productUrl,
    affiliateUrl: product.affiliateUrl,
    style: product.style,
    styles: product.styles,
    color: product.color,
    material: product.material,
    dimensions: product.dimensions,
    scores: product.scores,
    editorNote: product.editorNote,
    status: product.status,
  };
}

export default function CuratorProductForm({ product }: { product?: CuratedProduct }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProductDraft>(() => (product ? toDraft(product) : emptyDraft()));
  const [error, setError] = useState<string | null>(null);

  const guScore = useMemo(() => computeGuScore(draft.scores), [draft.scores]);
  const tier = getGuTier(guScore);
  const activeCategory = curatorCategories.find((c) => c.id === draft.categoryId);

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function toggleStyle(styleId: string) {
    setDraft((d) => {
      const next = d.styles.includes(styleId)
        ? d.styles.filter((s) => s !== styleId)
        : [...d.styles, styleId];
      // The primary style must always remain one of the selected styles.
      const primary = next.includes(d.style) ? d.style : (next[0] ?? "");
      return { ...d, styles: next, style: primary };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (draft.styles.length === 0) {
      setError("Chọn ít nhất một phong cách cho sản phẩm.");
      return;
    }
    setError(null);

    if (product) {
      updateProduct(product.id, draft);
      router.push(`/curator/products/${product.id}`);
    } else {
      const created = createProduct(draft);
      router.push(`/curator/products/${created.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_300px] items-start">
      <div className="min-w-0 space-y-12">
        <Section title="Product Information" icon={Boxes}>
          <Field label="Tên sản phẩm" required>
            <input required value={draft.name} onChange={(e) => set("name", e.target.value)} className="ncg-input" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Danh mục">
              <select
                value={draft.categoryId}
                onChange={(e) => {
                  const cat = curatorCategories.find((c) => c.id === e.target.value);
                  setDraft((d) => ({
                    ...d,
                    categoryId: e.target.value,
                    subcategoryId: cat?.subcategories[0]?.id ?? null,
                  }));
                }}
                className="ncg-input"
              >
                {curatorCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Danh mục phụ">
              <select
                value={draft.subcategoryId ?? ""}
                onChange={(e) => set("subcategoryId", e.target.value || null)}
                className="ncg-input"
              >
                <option value="">— Không chọn —</option>
                {activeCategory?.subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Mô tả ngắn" hint="Một câu, hiển thị trên card sản phẩm">
            <input
              value={draft.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              className="ncg-input"
            />
          </Field>
          <Field label="Mô tả đầy đủ">
            <textarea
              rows={4}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              className="ncg-input"
            />
          </Field>
        </Section>

        <Section title="Images" icon={Images}>
          <Field label="Ảnh chính (URL)">
            <input value={draft.image} onChange={(e) => set("image", e.target.value)} className="ncg-input" placeholder="https://..." />
          </Field>
          <Field label="Ảnh phụ" hint="Mỗi URL một dòng">
            <textarea
              rows={3}
              value={draft.additionalImages.join("\n")}
              onChange={(e) =>
                set("additionalImages", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
              }
              className="ncg-input"
            />
          </Field>
        </Section>

        <Section title="Commercial" icon={Tag}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Giá (VND)" required>
              <input
                type="number"
                required
                min={0}
                value={draft.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className="ncg-input"
              />
            </Field>
            <Field label="Giá gốc (VND)">
              <input
                type="number"
                min={0}
                value={draft.originalPrice ?? ""}
                onChange={(e) => set("originalPrice", e.target.value ? Number(e.target.value) : null)}
                className="ncg-input"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Rating (0–5)">
              <input
                type="number"
                step={0.1}
                min={0}
                max={5}
                value={draft.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
                className="ncg-input"
              />
            </Field>
            <Field label="Số đánh giá">
              <input
                type="number"
                min={0}
                value={draft.reviewCount}
                onChange={(e) => set("reviewCount", Number(e.target.value))}
                className="ncg-input"
              />
            </Field>
            <Field label="Đã bán">
              <input
                type="number"
                min={0}
                value={draft.soldCount}
                onChange={(e) => set("soldCount", Number(e.target.value))}
                className="ncg-input"
              />
            </Field>
          </div>
        </Section>

        <Section title="Source" icon={Link2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên shop / thương hiệu">
              <input value={draft.shopName} onChange={(e) => set("shopName", e.target.value)} className="ncg-input" />
            </Field>
            <Field label="Nguồn dữ liệu">
              <select
                value={draft.source}
                onChange={(e) => set("source", e.target.value as ProductSource)}
                className="ncg-input"
              >
                {productSources.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Product URL">
            <input value={draft.productUrl} onChange={(e) => set("productUrl", e.target.value)} className="ncg-input" placeholder="https://..." />
          </Field>
          <Field label="Affiliate URL" hint="Nhập thủ công — hệ thống không tự sinh link affiliate">
            <input value={draft.affiliateUrl} onChange={(e) => set("affiliateUrl", e.target.value)} className="ncg-input" placeholder="https://..." />
          </Field>
        </Section>

        <Section title="Style" icon={Leaf}>
          <Field label="Phong cách" hint="Chọn nhiều; phong cách chính được đánh dấu bên dưới">
            <div className="flex flex-wrap gap-1.5">
              {curatorStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStyle(s.id)}
                  aria-pressed={draft.styles.includes(s.id)}
                  className={`ncg-label rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    draft.styles.includes(s.id)
                      ? "border-wood bg-wood text-paper"
                      : "border-linen text-charcoal hover:border-wood"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </Field>

          {draft.styles.length > 0 && (
            <Field label="Phong cách chính">
              <select value={draft.style} onChange={(e) => set("style", e.target.value)} className="ncg-input">
                {draft.styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Màu sắc">
              <input value={draft.color} onChange={(e) => set("color", e.target.value)} className="ncg-input" />
            </Field>
            <Field label="Chất liệu">
              <input value={draft.material} onChange={(e) => set("material", e.target.value)} className="ncg-input" />
            </Field>
          </div>

          <Field label="Kích thước (cm)">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Rộng"
                value={draft.dimensions.width ?? ""}
                onChange={(e) =>
                  set("dimensions", { ...draft.dimensions, width: e.target.value ? Number(e.target.value) : undefined })
                }
                className="ncg-input"
                aria-label="Chiều rộng"
              />
              <input
                type="number"
                placeholder="Sâu"
                value={draft.dimensions.depth ?? ""}
                onChange={(e) =>
                  set("dimensions", { ...draft.dimensions, depth: e.target.value ? Number(e.target.value) : undefined })
                }
                className="ncg-input"
                aria-label="Chiều sâu"
              />
              <input
                type="number"
                placeholder="Cao"
                value={draft.dimensions.height ?? ""}
                onChange={(e) =>
                  set("dimensions", { ...draft.dimensions, height: e.target.value ? Number(e.target.value) : undefined })
                }
                className="ncg-input"
                aria-label="Chiều cao"
              />
            </div>
            <input
              placeholder="Ghi chú kích thước, ví dụ: đường kính 45cm"
              value={draft.dimensions.note ?? ""}
              onChange={(e) => set("dimensions", { ...draft.dimensions, note: e.target.value })}
              className="ncg-input mt-3"
              aria-label="Ghi chú kích thước"
            />
          </Field>
        </Section>

        <Section title="Curation" icon={Sparkles}>
          <div className="space-y-5">
            {scoreKeys.map((key) => (
              <div key={key}>
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={`score-${key}`} className="ncg-label text-sm text-charcoal">
                    {scoreLabels[key]} Score
                    <span className="ml-2 text-xs text-stone">
                      trọng số {Math.round(GU_SCORE_WEIGHTS[key] * 100)}%
                    </span>
                  </label>
                  <span className="ncg-h3 ncg-figure text-lg">{draft.scores[key]}</span>
                </div>
                <input
                  id={`score-${key}`}
                  type="range"
                  min={0}
                  max={100}
                  value={draft.scores[key]}
                  onChange={(e) => set("scores", { ...draft.scores, [key]: Number(e.target.value) })}
                  className="mt-1.5 w-full accent-wood"
                />
                <p className="mt-1 text-xs text-stone">{scoreDescriptions[key]}</p>
              </div>
            ))}
          </div>

          <Field
            label="Editor Note"
            hint="Vì sao Nhà Có Gu chọn sản phẩm này? Viết như đang tư vấn, có cả lý do nên mua và điểm cần lưu ý."
          >
            <textarea
              rows={5}
              value={draft.editorNote}
              onChange={(e) => set("editorNote", e.target.value)}
              className="ncg-input"
            />
          </Field>
        </Section>

        <Section title="Status" icon={CircleCheck}>
          <Field label="Trạng thái">
            <select
              value={draft.status}
              onChange={(e) => set("status", e.target.value as ProductStatus)}
              className="ncg-input"
            >
              {productStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]} ({s})
                </option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-stone">
            Sản phẩm chỉ xuất hiện trên website công khai khi ở trạng thái Đã duyệt hoặc Nổi bật.
          </p>
        </Section>
      </div>

      <aside className="lg:sticky lg:top-8 space-y-5">
        <div className="rounded-md border border-linen bg-ivory p-6">
          <SectionLabel icon={Sparkles} as="p" className="text-[11px] tracking-[0.18em]">GU Score</SectionLabel>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className={`ncg-h1 ncg-figure text-5xl leading-none ${tierStyles[tier]}`}>{guScore}</span>
            <span className="ncg-label text-base text-stone">/100</span>
          </p>
          <p className="ncg-label mt-2 text-sm text-charcoal">{tier}</p>

          <dl className="mt-5 space-y-2 border-t border-linen pt-4">
            {scoreKeys.map((key) => (
              <div key={key} className="flex justify-between text-xs">
                <dt className="ncg-label text-stone">{scoreLabels[key]}</dt>
                <dd className="ncg-price ncg-figure text-charcoal">{draft.scores[key]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-stone">Tổng điểm được tính tự động từ 5 tiêu chí trên.</p>
        </div>

        {error && (
          <p className="rounded-md border border-alert/40 bg-alert/5 px-4 py-3 text-sm text-alert">{error}</p>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="ncg-button rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-charcoal transition-colors"
          >
            {product ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="ncg-button rounded-full border border-linen px-6 py-3 text-sm hover:border-wood transition-colors"
          >
            Hủy
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .ncg-input {
          width: 100%;
          border: 1px solid var(--color-linen);
          border-radius: 0.375rem;
          padding: 0.6rem 0.85rem;
          font-size: 0.875rem;
          background: var(--color-paper);
          color: var(--color-charcoal);
        }
        .ncg-input:focus-visible {
          outline: 2px solid var(--color-wood);
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section>
      <SectionLabel icon={icon} as="h2" className="mb-5 border-b border-linen pb-3 text-[11px] tracking-[0.22em]">
        {title}
      </SectionLabel>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="ncg-label mb-1.5 block text-sm text-charcoal">
        {label}
        {required && <span className="ml-1 text-wood">*</span>}
      </span>
      {hint && <span className="mb-2 block text-xs text-stone">{hint}</span>}
      {children}
    </label>
  );
}
