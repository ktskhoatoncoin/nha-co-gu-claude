"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Scale, Star } from "lucide-react";
import { Badge, Product } from "@/lib/types";
import { categories } from "@/lib/data/categories";
import { formatVND, getDisplayOriginalPrice } from "@/lib/format";
import BadgeChip from "@/components/ui/BadgeChip";
import ScorePill from "@/components/ui/ScorePill";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCompare } from "@/lib/hooks/useCompare";

export default function ProductCard({ product, hiddenBadge }: { product: Product; hiddenBadge?: Badge }) {
  const category = categories.find((c) => c.id === product.categoryId);
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const { isInCompare, toggle: toggleCompare, isFull } = useCompare();
  const saved = isSaved(product.id);
  const compared = isInCompare(product.id);
  const hasValidPrice = Number.isFinite(product.price) && product.price > 0;
  const displayOriginalPrice = getDisplayOriginalPrice(product.price, product.originalPrice);

  return (
    <div className="ncg-product-card group relative flex h-full flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden rounded-md border border-linen bg-ivory">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 48vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
          {product.badges.filter((badge) => badge !== hiddenBadge).length > 0 && (
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {product.badges.filter((badge) => badge !== hiddenBadge).map((b) => (
                <BadgeChip key={b} badge={b} />
              ))}
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={saved}
        aria-label={saved ? "Bỏ lưu sản phẩm" : "Lưu sản phẩm"}
        className="absolute right-2 top-2 rounded-full bg-paper/90 p-2 text-charcoal shadow-sm transition-colors hover:text-wood"
      >
        <Heart className={`size-4 ${saved ? "fill-wood text-wood" : ""}`} />
      </button>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        {category && <p className="ncg-eyebrow text-xs tracking-wide">{category.name}</p>}
        <Link href={`/product/${product.slug}`}>
          <h3 className="ncg-h3 font-body tracking-normal text-charcoal leading-[1.45] line-clamp-2 hover:text-wood transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="min-h-[3rem] text-sm leading-[1.5] text-stone">{product.shortDescription}</p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="ncg-h3 ncg-figure font-body text-lg leading-[1.4]">
              {hasValidPrice ? formatVND(product.price) : "Chưa cập nhật"}
            </span>
            {displayOriginalPrice !== null && (
              <span className="text-xs text-stone line-through">{formatVND(displayOriginalPrice)}</span>
            )}
          </div>
          <ScorePill score={product.ourScore} />
        </div>

        {product.rating > 0 && product.reviewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-stone pt-0.5">
            <Star className="size-3.5 fill-wood text-wood" />
            <span>{product.rating.toFixed(1)}</span>
            <span aria-hidden>·</span>
            <span>{product.reviewCount} đánh giá</span>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link
            href={`/product/${product.slug}`}
            className="ncg-button flex-1 text-center rounded-full border border-ink px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Xem sản phẩm
          </Link>
          <button
            type="button"
            onClick={() => toggleCompare(product.id)}
            disabled={!compared && isFull}
            aria-pressed={compared}
            aria-label={compared ? "Bỏ khỏi so sánh" : "Thêm vào so sánh"}
            title={!compared && isFull ? "Chỉ so sánh tối đa 3 sản phẩm" : undefined}
            className={`shrink-0 rounded-full border p-2.5 transition-colors ${
              compared ? "border-wood bg-wood text-paper" : "border-linen text-charcoal hover:border-wood"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Scale className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
