"use client";

import Link from "next/link";
import { Inbox, LayoutDashboard, Star } from "lucide-react";
import SectionLabel from "@/components/curator/SectionLabel";
import { useCuratorProducts } from "@/lib/curator/useCuratorProducts";
import { ProductStatus, statusLabels } from "@/lib/curator/types";
import { getGuTier, tierStyles } from "@/lib/curator/scoring";
import { getCategoryName } from "@/lib/curator/taxonomy";
import { formatVND } from "@/lib/format";
import GuScoreDisplay from "@/components/curator/GuScoreDisplay";
import StatusPill from "@/components/curator/StatusPill";

const pipeline: ProductStatus[] = ["DRAFT", "REVIEW", "APPROVED", "FEATURED", "REJECTED"];

export default function CuratorDashboardPage() {
  const products = useCuratorProducts();

  const count = (status: ProductStatus) => products.filter((p) => p.status === status).length;
  const scored = products.filter((p) => p.guScore > 0);
  const averageScore = scored.length
    ? Math.round(scored.reduce((sum, p) => sum + p.guScore, 0) / scored.length)
    : 0;

  const needsAttention = products
    .filter((p) => p.status === "REVIEW" || p.status === "DRAFT")
    .sort((a, b) => b.guScore - a.guScore)
    .slice(0, 5);

  const topScoring = [...products]
    .filter((p) => p.status === "APPROVED" || p.status === "FEATURED")
    .sort((a, b) => b.guScore - a.guScore)
    .slice(0, 5);

  return (
    <div>
      <header className="border-b border-linen pb-10">
        <SectionLabel icon={LayoutDashboard} as="p" className="text-[11px] tracking-[0.22em]">
          Tổng quan
        </SectionLabel>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="ncg-h1 ncg-figure text-5xl leading-none">
            {products.length.toLocaleString("vi-VN")}
            <span className="ncg-body-strong ml-3 text-lg text-stone">sản phẩm trong hệ thống</span>
          </h1>
          <div className="text-right">
            <p className="ncg-eyebrow text-[11px] tracking-[0.18em]">GU Score trung bình</p>
            <p className={`ncg-h2 ncg-figure text-3xl leading-none mt-1 ${tierStyles[getGuTier(averageScore)]}`}>
              {averageScore}
              <span className="ncg-label text-sm text-stone">/100</span>
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b border-linen">
        {pipeline.map((status) => (
          <Link
            key={status}
            href={`/curator/products?status=${status}`}
            className="group border-r border-linen last:border-r-0 px-5 py-8 hover:bg-ivory transition-colors"
          >
            <p className="ncg-h1 ncg-figure text-4xl leading-none group-hover:text-wood transition-colors">
              {count(status)}
            </p>
            <p className="ncg-eyebrow mt-2 text-[11px] tracking-[0.16em]">{statusLabels[status]}</p>
          </Link>
        ))}
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="ncg-h2 flex items-center gap-2 text-xl">
              <Inbox aria-hidden="true" className="size-[0.8em] text-wood" />
              Cần xử lý
            </h2>
            <Link href="/curator/products?status=REVIEW" className="ncg-button text-sm text-wood hover:underline">
              Xem tất cả
            </Link>
          </div>
          {needsAttention.length === 0 ? (
            <p className="ncg-body-strong text-sm text-stone border border-dashed border-linen rounded-md py-10 text-center">
              Không còn sản phẩm nào chờ duyệt.
            </p>
          ) : (
            <ul className="divide-y divide-linen border-y border-linen">
              {needsAttention.map((p) => (
                <li key={p.id}>
                  <Link href={`/curator/products/${p.id}`} className="flex items-center gap-4 py-4 group">
                    <div className="min-w-0 flex-1">
                      <p className="ncg-body-strong truncate text-sm text-charcoal group-hover:text-wood transition-colors">
                        {p.name}
                      </p>
                      <p className="ncg-label ncg-figure mt-1 text-xs text-stone">
                        {getCategoryName(p.categoryId)} · {formatVND(p.price)}
                      </p>
                    </div>
                    <GuScoreDisplay score={p.guScore} size="sm" />
                    <StatusPill status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="ncg-h2 flex items-center gap-2 text-xl">
              <Star aria-hidden="true" className="size-[0.8em] text-wood" />
              GU Score cao nhất
            </h2>
            <Link href="/curator/products?sort=score-desc" className="ncg-button text-sm text-wood hover:underline">
              Xem tất cả
            </Link>
          </div>
          <ul className="divide-y divide-linen border-y border-linen">
            {topScoring.map((p) => (
              <li key={p.id}>
                <Link href={`/curator/products/${p.id}`} className="flex items-center gap-4 py-4 group">
                  <div className="min-w-0 flex-1">
                    <p className="ncg-body-strong truncate text-sm text-charcoal group-hover:text-wood transition-colors">
                      {p.name}
                    </p>
                    <p className="ncg-label mt-1 text-xs text-stone">
                      {p.style} · {getGuTier(p.guScore)}
                    </p>
                  </div>
                  <GuScoreDisplay score={p.guScore} size="sm" />
                  <StatusPill status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-14 flex flex-wrap gap-3 border-t border-linen pt-8">
        <Link href="/curator/products/new" className="ncg-button rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-charcoal transition-colors">
          Thêm sản phẩm
        </Link>
        <Link href="/curator/products" className="ncg-button rounded-full border border-linen px-6 py-3 text-sm hover:border-wood transition-colors">
          Duyệt Product Database
        </Link>
      </div>
    </div>
  );
}
