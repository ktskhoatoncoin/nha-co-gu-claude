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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-side read of demo admin store on mount
    setProduct(getAdminProduct(params.id));
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
