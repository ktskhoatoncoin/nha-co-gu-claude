"use client";

import Image from "next/image";
import Link from "next/link";
import { CuratedProduct } from "@/lib/curator/types";
import { getCategoryName } from "@/lib/curator/taxonomy";
import { formatVND } from "@/lib/format";
import { setStatus } from "@/lib/curator/store";
import GuScoreDisplay from "@/components/curator/GuScoreDisplay";
import StatusPill from "@/components/curator/StatusPill";

export default function CuratorProductCard({
  product,
  view,
}: {
  product: CuratedProduct;
  view: "grid" | "list";
}) {
  const actions = (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link
        href={`/curator/products/${product.id}`}
        className="ncg-button rounded-full border border-linen px-3 py-1.5 text-xs hover:border-wood transition-colors"
      >
        Xem
      </Link>
      <Link
        href={`/curator/products/${product.id}/edit`}
        className="ncg-button rounded-full border border-linen px-3 py-1.5 text-xs hover:border-wood transition-colors"
      >
        Sửa
      </Link>
      {product.status !== "APPROVED" && product.status !== "FEATURED" && (
        <button
          type="button"
          onClick={() => setStatus(product.id, "APPROVED")}
          className="ncg-button rounded-full border border-moss/50 px-3 py-1.5 text-xs text-moss hover:bg-moss hover:text-paper transition-colors"
        >
          Duyệt
        </button>
      )}
      {product.status !== "FEATURED" && (
        <button
          type="button"
          onClick={() => setStatus(product.id, "FEATURED")}
          className="ncg-button rounded-full border border-ink px-3 py-1.5 text-xs hover:bg-ink hover:text-paper transition-colors"
        >
          Nổi bật
        </button>
      )}
      {product.status !== "REJECTED" && (
        <button
          type="button"
          onClick={() => setStatus(product.id, "REJECTED")}
          className="ncg-button rounded-full border border-alert/40 px-3 py-1.5 text-xs text-alert hover:bg-alert hover:text-paper transition-colors"
        >
          Loại
        </button>
      )}
    </div>
  );

  if (view === "list") {
    return (
      <div className="flex gap-5 border-b border-linen py-5">
        <Link href={`/curator/products/${product.id}`} className="shrink-0">
          <div className="relative size-24 overflow-hidden rounded-md border border-linen bg-ivory">
            <Image src={product.image} alt={product.name} fill sizes="96px" className="object-cover" />
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="ncg-eyebrow text-[11px] tracking-[0.14em]">
                {getCategoryName(product.categoryId)}
              </p>
              <Link href={`/curator/products/${product.id}`}>
                <h3 className="ncg-h3 mt-0.5 text-lg leading-snug hover:text-wood transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="ncg-label mt-1 text-xs text-stone">
                {product.styles.join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <GuScoreDisplay score={product.guScore} showTier={false} />
              <StatusPill status={product.status} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="ncg-price ncg-figure text-sm text-charcoal">
              {formatVND(product.price)}
              <span className="ncg-body-strong ml-3 text-xs text-stone">
                ★ {product.rating.toFixed(1)} · đã bán {product.soldCount.toLocaleString("vi-VN")}
              </span>
            </p>
            {actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col">
      <Link href={`/curator/products/${product.id}`}>
        <div className="relative aspect-4/5 overflow-hidden rounded-md border border-linen bg-ivory">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute left-2 top-2">
            <StatusPill status={product.status} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <p className="ncg-eyebrow text-[11px] tracking-[0.14em]">
          {getCategoryName(product.categoryId)}
        </p>
        <Link href={`/curator/products/${product.id}`}>
          <h3 className="ncg-h3 mt-1 text-lg leading-snug line-clamp-2 hover:text-wood transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="ncg-label mt-1.5 text-xs text-stone line-clamp-1">{product.styles.join(" · ")}</p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="ncg-price ncg-figure text-sm text-charcoal">{formatVND(product.price)}</p>
            <p className="ncg-body-strong ncg-figure mt-0.5 text-xs text-stone">
              ★ {product.rating.toFixed(1)} · {product.soldCount.toLocaleString("vi-VN")}
            </p>
          </div>
          <GuScoreDisplay score={product.guScore} showTier={false} />
        </div>

        <div className="mt-4 pt-3 border-t border-linen">{actions}</div>
      </div>
    </div>
  );
}
