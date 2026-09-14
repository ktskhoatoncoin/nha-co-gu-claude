"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredEvents, clearStoredEvents } from "@/lib/analytics";
import { getAdminProducts } from "@/lib/admin/store";
import { categories } from "@/lib/data/categories";
import { platformLabels } from "@/lib/format";

interface ClickEvent {
  type: string;
  productId?: string;
  platform?: string;
  timestamp: string;
}

export default function AdminAnalyticsPage() {
  const [events, setEvents] = useState<ClickEvent[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-side read of demo localStorage events on mount
    setEvents(getStoredEvents() as unknown as ClickEvent[]);
  }, []);

  const products = getAdminProducts();
  const clicks = events.filter((e) => e.type === "affiliate_click");

  const topProducts = useMemo(() => {
    const counts = new Map<string, number>();
    clicks.forEach((c) => {
      if (!c.productId) return;
      counts.set(c.productId, (counts.get(c.productId) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([productId, count]) => ({ product: products.find((p) => p.id === productId), count }))
      .filter((x) => x.product)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [clicks, products]);

  const byPlatform = useMemo(() => {
    const counts = new Map<string, number>();
    clicks.forEach((c) => {
      if (!c.platform) return;
      counts.set(c.platform, (counts.get(c.platform) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [clicks]);

  const byCategory = useMemo(() => {
    const counts = new Map<string, number>();
    clicks.forEach((c) => {
      const product = products.find((p) => p.id === c.productId);
      if (!product) return;
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([categoryId, count]) => ({ category: categories.find((c) => c.id === categoryId), count }))
      .filter((x) => x.category)
      .sort((a, b) => b.count - a.count);
  }, [clicks, products]);

  const byDate = useMemo(() => {
    const counts = new Map<string, number>();
    clicks.forEach((c) => {
      const day = c.timestamp.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 14);
  }, [clicks]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone">
          Tổng lượt click affiliate ghi nhận (demo, trên trình duyệt này): <strong>{clicks.length}</strong>
        </p>
        <button
          type="button"
          onClick={() => {
            clearStoredEvents();
            setEvents([]);
          }}
          className="text-xs text-alert underline underline-offset-2"
        >
          Xóa dữ liệu demo
        </button>
      </div>

      {clicks.length === 0 ? (
        <div className="rounded-md border border-dashed border-linen py-14 text-center text-stone">
          Chưa có lượt click nào được ghi nhận. Hãy vào một trang sản phẩm và bấm &quot;Xem sản phẩm&quot; để tạo dữ
          liệu demo.
        </div>
      ) : (
        <>
          <section>
            <h2 className="font-display text-lg text-ink mb-4">Sản phẩm được click nhiều nhất</h2>
            <ol className="space-y-2">
              {topProducts.map(({ product, count }, i) => (
                <li key={product!.id} className="flex items-center justify-between border-b border-linen/70 py-2 text-sm">
                  <span>
                    {i + 1}. {product!.name}
                  </span>
                  <span className="text-stone">{count} click</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="font-display text-lg text-ink mb-4">Click theo nền tảng</h2>
              <ul className="space-y-2 text-sm">
                {byPlatform.map(([platform, count]) => (
                  <li key={platform} className="flex justify-between border-b border-linen/70 py-2">
                    <span>{platformLabels[platform] ?? platform}</span>
                    <span className="text-stone">{count}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg text-ink mb-4">Click theo danh mục</h2>
              <ul className="space-y-2 text-sm">
                {byCategory.map(({ category, count }) => (
                  <li key={category!.id} className="flex justify-between border-b border-linen/70 py-2">
                    <span>{category!.name}</span>
                    <span className="text-stone">{count}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h2 className="font-display text-lg text-ink mb-4">Click theo ngày (14 ngày gần nhất có dữ liệu)</h2>
            <ul className="space-y-2 text-sm">
              {byDate.map(([day, count]) => (
                <li key={day} className="flex justify-between border-b border-linen/70 py-2">
                  <span>{day}</span>
                  <span className="text-stone">{count}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <p className="text-xs text-stone max-w-xl border-t border-linen pt-4">
        Đây là bảng thống kê demo đọc từ localStorage của trình duyệt. Khi kết nối Supabase, các số liệu này sẽ
        được truy vấn từ bảng <code>affiliate_clicks</code>, cho phép tính thêm conversion rate, orders, commission
        và EPC theo đúng kiến trúc mô tả trong README.md.
      </p>
    </div>
  );
}
