import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data/categories";
import { getCmsProducts } from "@/lib/cms/products";
import { getCmsArticles } from "@/lib/cms/articles";
import { OTHER_CATEGORY_ID, OTHER_CATEGORY_NAME } from "@/lib/cms/constants";
import ProductGrid from "@/components/ui/ProductGrid";
import ArticleCard from "@/components/ui/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [...categories.map((c) => ({ slug: c.slug })), { slug: "san-pham-khac" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug) ?? (slug === "san-pham-khac" ? { id: OTHER_CATEGORY_ID, slug, name: OTHER_CATEGORY_NAME, description: "Những sản phẩm hữu ích khác được Nhà Có Gu tuyển chọn.", heroImage: "https://picsum.photos/seed/nha-co-gu-other/1200/800" } : undefined);
  if (!category) return { title: "Không tìm thấy danh mục" };
  return {
    title: `${category.name} đẹp, đáng mua – Nhà Có Gu`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug) ?? (slug === "san-pham-khac" ? { id: OTHER_CATEGORY_ID, slug, name: OTHER_CATEGORY_NAME, description: "Những sản phẩm hữu ích khác được Nhà Có Gu tuyển chọn.", heroImage: "https://picsum.photos/seed/nha-co-gu-other/1200/800" } : undefined);
  if (!category) notFound();

  const products = (await getCmsProducts()).filter((p) => p.categoryId === category.id);
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const rest = products.filter((p) => !p.isFeatured);
  const relatedArticles = (await getCmsArticles())
    .filter((a) => a.relatedProductSlugs.some((s) => products.some((p) => p.slug === s)))
    .slice(0, 3);

  return (
    <div>
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image src={category.heroImage} alt={category.name} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-ink/45 flex items-end">
          <div className="mx-auto max-w-(--container-content) w-full px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="font-display text-3xl sm:text-4xl text-paper">{category.name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
        <p className="max-w-2xl text-charcoal/85 mb-10">{category.description}</p>

        {featured.length > 0 && (
          <section className="mb-14">
            <SectionHeading title="Sản phẩm nổi bật" />
            <ProductGrid products={featured} />
          </section>
        )}

        <section className="mb-14">
          <SectionHeading title={`Tất cả ${category.name.toLowerCase()}`} />
          <ProductGrid products={rest.length ? rest : products} />
        </section>

        {relatedArticles.length > 0 && (
          <section>
            <SectionHeading title="Bài viết liên quan" />
            <div className="grid gap-8 sm:grid-cols-3">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
