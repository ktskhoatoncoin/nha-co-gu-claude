"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGate from "@/components/admin/AdminGate";

const navItems = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/articles", label: "Bài viết" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGate>
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone">Nhà Có Gu</p>
            <h1 className="font-display text-2xl text-ink">Quản trị</h1>
          </div>
          <Link href="/" className="text-sm text-wood hover:underline">
            ← Về website
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-linen pb-2 lg:pb-0 lg:pr-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                  pathname === item.href ? "bg-ink text-paper" : "text-charcoal hover:bg-ivory"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </AdminGate>
  );
}
