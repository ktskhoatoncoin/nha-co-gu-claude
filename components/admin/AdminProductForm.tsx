"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Platform, ScoreBreakdown } from "@/lib/types";
import { categories } from "@/lib/data/categories";
import { rooms } from "@/lib/data/rooms";
import { styles } from "@/lib/data/styles";
import { createAdminProduct, updateAdminProduct, ProductFormValues } from "@/lib/admin/store";

const platforms: { value: Platform; label: string }[] = [
  { value: "shopee", label: "Shopee" },
  { value: "tiktok_shop", label: "TikTok Shop" },
  { value: "lazada", label: "Lazada" },
  { value: "brand", label: "Brand" },
  { value: "other", label: "Khác" },
];

const scoreKeys: (keyof ScoreBreakdown)[] = ["design", "price", "function", "material", "value", "content"];
const scoreLabels: Record<keyof ScoreBreakdown, string> = {
  design: "Thiết kế",
  price: "Giá",
  function: "Công năng",
  material: "Chất liệu",
  value: "Đáng tiền",
  content: "Nội dung",
};

function toFormValues(p?: Product): ProductFormValues {
  return {
    name: p?.name ?? "",
    description: p?.description ?? "",
    shortDescription: p?.shortDescription ?? "",
    categoryId: p?.categoryId ?? categories[0].id,
    subcategory: p?.subcategory ?? "",
    roomIds: p?.roomIds ?? [],
    styleIds: p?.styleIds ?? [],
    price: p?.price ?? 0,
    originalPrice: p?.originalPrice ?? null,
    platform: p?.platform ?? "shopee",
    merchantName: p?.merchantName ?? "",
    affiliateUrl: p?.affiliateUrl ?? "https://example.com/affiliate/demo",
    commissionRate: p?.commissionRate ?? 8,
    rating: p?.rating ?? 4.5,
    reviewCount: p?.reviewCount ?? 0,
    soldCount: p?.soldCount ?? 0,
    scores: p?.scores ?? { design: 7, price: 7, function: 7, material: 7, value: 7, content: 7 },
    badges: p?.badges ?? [],
    isFeatured: p?.isFeatured ?? false,
    isHero: p?.isHero ?? false,
    isActive: p?.isActive ?? true,
  };
}

export default function AdminProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product));
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleMulti(key: "roomIds" | "styleIds", id: string) {
    setValues((v) => ({
      ...v,
      [key]: v[key].includes(id) ? v[key].filter((x) => x !== id) : [...v[key], id],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (product) {
      updateAdminProduct(product.id, values);
    } else {
      createAdminProduct(values);
    }
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-ink mb-1">Cơ bản</legend>
        <Field label="Tên sản phẩm">
          <input required value={values.name} onChange={(e) => update("name", e.target.value)} className="input" />
        </Field>
        <Field label="Mô tả ngắn">
          <input
            required
            value={values.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Nhà Có Gu nhận xét (mô tả đầy đủ)">
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nhóm sản phẩm">
            <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Loại sản phẩm (subcategory)">
            <input value={values.subcategory} onChange={(e) => update("subcategory", e.target.value)} className="input" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-ink mb-1">Phân loại</legend>
        <Field label="Phòng">
          <div className="flex flex-wrap gap-2">
            {rooms.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => toggleMulti("roomIds", r.id)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  values.roomIds.includes(r.id) ? "border-wood bg-wood text-paper" : "border-linen"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Phong cách">
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleMulti("styleIds", s.id)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  values.styleIds.includes(s.id) ? "border-wood bg-wood text-paper" : "border-linen"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </Field>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-ink mb-1">Thương mại</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Giá (VND)">
            <input
              type="number"
              required
              value={values.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Giá gốc (tuỳ chọn)">
            <input
              type="number"
              value={values.originalPrice ?? ""}
              onChange={(e) => update("originalPrice", e.target.value ? Number(e.target.value) : null)}
              className="input"
            />
          </Field>
          <Field label="Nền tảng">
            <select value={values.platform} onChange={(e) => update("platform", e.target.value as Platform)} className="input">
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Merchant">
            <input value={values.merchantName} onChange={(e) => update("merchantName", e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Affiliate URL">
          <input
            required
            value={values.affiliateUrl}
            onChange={(e) => update("affiliateUrl", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Hoa hồng (%)">
          <input
            type="number"
            value={values.commissionRate}
            onChange={(e) => update("commissionRate", Number(e.target.value))}
            className="input w-32"
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-ink mb-1">Hiệu năng</legend>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Rating">
            <input
              type="number"
              step="0.1"
              max={5}
              value={values.rating}
              onChange={(e) => update("rating", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Số đánh giá">
            <input
              type="number"
              value={values.reviewCount}
              onChange={(e) => update("reviewCount", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Đã bán">
            <input
              type="number"
              value={values.soldCount}
              onChange={(e) => update("soldCount", Number(e.target.value))}
              className="input"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-ink mb-1">Điểm Nhà Có Gu</legend>
        <div className="grid grid-cols-3 gap-3">
          {scoreKeys.map((key) => (
            <Field key={key} label={scoreLabels[key]}>
              <input
                type="number"
                min={0}
                max={10}
                value={values.scores[key]}
                onChange={(e) => update("scores", { ...values.scores, [key]: Number(e.target.value) })}
                className="input"
              />
            </Field>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg text-ink mb-1">Xuất bản</legend>
        <div className="flex flex-wrap gap-5">
          <Checkbox label="Đang hoạt động" checked={values.isActive} onChange={(v) => update("isActive", v)} />
          <Checkbox label="Nổi bật (Featured)" checked={values.isFeatured} onChange={(v) => update("isFeatured", v)} />
          <Checkbox label="Hero" checked={values.isHero} onChange={(v) => update("isHero", v)} />
        </div>
      </fieldset>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="rounded-full bg-ink text-paper px-6 py-3 text-sm">
          {product ? "Lưu thay đổi" : "Tạo sản phẩm"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-linen px-6 py-3 text-sm"
        >
          Hủy
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-linen);
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: var(--color-paper);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-stone mb-1">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-wood" />
      {label}
    </label>
  );
}
