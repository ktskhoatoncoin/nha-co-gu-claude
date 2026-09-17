import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { getCmsProductBySlug, getCmsProducts } from "@/lib/cms/products";
import { categories } from "@/lib/data/categories";
import { rooms } from "@/lib/data/rooms";
import { styles } from "@/lib/data/styles";
import { formatVND, platformLabels, timeAgoOrDate } from "@/lib/format";
import BadgeChip from "@/components/ui/BadgeChip";
import ScorePill from "@/components/ui/ScorePill";
import ScoreBreakdownList from "@/components/product/ScoreBreakdownList";
import AffiliateButton from "@/components/product/AffiliateButton";
import SaveButton from "@/components/product/SaveButton";
import ViewTracker from "@/components/product/ViewTracker";
import ProductGrid from "@/components/ui/ProductGrid";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getCmsProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCmsProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  const category = categories.find((c) => c.id === product.categoryId);
  return {
    title: `${product.name} – ${category?.name ?? ""}`,
    description: product.shortDescription,
    openGraph: { images: [product.imageUrl] },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCmsProductBySlug(slug);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const roomNames = rooms.filter((r) => product.roomIds.includes(r.id)).map((r) => r.name);
  const styleNames = styles.filter((s) => product.styleIds.includes(s.id)).map((s) => s.name);
  const related = (await getCmsProducts())
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: [product.imageUrl, ...product.gallery],
    brand: { "@type": "Brand", name: product.merchantName },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: product.affiliateUrl,
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
      <ViewTracker productId={product.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-stone mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-wood">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-wood">{category.name}</Link>
            <span className="mx-1.5">/</span>
          </>
        )}
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-3 gap-3 lg:sticky lg:top-24 self-start">
          <div className="relative col-span-3 aspect-square overflow-hidden rounded-md border border-linen bg-ivory">
            <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" priority />
          </div>
          {product.gallery.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-linen bg-ivory">
              <Image src={img} alt={`${product.name} - ảnh ${i + 2}`} fill sizes="15vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.badges.map((b) => (
              <BadgeChip key={b} badge={b} />
            ))}
          </div>
          <h1 className="font-display text-3xl text-ink leading-snug">{product.name}</h1>
          <p className="mt-2 text-stone">{product.shortDescription}</p>

          <div className="mt-5 flex items-center gap-4">
            <div>
              <span className="font-display text-3xl text-ink">{formatVND(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-stone line-through">{formatVND(product.originalPrice)}</span>
              )}
            </div>
            <ScorePill score={product.ourScore} size="lg" />
          </div>

          <p className="mt-2 text-sm text-stone">
            ★ {product.rating.toFixed(1)} · {product.reviewCount} đánh giá · Đã bán {product.soldCount} ·{" "}
            {platformLabels[product.platform]}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <AffiliateButton product={product} page={`/product/${product.slug}`} />
            <SaveButton productId={product.id} />
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl text-ink mb-3">Điểm Nhà Có Gu — {product.ourScore}/10</h2>
            <ScoreBreakdownList scores={product.scores} />
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl text-ink mb-3">Nhà Có Gu nhận xét</h2>
            <p className="text-charcoal/90 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-ink mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" /> Ưu điểm
              </h3>
              <ul className="space-y-1.5 text-sm text-charcoal/85">
                {product.pros.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink mb-2 flex items-center gap-1.5">
                <XCircle className="size-4 text-alert" /> Điểm cần lưu ý
              </h3>
              <ul className="space-y-1.5 text-sm text-charcoal/85">
                {product.cons.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-md border border-linen bg-ivory p-5">
            <h3 className="text-sm font-medium text-ink mb-3">Phù hợp với</h3>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-stone">Phòng</dt>
              <dd className="text-charcoal">{roomNames.join(", ") || "—"}</dd>
              <dt className="text-stone">Phong cách</dt>
              <dd className="text-charcoal">{styleNames.join(", ") || "—"}</dd>
              <dt className="text-stone">Diện tích</dt>
              <dd className="text-charcoal">{product.suitedFor.size}</dd>
              <dt className="text-stone">Ngân sách</dt>
              <dd className="text-charcoal">{product.suitedFor.budget}</dd>
            </dl>
          </div>

          <p className="mt-6 text-xs text-stone">
            Hoa hồng cập nhật lần cuối: {timeAgoOrDate(product.commissionUpdatedAt)}. Dữ liệu sản phẩm là dữ liệu mẫu (demo) trong bản V1.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-ink mb-6">Sản phẩm liên quan</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
