import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-linen py-16 text-center">
        <p className="text-stone">Chưa có sản phẩm phù hợp trong mục này.</p>
      </div>
    );
  }
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 ${
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
