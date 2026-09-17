"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X, Heart, Scale } from "lucide-react";

const navLinks = [
  { href: "/rooms/phong-khach", label: "Phòng khách" },
  { href: "/rooms/phong-ngu", label: "Phòng ngủ" },
  { href: "/rooms/nha-bep", label: "Nhà bếp" },
  { href: "/rooms/goc-lam-viec", label: "Góc làm việc" },
  { href: "/category/den", label: "Đèn" },
  { href: "/category/decor", label: "Decor" },
  { href: "/products?sort=nha-co-gu-chon", label: "Top Picks" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-linen">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="Về trang chủ Nhà Có Gu">
            <span className="ncg-h2 text-xl tracking-tight">Nhà Có Gu</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6" aria-label="Điều hướng chính">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ncg-nav text-sm text-charcoal/80 hover:text-wood transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/products"
              className="hidden sm:inline-flex p-2 text-charcoal/70 hover:text-wood transition-colors"
              aria-label="Tìm kiếm sản phẩm"
            >
              <Search className="size-5" />
            </Link>
            <Link
              href="/compare"
              className="hidden sm:inline-flex p-2 text-charcoal/70 hover:text-wood transition-colors"
              aria-label="So sánh sản phẩm"
            >
              <Scale className="size-5" />
            </Link>
            <Link
              href="/wishlist"
              className="hidden sm:inline-flex p-2 text-charcoal/70 hover:text-wood transition-colors"
              aria-label="Sản phẩm đã lưu"
            >
              <Heart className="size-5" />
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 text-charcoal/70"
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-linen bg-paper">
          <nav className="mx-auto max-w-(--container-content) px-4 py-4 flex flex-col gap-1" aria-label="Điều hướng di động">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ncg-nav py-2.5 text-base text-charcoal border-b border-linen/70 last:border-0"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-3">
              <Link href="/products" className="flex items-center gap-2 text-sm text-charcoal/80" onClick={() => setOpen(false)}>
                <Search className="size-4" /> Tìm kiếm
              </Link>
              <Link href="/compare" className="flex items-center gap-2 text-sm text-charcoal/80" onClick={() => setOpen(false)}>
                <Scale className="size-4" /> So sánh
              </Link>
              <Link href="/wishlist" className="flex items-center gap-2 text-sm text-charcoal/80" onClick={() => setOpen(false)}>
                <Heart className="size-4" /> Đã lưu
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
