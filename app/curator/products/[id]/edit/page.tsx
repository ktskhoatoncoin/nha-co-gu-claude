"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCuratorProducts } from "@/lib/curator/useCuratorProducts";
import CuratorProductForm from "@/components/curator/CuratorProductForm";

export default function EditCuratorProductPage() {
  const params = useParams<{ id: string }>();
  const products = useCuratorProducts();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="ncg-h2 text-2xl mb-3">Không tìm thấy sản phẩm</h1>
        <p className="text-stone mb-6">Sản phẩm này có thể đã bị xóa khỏi Product Database.</p>
        <Link href="/curator/products" className="ncg-button rounded-full bg-ink px-6 py-3 text-sm text-paper">
          Về danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <p className="ncg-eyebrow text-[11px]">Edit Product</p>
        <h1 className="ncg-h1 mt-2 text-3xl text-wood">{product.name}</h1>
      </header>
      <CuratorProductForm product={product} />
    </div>
  );
}
