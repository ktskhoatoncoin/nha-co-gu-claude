import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chính sách affiliate" };

export default function AffiliatePolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-6">Chính sách affiliate</h1>
      <div className="space-y-4 text-charcoal/85 leading-relaxed">
        <p>
          Một số liên kết trên Nhà Có Gu là liên kết tiếp thị liên kết (affiliate) tới Shopee, TikTok Shop,
          Lazada hoặc website của thương hiệu. Khi bạn nhấp vào và mua hàng qua các liên kết này, Nhà Có Gu có
          thể nhận được một khoản hoa hồng từ đối tác bán hàng.
        </p>
        <p>Điều quan trọng: việc này không làm tăng giá sản phẩm mà bạn phải trả.</p>
        <p>
          Chúng tôi lựa chọn sản phẩm để giới thiệu dựa trên đánh giá độc lập của đội ngũ biên tập, không dựa
          trên mức hoa hồng cao hay thấp. Mức hoa hồng của từng sản phẩm có thể thay đổi theo thời gian tùy
          chính sách của đối tác và được cập nhật định kỳ trong hệ thống quản trị nội bộ.
        </p>
        <p>
          Dữ liệu sản phẩm trong bản V1 hiện là dữ liệu mẫu (demo) để minh họa chức năng của nền tảng; liên kết
          affiliate thực tế sẽ được nhập thủ công khi Nhà Có Gu chính thức ra mắt.
        </p>
      </div>
    </div>
  );
}
