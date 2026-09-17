import type { Metadata } from "next";
import "./globals.css";

// Root layout holds only the document shell. Site chrome (Header/Footer)
// lives in app/(public)/layout.tsx so internal tools — the Product Curator
// at /curator — can render without the public website's navigation.
//
// Note: this build environment has no network access to Google Fonts, so
// the type system relies on system font stacks (see globals.css
// --font-display / --font-body). When deploying with network access, swap
// these for next/font/google (Fraunces + Inter) without touching any
// component.

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
      <body className="min-h-full flex flex-col bg-paper text-charcoal">{children}</body>
    </html>
  );
}
