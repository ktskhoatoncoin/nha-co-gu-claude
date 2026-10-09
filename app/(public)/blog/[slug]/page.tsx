import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCmsArticles, getCmsArticle } from "@/lib/cms/articles";
import { getPublicProducts } from "@/lib/cms/products";
import { timeAgoOrDate } from "@/lib/format";
import ArticleBody from "@/components/ui/ArticleBody";
import ArticleViewTracker from "@/components/ui/ArticleViewTracker";
import ArticleCard from "@/components/ui/ArticleCard";
import RelatedArticleProducts, { resolveRelatedArticleProducts } from "@/components/article/RelatedArticleProducts";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getCmsArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCmsArticle(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: [article.coverImage] },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getCmsArticle(slug);
  if (!article) notFound();

  const publicProducts = await getPublicProducts();
  const relatedProducts = resolveRelatedArticleProducts(publicProducts, article.relatedProductSlugs);
  const moreArticles = (await getCmsArticles()).filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <ArticleViewTracker articleId={article.id} />

      <nav className="text-sm text-stone mb-6">
        <Link href="/blog" className="hover:text-wood">Góc kiến trúc sư</Link>
        <span className="mx-1.5">/</span>
        <span>{article.category}</span>
      </nav>

      <p className="text-sm text-wood mb-2">{article.category}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{article.title}</h1>
      <p className="mt-4 text-stone text-sm">
        {article.author} · {timeAgoOrDate(article.date)} · {article.readingTimeMinutes} phút đọc
      </p>

      <div className="relative mt-8 aspect-16/9 rounded-md overflow-hidden">
        <Image src={article.coverImage} alt={article.title} fill sizes="768px" className="object-cover" priority />
      </div>

      <div className="mt-10">
        <ArticleBody blocks={article.content} />
      </div>

      {article.hasAffiliateLinks && relatedProducts.length > 0 && (
        <p className="mt-10 text-xs text-stone border-t border-linen pt-4">
          Bài viết này có chứa liên kết tiếp thị liên kết tới các sản phẩm được nhắc đến. Nhà Có Gu có thể nhận hoa
          hồng nếu bạn mua hàng qua các liên kết này, không làm tăng giá bạn phải trả.
        </p>
      )}

      <RelatedArticleProducts products={publicProducts} slugs={article.relatedProductSlugs} />

      {moreArticles.length > 0 && (
        <section className="mt-16 border-t border-linen pt-10">
          <h2 className="font-display text-xl text-ink mb-6">Bài viết khác cùng chủ đề</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {moreArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
