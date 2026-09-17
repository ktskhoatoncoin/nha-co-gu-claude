import { Suspense } from "react";
import ProductsExplorer from "@/components/product/ProductsExplorer";
import { getCmsProducts } from "@/lib/cms/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tất cả sản phẩm",
  description: "Tìm kiếm và lọc nội thất, decor, đồ gia dụng theo phòng, phong cách, ngân sách và điểm Nhà Có Gu.",
};

export default async function ProductsPage() {
  const products = await getCmsProducts();
  return (
    <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Tất cả sản phẩm</h1>
      <p className="text-stone mb-8">Lọc theo phòng, phong cách, ngân sách hoặc điểm Nhà Có Gu để tìm đúng món bạn cần.</p>
      <Suspense fallback={<p className="text-stone">Đang tải...</p>}>
        <ProductsExplorer products={products} />
      </Suspense>
    </div>
  );
}
