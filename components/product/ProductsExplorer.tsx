"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { getActiveProducts } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { rooms } from "@/lib/data/rooms";
import { styles } from "@/lib/data/styles";
import { budgetTiers } from "@/lib/data/styles";
import ProductGrid from "@/components/ui/ProductGrid";
import { trackSearch } from "@/lib/analytics";

const sortOptions = [
  { key: "nha-co-gu-chon", label: "Nhà Có Gu chọn" },
  { key: "dang-tien", label: "Đáng tiền" },
  { key: "gia-thap", label: "Giá thấp → cao" },
  { key: "gia-cao", label: "Giá cao → thấp" },
  { key: "rating", label: "Rating" },
  { key: "pho-bien", label: "Phổ biến" },
];

const allProducts = getActiveProducts();

export default function ProductsExplorer() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [styleId, setStyleId] = useState<string>("");
  const [budgetId, setBudgetId] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(0);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "nha-co-gu-chon");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = allProducts.slice();

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (roomId) list = list.filter((p) => p.roomIds.includes(roomId));
    if (styleId) list = list.filter((p) => p.styleIds.includes(styleId));
    if (platform) list = list.filter((p) => p.platform === platform);
    if (minScore > 0) list = list.filter((p) => p.ourScore >= minScore);
    if (budgetId) {
      const tier = budgetTiers.find((b) => b.id === budgetId);
      if (tier) list = list.filter((p) => p.price >= tier.min && (tier.max === null || p.price < tier.max));
    }

    switch (sort) {
      case "dang-tien":
        list.sort((a, b) => b.scores.value - a.scores.value);
        break;
      case "gia-thap":
        list.sort((a, b) => a.price - b.price);
        break;
      case "gia-cao":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "pho-bien":
        list.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        list.sort((a, b) => b.ourScore - a.ourScore);
    }

    return list;
  }, [query, categoryId, roomId, styleId, budgetId, platform, minScore, sort]);

  function handleSearchBlur() {
    if (query.trim()) trackSearch(query.trim(), filtered.length);
  }

  function resetFilters() {
    setCategoryId("");
    setRoomId("");
    setStyleId("");
    setBudgetId("");
    setPlatform("");
    setMinScore(0);
  }

  const hasActiveFilters = categoryId || roomId || styleId || budgetId || platform || minScore > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="lg:hidden flex items-center justify-between">
        <input
          type="search"
          placeholder="Tìm sản phẩm, danh mục, phòng..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleSearchBlur}
          className="flex-1 rounded-full border border-linen bg-paper px-4 py-2.5 text-sm mr-3"
        />
        <button
          type="button"
          onClick={() => setShowFilters(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink px-4 py-2.5 text-sm"
        >
          <SlidersHorizontal className="size-4" /> Lọc
        </button>
      </div>

      <aside
        className={`${
          showFilters ? "fixed inset-0 z-50 bg-paper p-5 overflow-y-auto" : "hidden"
        } lg:block lg:static lg:p-0 lg:bg-transparent`}
      >
        {showFilters && (
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="font-display text-lg">Bộ lọc</h2>
            <button type="button" onClick={() => setShowFilters(false)} aria-label="Đóng bộ lọc">
              <X className="size-6" />
            </button>
          </div>
        )}

        <div className="hidden lg:block mb-6">
          <input
            type="search"
            placeholder="Tìm sản phẩm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={handleSearchBlur}
            className="w-full rounded-full border border-linen bg-paper px-4 py-2.5 text-sm"
          />
        </div>

        <FilterGroup label="Nhóm sản phẩm">
          <SelectPills
            value={categoryId}
            onChange={setCategoryId}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </FilterGroup>

        <FilterGroup label="Phòng">
          <SelectPills value={roomId} onChange={setRoomId} options={rooms.map((r) => ({ value: r.id, label: r.name }))} />
        </FilterGroup>

        <FilterGroup label="Phong cách">
          <SelectPills value={styleId} onChange={setStyleId} options={styles.map((s) => ({ value: s.id, label: s.name }))} />
        </FilterGroup>

        <FilterGroup label="Ngân sách">
          <SelectPills
            value={budgetId}
            onChange={setBudgetId}
            options={budgetTiers.map((b) => ({ value: b.id, label: b.name }))}
          />
        </FilterGroup>

        <FilterGroup label="Nền tảng">
          <SelectPills
            value={platform}
            onChange={setPlatform}
            options={[
              { value: "shopee", label: "Shopee" },
              { value: "tiktok_shop", label: "TikTok Shop" },
              { value: "lazada", label: "Lazada" },
              { value: "brand", label: "Website thương hiệu" },
            ]}
          />
        </FilterGroup>

        <FilterGroup label="Điểm Nhà Có Gu tối thiểu">
          <input
            type="range"
            min={0}
            max={9}
            step={1}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-wood"
          />
          <p className="text-sm text-stone mt-1">{minScore > 0 ? `Từ ${minScore}/10` : "Tất cả"}</p>
        </FilterGroup>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters} className="text-sm text-wood underline underline-offset-2">
            Xóa bộ lọc
          </button>
        )}

        {showFilters && (
          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="lg:hidden mt-6 w-full rounded-full bg-ink text-paper py-3 text-sm"
          >
            Xem {filtered.length} kết quả
          </button>
        )}
      </aside>

      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-stone">{filtered.length} sản phẩm</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-linen bg-paper px-3 py-2 text-sm"
            aria-label="Sắp xếp theo"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-ink mb-2.5">{label}</h3>
      {children}
    </div>
  );
}

function SelectPills({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(value === o.value ? "" : o.value)}
          aria-pressed={value === o.value}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            value === o.value ? "border-wood bg-wood text-paper" : "border-linen text-charcoal hover:border-wood"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
