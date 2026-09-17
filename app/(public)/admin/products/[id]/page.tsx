"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAdminProduct } from "@/lib/admin/store";
import { Product } from "@/lib/types";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    getAdminProduct(params.id).then(setProduct).catch(() => setProduct(null));
  }, [params.id]);

  if (product === undefined) return null;
  if (!product) return <p className="text-stone">Không tìm thấy sản phẩm này.</p>;

  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-6">Sửa: {product.name}</h2>
      <AdminProductForm product={product} />
    </div>
  );
}
