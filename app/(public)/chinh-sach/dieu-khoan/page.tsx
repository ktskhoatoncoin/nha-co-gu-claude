import type { Metadata } from "next";

export const metadata: Metadata = { title: "Điều khoản sử dụng" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-6">Điều khoản sử dụng</h1>
      <div className="space-y-4 text-charcoal/85 leading-relaxed">
        <p>
          Nội dung trên Nhà Có Gu (bài viết, nhận xét sản phẩm, điểm số) mang tính chất tham khảo, được biên tập
          bởi đội ngũ Nhà Có Gu dựa trên đánh giá độc lập. Chúng tôi không chịu trách nhiệm về chất lượng, giá cả
          hay dịch vụ hậu mãi của sản phẩm được bán bởi bên thứ ba trên Shopee, TikTok Shop, Lazada hoặc website
          thương hiệu.
        </p>
        <p>
          Giao dịch mua hàng diễn ra hoàn toàn trên nền tảng của bên bán sau khi bạn rời khỏi Nhà Có Gu qua liên
          kết affiliate. Mọi khiếu nại về đơn hàng, vận chuyển, đổi trả cần được xử lý trực tiếp với nền tảng bán
          hàng tương ứng.
        </p>
        <p>Đây là điều khoản mẫu cho bản demo V1 và sẽ được rà soát bởi bộ phận pháp lý trước khi ra mắt chính thức.</p>
      </div>
    </div>
  );
}
