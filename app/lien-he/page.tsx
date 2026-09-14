import type { Metadata } from "next";

export const metadata: Metadata = { title: "Liên hệ" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-4">Liên hệ</h1>
      <p className="text-charcoal/85 leading-relaxed">
        Góp ý về sản phẩm, hợp tác thương hiệu hoặc báo lỗi liên kết affiliate, vui lòng liên hệ qua email:
      </p>
      <p className="mt-3 font-medium text-ink">hello@nhacogu.vn</p>
      <p className="mt-6 text-sm text-stone">(Đây là thông tin liên hệ mẫu cho bản demo V1.)</p>
    </div>
  );
}
