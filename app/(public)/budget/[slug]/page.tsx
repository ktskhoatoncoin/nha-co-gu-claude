import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { budgetTiers } from "@/lib/data/styles";
import { getCmsProducts } from "@/lib/cms/products";
import { formatVND } from "@/lib/format";
import ProductGrid from "@/components/ui/ProductGrid";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return budgetTiers.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tier = budgetTiers.find((b) => b.slug === slug);
  if (!tier) return { title: "Không tìm thấy" };
  return { title: `Nội thất tầm giá ${tier.name} – Nhà Có Gu`, description: tier.description };
}

export default async function BudgetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tier = budgetTiers.find((b) => b.slug === slug);
  if (!tier) notFound();

  const products = (await getCmsProducts())
    .filter((p) => p.price >= tier.min && (tier.max === null || p.price < tier.max))
    .sort((a, b) => b.ourScore - a.ourScore);

  return (
    <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-10">
        <p className="text-sm text-wood mb-2">Ngân sách</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">{tier.name}</h1>
        <p className="mt-3 text-charcoal/85">{tier.description}</p>
        <p className="mt-2 text-sm text-stone">
          {formatVND(tier.min)} {tier.max ? `– ${formatVND(tier.max)}` : "trở lên"}
        </p>
      </div>
      <ProductGrid products={products} />

      <div className="mt-14 flex flex-wrap gap-2">
        {budgetTiers.map((b) => (
          <a
            key={b.id}
            href={`/budget/${b.slug}`}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              b.slug === slug ? "border-wood bg-wood text-paper" : "border-linen hover:border-wood"
            }`}
          >
            {b.name}
          </a>
        ))}
      </div>
    </div>
  );
}
