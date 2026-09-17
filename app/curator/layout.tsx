"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/curator", label: "Dashboard" },
  { href: "/curator/products", label: "Sản phẩm" },
  { href: "/curator/products/new", label: "Thêm sản phẩm" },
];

export default function CuratorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-linen">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-6">
            <Link href="/curator" className="shrink-0">
              <span className="ncg-h2 text-xl leading-none">Nhà Có Gu</span>
              <span className="ncg-eyebrow mt-0.5 block text-[10px] tracking-[0.22em] text-wood">
                Product Curator
              </span>
            </Link>

            <nav className="flex items-center gap-1" aria-label="Điều hướng Product Curator">
              {navItems.map((item) => {
                const active =
                  item.href === "/curator" ? pathname === "/curator" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`ncg-nav rounded-full px-3.5 py-2 text-sm transition-colors ${
                      active ? "bg-ink text-paper" : "text-charcoal hover:bg-ivory"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/"
                className="ncg-nav ml-2 hidden text-sm text-stone hover:text-wood transition-colors sm:inline"
              >
                Website công khai ↗
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-10">{children}</main>
    </div>
  );
}
