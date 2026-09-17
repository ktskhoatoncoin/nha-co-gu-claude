import { Suspense } from "react";
import Link from "next/link";
import CuratorProductExplorer from "@/components/curator/CuratorProductExplorer";

export const metadata = { title: "Product Database — Curator" };

export default function CuratorProductsPage() {
  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ncg-eyebrow text-[11px]">Product Database</p>
          <h1 className="ncg-h1 mt-2 text-3xl text-wood">Toàn bộ sản phẩm</h1>
        </div>
        <Link
          href="/curator/products/new"
          className="ncg-button rounded-full bg-ink px-5 py-2.5 text-sm text-paper hover:bg-charcoal transition-colors"
        >
          Thêm sản phẩm
        </Link>
      </header>

      <Suspense fallback={<p className="text-stone">Đang tải...</p>}>
        <CuratorProductExplorer />
      </Suspense>
    </div>
  );
}
