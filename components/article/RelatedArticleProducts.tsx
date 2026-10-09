import ProductGrid from "@/components/ui/ProductGrid";
import { Product } from "@/lib/types";

/** Resolve only explicitly linked, public products while preserving article order. */
export function resolveRelatedArticleProducts(products: Product[], slugs: string[]) {
  const bySlug = new Map(products.filter((product) => product.isActive && product.slug).map((product) => [product.slug, product]));
  const seen = new Set<string>();

  return slugs.flatMap((slug) => {
    if (seen.has(slug)) return [];
    seen.add(slug);
    const product = bySlug.get(slug);
    return product ? [product] : [];
  });
}

export default function RelatedArticleProducts({ products, slugs }: { products: Product[]; slugs: string[] }) {
  const relatedProducts = resolveRelatedArticleProducts(products, slugs);
  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl text-ink mb-6">Sản phẩm được nhắc đến</h2>
      <ProductGrid products={relatedProducts} columns={3} />
    </section>
  );
}
