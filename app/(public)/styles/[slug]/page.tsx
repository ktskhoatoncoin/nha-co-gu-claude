import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { styles } from "@/lib/data/styles";
import { getActiveProducts } from "@/lib/data/products";
import ProductGrid from "@/components/ui/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return styles.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const style = styles.find((s) => s.slug === slug);
  if (!style) return { title: "Không tìm thấy" };
  return { title: `Nội thất phong cách ${style.name} – Nhà Có Gu`, description: style.description };
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = styles.find((s) => s.slug === slug);
  if (!style) notFound();

  const products = getActiveProducts().filter((p) => p.styleIds.includes(style.id));

  return (
    <div>
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image src={style.heroImage} alt={style.name} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-ink/45 flex items-end">
          <div className="mx-auto max-w-(--container-content) w-full px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="font-display text-3xl sm:text-4xl text-paper">Phong cách {style.name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
        <p className="max-w-2xl text-charcoal/85 mb-10">{style.description}</p>
        <SectionHeading title={`Sản phẩm phong cách ${style.name}`} />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
