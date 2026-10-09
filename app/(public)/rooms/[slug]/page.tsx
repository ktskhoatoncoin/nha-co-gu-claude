import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rooms } from "@/lib/data/rooms";
import { styles } from "@/lib/data/styles";
import { getPublicProducts } from "@/lib/cms/products";
import { getCmsArticles } from "@/lib/cms/articles";
import ProductGrid from "@/components/ui/ProductGrid";
import ArticleCard from "@/components/ui/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) return { title: "Không tìm thấy" };
  return { title: `Nội thất cho ${room.name.toLowerCase()} – Nhà Có Gu`, description: room.description };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) notFound();

  const products = (await getPublicProducts()).filter((p) => p.roomIds.includes(room.id));
  const relatedArticles = (await getCmsArticles())
    .filter((a) => a.relatedProductSlugs.some((s) => products.some((p) => p.slug === s)))
    .slice(0, 3);
  const relevantStyles = styles.filter((s) => products.some((p) => p.styleIds.includes(s.id)));

  return (
    <div>
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image src={room.heroImage} alt={room.name} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-ink/45 flex items-end">
          <div className="mx-auto max-w-(--container-content) w-full px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="font-display text-3xl sm:text-4xl text-paper">{room.name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
        <p className="max-w-2xl text-charcoal/85 mb-8">{room.description}</p>

        <section className="mb-14 rounded-md border border-linen bg-ivory p-6">
          <h2 className="font-display text-xl text-ink mb-4">Vấn đề thường gặp</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {room.commonProblems.map((problem, i) => (
              <li key={i} className="text-sm text-charcoal/85 flex gap-2">
                <span className="text-wood">–</span> {problem}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <SectionHeading title={`Sản phẩm cho ${room.name.toLowerCase()}`} />
          <ProductGrid products={products} />
        </section>

        {relevantStyles.length > 0 && (
          <section className="mb-14">
            <SectionHeading title="Phong cách phù hợp" />
            <div className="flex flex-wrap gap-3">
              {relevantStyles.map((s) => (
                <Link
                  key={s.id}
                  href={`/styles/${s.slug}`}
                  className="rounded-full border border-linen px-4 py-2 text-sm hover:border-wood transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        )}

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
