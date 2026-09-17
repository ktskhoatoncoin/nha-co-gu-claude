"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useCuratorProducts } from "@/lib/curator/useCuratorProducts";
import { getCategoryName, getSubcategory } from "@/lib/curator/taxonomy";
import { GU_SCORE_WEIGHTS, scoreKeys, scoreLabels } from "@/lib/curator/scoring";
import { productSources, statusLabels } from "@/lib/curator/types";
import { setStatus, deleteProduct } from "@/lib/curator/store";
import { BadgeCheck, FileText, Link2, Ruler, Sparkles } from "lucide-react";
import SectionLabel from "@/components/curator/SectionLabel";
import { formatVND, timeAgoOrDate } from "@/lib/format";
import GuScoreDisplay from "@/components/curator/GuScoreDisplay";
import StatusPill from "@/components/curator/StatusPill";

export default function CuratorProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const products = useCuratorProducts();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="ncg-h2 text-2xl mb-3">Không tìm thấy sản phẩm</h1>
        <p className="text-stone mb-6">Sản phẩm này có thể đã bị xóa khỏi Product Database.</p>
        <Link href="/curator/products" className="ncg-button rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Về danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const subcategory = getSubcategory(product.categoryId, product.subcategoryId);
  const sourceLabel = productSources.find((s) => s.value === product.source)?.label ?? product.source;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  function handleArchive() {
    if (!product) return;
    if (window.confirm(`Lưu trữ "${product.name}"? Sản phẩm sẽ bị gỡ khỏi website công khai.`)) {
      setStatus(product.id, "ARCHIVED");
    }
  }

  function handleDelete() {
    if (!product) return;
    if (window.confirm(`Xóa vĩnh viễn "${product.name}" khỏi Product Database?`)) {
      deleteProduct(product.id);
      router.push("/curator/products");
    }
  }

  return (
    <div>
      <nav className="mb-8 text-sm text-stone">
        <Link href="/curator/products" className="hover:text-wood transition-colors">
          Product Database
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
        <div className="lg:sticky lg:top-8 space-y-3">
          <div className="relative aspect-4/5 overflow-hidden rounded-md border border-linen bg-ivory">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          {product.additionalImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {product.additionalImages.slice(0, 3).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-linen bg-ivory">
                  <Image src={img} alt={`${product.name} — ảnh ${i + 2}`} fill sizes="15vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={product.status} />
            <span className="ncg-eyebrow text-[11px] tracking-[0.16em]">
              {getCategoryName(product.categoryId)}
              {subcategory ? ` · ${subcategory.name}` : ""}
            </span>
          </div>

          <h1 className="ncg-h1 mt-4 text-4xl leading-tight">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-3 text-lg text-charcoal/85">{product.shortDescription}</p>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-4 border-b border-linen pb-6">
            <span className="ncg-h2 ncg-figure text-2xl">{formatVND(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-stone line-through">{formatVND(product.originalPrice)}</span>
            )}
            {discount && <span className="text-sm text-wood">−{discount}%</span>}
            <span className="text-sm text-stone">
              ★ {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString("vi-VN")} đánh giá · đã bán{" "}
              {product.soldCount.toLocaleString("vi-VN")}
            </span>
          </div>

          <div className="py-8 border-b border-linen">
            <GuScoreDisplay score={product.guScore} size="lg" />

            <dl className="mt-6 space-y-3">
              {scoreKeys.map((key) => (
                <div key={key} className="flex items-center gap-4">
                  <dt className="ncg-label w-24 shrink-0 text-sm text-charcoal">{scoreLabels[key]}</dt>
                  <div className="h-px flex-1 bg-linen relative">
                    <div
                      className="absolute inset-y-0 left-0 h-px bg-wood"
                      style={{ width: `${product.scores[key]}%` }}
                    />
                  </div>
                  <dd className="ncg-price w-20 shrink-0 text-right text-sm text-ink tabular-nums">
                    {product.scores[key]}
                    <span className="ml-1.5 text-[11px] text-stone">
                      {Math.round(GU_SCORE_WEIGHTS[key] * 100)}%
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {product.editorNote && (
            <div className="py-8 border-b border-linen">
              <SectionLabel icon={Sparkles} as="h2" className="mb-3 text-[11px] tracking-[0.22em]">
                Vì sao Nhà Có Gu chọn sản phẩm này
              </SectionLabel>
              <p className="font-display text-lg leading-relaxed text-ink" style={{ fontWeight: "var(--fw-body-strong)" }}>
                {product.editorNote}
              </p>
            </div>
          )}

          {product.description && (
            <div className="py-8 border-b border-linen">
              <SectionLabel icon={FileText} as="h2" className="mb-3 text-[11px] tracking-[0.22em]">Mô tả</SectionLabel>
              <p className="leading-relaxed text-charcoal/90">{product.description}</p>
            </div>
          )}

          <div className="py-8 border-b border-linen">
            <SectionLabel icon={Ruler} as="h2" className="mb-4 text-[11px] tracking-[0.22em]">Thông số</SectionLabel>
            <dl className="grid grid-cols-[120px_1fr] gap-y-2.5 text-sm">
              <Row label="Phong cách" value={product.styles.join(", ")} />
              <Row label="Màu sắc" value={product.color} />
              <Row label="Chất liệu" value={product.material} />
              <Row label="Kích thước" value={formatDimensions(product.dimensions)} />
            </dl>
          </div>

          <div className="py-8 border-b border-linen">
            <SectionLabel icon={Link2} as="h2" className="mb-4 text-[11px] tracking-[0.22em]">Nguồn</SectionLabel>
            <dl className="grid grid-cols-[120px_1fr] gap-y-2.5 text-sm">
              <Row label="Shop" value={product.shopName} />
              <Row label="Nguồn dữ liệu" value={sourceLabel} />
              <Row
                label="Product URL"
                value={
                  product.productUrl ? (
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-wood hover:underline break-all"
                    >
                      {product.productUrl}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Row
                label="Affiliate URL"
                value={
                  product.affiliateUrl ? (
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="text-wood hover:underline break-all"
                    >
                      {product.affiliateUrl}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Row label="Tạo lúc" value={timeAgoOrDate(product.createdAt)} />
              <Row label="Cập nhật" value={timeAgoOrDate(product.updatedAt)} />
            </dl>
          </div>

          <div className="pt-8">
            <SectionLabel icon={BadgeCheck} as="h2" className="mb-4 text-[11px] tracking-[0.22em]">
              Hành động · đang ở trạng thái {statusLabels[product.status]}
            </SectionLabel>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/curator/products/${product.id}/edit`}
                className="ncg-button rounded-full border border-linen px-5 py-2.5 text-sm hover:border-wood transition-colors"
              >
                Sửa
              </Link>
              {product.status !== "REVIEW" && (
                <button
                  type="button"
                  onClick={() => setStatus(product.id, "REVIEW")}
                  className="ncg-button rounded-full border border-wood/40 px-5 py-2.5 text-sm text-wood hover:bg-wood hover:text-paper transition-colors"
                >
                  Chuyển sang chờ duyệt
                </button>
              )}
              {product.status !== "APPROVED" && (
                <button
                  type="button"
                  onClick={() => setStatus(product.id, "APPROVED")}
                  className="ncg-button rounded-full border border-moss/50 px-5 py-2.5 text-sm text-moss hover:bg-moss hover:text-paper transition-colors"
                >
                  Duyệt
                </button>
              )}
              {product.status !== "FEATURED" && (
                <button
                  type="button"
                  onClick={() => setStatus(product.id, "FEATURED")}
                  className="ncg-button rounded-full bg-ink px-5 py-2.5 text-sm text-paper hover:bg-charcoal transition-colors"
                >
                  Đánh dấu nổi bật
                </button>
              )}
              {product.status !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() => setStatus(product.id, "REJECTED")}
                  className="ncg-button rounded-full border border-alert/40 px-5 py-2.5 text-sm text-alert hover:bg-alert hover:text-paper transition-colors"
                >
                  Loại
                </button>
              )}
              {product.status !== "ARCHIVED" && (
                <button
                  type="button"
                  onClick={handleArchive}
                  className="ncg-button rounded-full border border-linen px-5 py-2.5 text-sm text-stone hover:border-charcoal hover:text-charcoal transition-colors"
                >
                  Lưu trữ
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="ncg-button rounded-full px-5 py-2.5 text-sm text-stone hover:text-alert transition-colors"
              >
                Xóa khỏi database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="ncg-label text-stone">{label}</dt>
      <dd className="ncg-body-strong text-charcoal">{value || "—"}</dd>
    </>
  );
}

function formatDimensions(d: { width?: number; depth?: number; height?: number; note?: string }) {
  const parts: string[] = [];
  if (d.width || d.depth || d.height) {
    parts.push([d.width, d.depth, d.height].filter(Boolean).join(" × ") + " cm");
  }
  if (d.note) parts.push(d.note);
  return parts.join(" · ");
}
