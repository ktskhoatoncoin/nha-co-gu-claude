import type { Metadata } from "next";
import { getCmsArticles } from "@/lib/cms/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Góc kiến trúc sư",
  description: "Kiến thức thực tế giúp bạn chọn nội thất tốt hơn — không phải nội dung cố bán hàng.",
};

const categoryOrder = [
  "Tư vấn nội thất",
  "Decor",
  "Chiếu sáng",
  "Nhà nhỏ",
  "Setup góc làm việc",
  "Gia dụng",
  "Xu hướng",
];

export default async function BlogPage() {
  const articles = await getCmsArticles();
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-ink">Góc kiến trúc sư</h1>
        <p className="mt-3 text-charcoal/85">
          Giúp bạn quyết định tốt hơn khi mua nội thất — không phải cố bán cho bạn càng nhiều càng tốt.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categoryOrder
          .filter((c) => sorted.some((a) => a.category === c))
          .map((c) => (
            <span key={c} className="rounded-full border border-linen px-3 py-1.5 text-xs text-stone">
              {c}
            </span>
          ))}
      </div>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
