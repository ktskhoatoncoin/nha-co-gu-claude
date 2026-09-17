"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Star, Trash2, Home } from "lucide-react";
import { getAdminProducts, deleteAdminProduct, setAdminProductFlag } from "@/lib/admin/store";
import { categories } from "@/lib/data/categories";
import { formatVND } from "@/lib/format";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function refresh() {
    try {
      setProducts(await getAdminProducts());
    } catch {
      setProducts([]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-side read of CMS data on mount
    void refresh();
  }, []);

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác trong bản demo.`)) return;
    void deleteAdminProduct(id).then(refresh);
  }

  function toggle(id: string, flag: "isFeatured" | "isHero" | "isActive", current: boolean) {
    void setAdminProductFlag(id, flag, !current).then(refresh);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-ink">Sản phẩm ({products.length})</h2>
        <Link href="/admin/products/new" className="rounded-full bg-ink text-paper px-4 py-2 text-sm">
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-sm">
          <thead>
            <tr className="text-left text-stone border-b border-linen">
              <th className="py-2 pr-3 font-medium">Sản phẩm</th>
              <th className="py-2 pr-3 font-medium">Danh mục</th>
              <th className="py-2 pr-3 font-medium">Giá</th>
              <th className="py-2 pr-3 font-medium">Điểm</th>
              <th className="py-2 pr-3 font-medium">Trạng thái</th>
              <th className="py-2 pr-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const category = categories.find((c) => c.id === p.categoryId);
              return (
                <tr key={p.id} className="border-b border-linen/70 align-middle">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 rounded overflow-hidden border border-linen shrink-0 bg-ivory">
                        <Image src={p.imageUrl} alt={p.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <span className="line-clamp-2 max-w-[220px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-stone">{category?.name ?? "—"}</td>
                  <td className="py-3 pr-3">{formatVND(p.price)}</td>
                  <td className="py-3 pr-3">{p.ourScore}/10</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                        p.isActive ? "bg-moss/15 text-moss" : "bg-alert/10 text-alert"
                      }`}
                    >
                      {p.isActive ? "Hoạt động" : "Ẩn"}
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title={p.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                        onClick={() => toggle(p.id, "isFeatured", p.isFeatured)}
                        className={`p-1.5 rounded ${p.isFeatured ? "text-wood" : "text-stone hover:text-wood"}`}
                      >
                        <Star className={`size-4 ${p.isFeatured ? "fill-wood" : ""}`} />
                      </button>
                      <button
                        type="button"
                        title={p.isHero ? "Bỏ hero" : "Đánh dấu hero"}
                        onClick={() => toggle(p.id, "isHero", p.isHero)}
                        className={`p-1.5 rounded ${p.isHero ? "text-wood" : "text-stone hover:text-wood"}`}
                      >
                        <Home className={`size-4 ${p.isHero ? "fill-wood" : ""}`} />
                      </button>
                      <button
                        type="button"
                        title={p.isActive ? "Ẩn sản phẩm" : "Kích hoạt sản phẩm"}
                        onClick={() => toggle(p.id, "isActive", p.isActive)}
                        className="text-xs px-2 py-1 rounded border border-linen text-charcoal hover:border-wood"
                      >
                        {p.isActive ? "Ẩn" : "Kích hoạt"}
                      </button>
                      <Link href={`/admin/products/${p.id}`} title="Sửa" className="p-1.5 text-stone hover:text-wood">
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        title="Xóa"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-stone hover:text-alert"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
