import { Badge, Product } from "@/lib/types";
import { productSpecs } from "@/lib/data/product-specs";

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function computeOverallScore(scores: { design: number; price: number; function: number; material: number; value: number; content: number }) {
  const avg =
    (scores.design + scores.price + scores.function + scores.material + scores.value + scores.content) / 6;
  return Math.round(avg * 10) / 10;
}

function computeBadges(price: number, overallScore: number, extra: Badge[] | undefined): Badge[] {
  const badges = new Set<Badge>(extra ?? []);
  if (price <= 500000) badges.add("duoi_500k");
  if (overallScore >= 8.5) badges.add("nha_co_gu_chon");
  else if (overallScore >= 8 && !badges.has("dang_tien")) badges.add("dang_tien");
  // Cap at 2 badges shown, per style guide — keep the most meaningful ones.
  const priority: Badge[] = [
    "nha_co_gu_chon",
    "san_pham_noi_bat",
    "dang_tien",
    "phu_hop_nha_nho",
    "duoi_500k",
  ];
  return priority.filter((b) => badges.has(b)).slice(0, 2);
}

export const products: Product[] = productSpecs.map((spec, index) => {
  const slug = slugify(spec.name);
  const id = `prod-${String(index + 1).padStart(3, "0")}`;
  const overallScore = computeOverallScore(spec.scores);
  const createdAt = new Date(2026, 0, 1 + index).toISOString();

  return {
    id,
    name: spec.name,
    slug,
    description: spec.description,
    shortDescription: spec.shortDescription,
    categoryId: spec.categoryId,
    subcategory: spec.subcategory,
    roomIds: spec.roomIds,
    styleIds: spec.styleIds,
    price: spec.price,
    originalPrice: spec.originalPrice ?? null,
    currency: "VND",
    imageUrl: `https://picsum.photos/seed/${slug}/900/1125`,
    gallery: [
      `https://picsum.photos/seed/${slug}-1/1200/1200`,
      `https://picsum.photos/seed/${slug}-2/1200/1200`,
      `https://picsum.photos/seed/${slug}-3/1200/1200`,
    ],
    rating: spec.rating,
    reviewCount: spec.reviewCount,
    soldCount: spec.soldCount,
    merchantName: spec.merchantName,
    platform: spec.platform,
    // DEMO placeholder — real affiliate URLs must be entered manually per
    // section 41 of the brief. Never auto-generate real Shopee/TikTok links.
    affiliateUrl: `https://example.com/affiliate/${slug}?demo=true`,
    commissionRate: spec.commissionRate,
    commissionType: spec.commissionType,
    commissionUpdatedAt: createdAt,
    ourScore: overallScore,
    scores: spec.scores,
    badges: computeBadges(spec.price, overallScore, spec.extraBadges),
    suitedFor: {
      rooms: spec.roomIds,
      styles: spec.styleIds,
      size: spec.size,
      budget: spec.budgetLabel,
    },
    pros: spec.pros,
    cons: spec.cons,
    isFeatured: Boolean(spec.isFeatured),
    isHero: Boolean(spec.isHero),
    isActive: true,
    isDemoData: true,
    createdAt,
    updatedAt: createdAt,
  };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug && p.isActive);
}

export function getActiveProducts() {
  return products.filter((p) => p.isActive);
}
