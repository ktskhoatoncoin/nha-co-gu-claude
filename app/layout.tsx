import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Note: this build environment has no network access to Google Fonts, so
// the type system relies on high-quality system font stacks (see
// globals.css --font-display / --font-body). When deploying with network
// access, swap these for next/font/google (Fraunces + Inter recommended —
// see README "Design system" section) without touching any component.

export const metadata: Metadata = {
  metadataBase: new URL("https://nhacogu.vn"),
  title: {
    default: "Nhà Có Gu — Chọn đúng một món, đẹp cả căn nhà",
    template: "%s — Nhà Có Gu",
  },
  description:
    "Nhà Có Gu tuyển chọn nội thất, decor và đồ gia dụng theo không gian, phong cách và ngân sách — không phải một chợ bán mọi thứ.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Nhà Có Gu",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-charcoal">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
