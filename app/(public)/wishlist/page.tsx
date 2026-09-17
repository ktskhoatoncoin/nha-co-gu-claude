"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/ui/ProductGrid";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => { fetch("/api/products").then((response) => response.json()).then(setAllProducts).catch(() => setAllProducts([])); }, []);
  const products = allProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Sản phẩm đã lưu</h1>
      <p className="text-stone mb-8">Danh sách được lưu trên trình duyệt này, không cần đăng nhập.</p>

      {products.length === 0 ? (
        <div className="rounded-md border border-dashed border-linen py-16 text-center">
          <p className="text-stone mb-4">Bạn chưa lưu sản phẩm nào.</p>
          <Link href="/products" className="inline-block rounded-full bg-ink text-paper px-6 py-3 text-sm">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
