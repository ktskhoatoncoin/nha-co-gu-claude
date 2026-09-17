"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminProducts } from "@/lib/admin/store";
import { categories } from "@/lib/data/categories";
import { getAdminArticles } from "@/lib/admin/articles";
import { getStoredEvents } from "@/lib/analytics";
import { Product } from "@/lib/types";

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [articleCount, setArticleCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    getAdminProducts().then(setProducts).catch(() => setProducts([]));
    getAdminArticles().then((items) => setArticleCount(items.length)).catch(() => setArticleCount(0));
    Promise.resolve(getStoredEvents().filter((e) => e.type === "affiliate_click").length).then(setClickCount);
  }, []);

  const stats = [
    { label: "Tổng sản phẩm", value: products.length },
    { label: "Sản phẩm đang hoạt động", value: products.filter((p) => p.isActive).length },
    { label: "Sản phẩm nổi bật", value: products.filter((p) => p.isFeatured).length },
    { label: "Nhóm sản phẩm", value: categories.length },
    { label: "Bài viết", value: articleCount },
    { label: "Lượt click affiliate (demo)", value: clickCount },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-linen p-5">
            <p className="text-sm text-stone">{s.label}</p>
            <p className="font-display text-3xl text-ink mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm">
          + Thêm sản phẩm
        </Link>
        <Link href="/admin/products" className="rounded-full border border-linen px-5 py-2.5 text-sm">
          Quản lý sản phẩm
        </Link>
        <Link href="/admin/analytics" className="rounded-full border border-linen px-5 py-2.5 text-sm">
          Xem analytics
        </Link>
      </div>

      <p className="mt-8 text-xs text-stone max-w-xl">
        Bản demo V1: dữ liệu sản phẩm được lưu đè (override) trong localStorage của trình duyệt này. Khi kết nối
        Supabase, các thao tác CRUD ở đây sẽ ghi thẳng vào bảng <code>products</code> thay vì localStorage.
      </p>
    </div>
  );
}
