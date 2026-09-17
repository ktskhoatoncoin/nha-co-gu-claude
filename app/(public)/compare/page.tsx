"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCompare, MAX_COMPARE } from "@/lib/hooks/useCompare";
import { getActiveProducts } from "@/lib/data/products";
import { formatVND, platformLabels } from "@/lib/format";
import AffiliateButton from "@/components/product/AffiliateButton";

const allProducts = getActiveProducts();

export default function ComparePage() {
  const { ids, toggle, clear } = useCompare();
  const products = ids.map((id) => allProducts.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">So sánh sản phẩm</h1>
        <p className="text-stone mb-6">
          Chưa có sản phẩm nào để so sánh. Chọn tối đa {MAX_COMPARE} sản phẩm ở trang danh sách hoặc trang chi tiết.
        </p>
        <Link href="/products" className="inline-block rounded-full bg-ink text-paper px-6 py-3 text-sm">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const rows: { label: string; render: (p: (typeof products)[number]) => React.ReactNode }[] = [
    { label: "Giá", render: (p) => formatVND(p.price) },
    { label: "Rating", render: (p) => `★ ${p.rating.toFixed(1)} (${p.reviewCount})` },
    { label: "Điểm Nhà Có Gu", render: (p) => `${p.ourScore}/10` },
    { label: "Thiết kế", render: (p) => `${p.scores.design}/10` },
    { label: "Công năng", render: (p) => `${p.scores.function}/10` },
    { label: "Chất liệu", render: (p) => `${p.scores.material}/10` },
    { label: "Đáng tiền", render: (p) => `${p.scores.value}/10` },
    { label: "Nền tảng", render: (p) => platformLabels[p.platform] },
  ];

  return (
    <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">So sánh sản phẩm</h1>
        <button type="button" onClick={clear} className="text-sm text-wood underline underline-offset-2">
          Xóa tất cả
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-4 min-w-[640px]" style={{ gridTemplateColumns: `160px repeat(${products.length}, 1fr)` }}>
          <div />
          {products.map((p) => (
            <div key={p.id} className="relative">
              <button
                type="button"
                onClick={() => toggle(p.id)}
                aria-label="Bỏ khỏi so sánh"
                className="absolute right-2 top-2 z-10 rounded-full bg-paper/90 p-1.5"
              >
                <X className="size-4" />
              </button>
              <div className="relative aspect-square rounded-md overflow-hidden border border-linen bg-ivory">
                <Image src={p.imageUrl} alt={p.name} fill sizes="25vw" className="object-cover" />
              </div>
              <Link href={`/product/${p.slug}`} className="mt-2 block font-medium text-sm line-clamp-2 hover:text-wood">
                {p.name}
              </Link>
            </div>
          ))}

          {rows.map((row) => (
            <div key={row.label} className="contents">
              <div className="py-3 text-sm text-stone border-t border-linen">{row.label}</div>
              {products.map((p) => (
                <div key={p.id} className="py-3 text-sm text-charcoal border-t border-linen">
                  {row.render(p)}
                </div>
              ))}
            </div>
          ))}

          <div className="py-3 border-t border-linen" />
          {products.map((p) => (
            <div key={p.id} className="py-3 border-t border-linen">
              <AffiliateButton product={p} page="/compare" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
