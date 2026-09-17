"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleCheck, LayoutGrid, LayoutPanelLeft, Leaf, Link2, List, Star, Tag, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionLabel from "@/components/curator/SectionLabel";
import { useCuratorProducts } from "@/lib/curator/useCuratorProducts";
import { curatorCategories, curatorStyles, getCategoryName } from "@/lib/curator/taxonomy";
import { ProductStatus, productSources, productStatuses, statusLabels } from "@/lib/curator/types";
import CuratorProductCard from "@/components/curator/CuratorProductCard";

const sortOptions = [
  { key: "newest", label: "Mới nhất" },
  { key: "oldest", label: "Cũ nhất" },
  { key: "price-asc", label: "Giá thấp → cao" },
  { key: "price-desc", label: "Giá cao → thấp" },
  { key: "score-desc", label: "GU Score cao → thấp" },
  { key: "rating-desc", label: "Rating cao → thấp" },
  { key: "sold-desc", label: "Bán chạy nhất" },
];

const priceBands = [
  { key: "under-1m", label: "Dưới 1 triệu", min: 0, max: 1000000 },
  { key: "1m-5m", label: "1 – 5 triệu", min: 1000000, max: 5000000 },
  { key: "5m-10m", label: "5 – 10 triệu", min: 5000000, max: 10000000 },
  { key: "over-10m", label: "Trên 10 triệu", min: 10000000, max: Infinity },
];

const scoreBands = [
  { key: "90", label: "90+ Exceptional", min: 90 },
  { key: "80", label: "80+ Highly Recommended", min: 80 },
  { key: "70", label: "70+ Good", min: 70 },
];

export default function CuratorProductExplorer() {
  const searchParams = useSearchParams();
  const products = useCuratorProducts();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>(searchParams.get("status") ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [style, setStyle] = useState("");
  const [priceBand, setPriceBand] = useState("");
  const [scoreBand, setScoreBand] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [source, setSource] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let list = products.slice();

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shopName.toLowerCase().includes(q) ||
          getCategoryName(p.categoryId).toLowerCase().includes(q) ||
          p.styles.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (status) list = list.filter((p) => p.status === status);
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (style) list = list.filter((p) => p.styles.includes(style));
    if (source) list = list.filter((p) => p.source === source);
    if (featuredOnly) list = list.filter((p) => p.featured);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);

    if (priceBand) {
      const band = priceBands.find((b) => b.key === priceBand);
      if (band) list = list.filter((p) => p.price >= band.min && p.price < band.max);
    }

    if (scoreBand) {
      const band = scoreBands.find((b) => b.key === scoreBand);
      if (band) list = list.filter((p) => p.guScore >= band.min);
    }

    switch (sort) {
      case "oldest":
        list.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "score-desc":
        list.sort((a, b) => b.guScore - a.guScore);
        break;
      case "rating-desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "sold-desc":
        list.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    return list;
  }, [products, query, status, categoryId, style, source, featuredOnly, minRating, priceBand, scoreBand, sort]);

  const hasFilters = status || categoryId || style || priceBand || scoreBand || source || featuredOnly || minRating > 0;

  function resetFilters() {
    setStatus("");
    setCategoryId("");
    setStyle("");
    setPriceBand("");
    setScoreBand("");
    setSource("");
    setFeaturedOnly(false);
    setMinRating(0);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-linen pb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên, shop, danh mục hoặc phong cách..."
          className="ncg-body-strong min-w-0 flex-1 rounded-full border border-linen bg-paper px-5 py-2.5 text-sm"
          aria-label="Tìm kiếm sản phẩm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ncg-label rounded-full border border-linen bg-paper px-4 py-2.5 text-sm"
          aria-label="Sắp xếp"
        >
          {sortOptions.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="flex rounded-full border border-linen p-0.5" role="group" aria-label="Kiểu hiển thị">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            aria-label="Dạng lưới"
            className={`rounded-full p-2 transition-colors ${view === "grid" ? "bg-ink text-paper" : "text-stone"}`}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            aria-label="Dạng danh sách"
            className={`rounded-full p-2 transition-colors ${view === "list" ? "bg-ink text-paper" : "text-stone"}`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[230px_1fr] pt-8">
        <aside>
          <FilterGroup label="Trạng thái" icon={CircleCheck}>
            <Pills
              value={status}
              onChange={setStatus}
              options={productStatuses.map((s: ProductStatus) => ({ value: s, label: statusLabels[s] }))}
            />
          </FilterGroup>

          <FilterGroup label="Danh mục" icon={LayoutPanelLeft}>
            <Pills
              value={categoryId}
              onChange={setCategoryId}
              options={curatorCategories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </FilterGroup>

          <FilterGroup label="Phong cách" icon={Leaf}>
            <Pills
              value={style}
              onChange={setStyle}
              options={curatorStyles.map((s) => ({ value: s.id, label: s.name }))}
            />
          </FilterGroup>

          <FilterGroup label="Giá" icon={Tag}>
            <Pills
              value={priceBand}
              onChange={setPriceBand}
              options={priceBands.map((b) => ({ value: b.key, label: b.label }))}
            />
          </FilterGroup>

          <FilterGroup label="GU Score" icon={Star}>
            <Pills
              value={scoreBand}
              onChange={setScoreBand}
              options={scoreBands.map((b) => ({ value: b.key, label: b.label }))}
            />
          </FilterGroup>

          <FilterGroup label="Nguồn" icon={Link2}>
            <Pills
              value={source}
              onChange={setSource}
              options={productSources.map((s) => ({ value: s.value, label: s.label }))}
            />
          </FilterGroup>

          <FilterGroup label="Rating tối thiểu" icon={Star}>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-wood"
            />
            <p className="ncg-label mt-1 text-xs text-stone">{minRating > 0 ? `Từ ${minRating} sao` : "Tất cả"}</p>
          </FilterGroup>

          <label className="ncg-label flex items-center gap-2 text-sm mb-6">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="accent-wood"
            />
            Chỉ sản phẩm nổi bật
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ncg-button inline-flex items-center gap-1.5 text-sm text-wood hover:underline"
            >
              <X className="size-3.5" /> Xóa bộ lọc
            </button>
          )}
        </aside>

        <div className="min-w-0">
          <p className="ncg-label ncg-figure mb-6 text-sm text-stone">{filtered.length} sản phẩm</p>

          {filtered.length === 0 ? (
            <div className="rounded-md border border-dashed border-linen py-20 text-center">
              <p className="text-stone">Không có sản phẩm nào khớp với bộ lọc hiện tại.</p>
              {hasFilters && (
                <button type="button" onClick={resetFilters} className="ncg-button mt-3 text-sm text-wood hover:underline">
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <CuratorProductCard key={p.id} product={p} view="grid" />
              ))}
            </div>
          ) : (
            <div className="border-t border-linen">
              {filtered.map((p) => (
                <CuratorProductCard key={p.id} product={p} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <SectionLabel icon={icon} className="mb-2.5 text-[11px]">
        {label}
      </SectionLabel>
      {children}
    </div>
  );
}

function Pills({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(value === o.value ? "" : o.value)}
          aria-pressed={value === o.value}
          className={`ncg-label rounded-full border px-2.5 py-1 text-xs transition-colors ${
            value === o.value ? "border-wood bg-wood text-paper" : "border-linen text-charcoal hover:border-wood"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
