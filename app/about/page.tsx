import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về Nhà Có Gu",
  description: "Nguyên tắc tuyển chọn sản phẩm của Nhà Có Gu — vì sao chúng tôi không bán mọi thứ.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">Về Nhà Có Gu</h1>
      <p className="mt-5 text-lg text-charcoal/85 leading-relaxed">
        Nhà Có Gu không cố gắng bán cho bạn thật nhiều thứ. Chúng tôi chọn lọc những sản phẩm đáng mua, phù hợp
        với không gian, phong cách và ngân sách của bạn — giống như một người bạn hiểu về nhà cửa đang tư vấn,
        không phải một sàn thương mại điện tử cố nhồi nhét sản phẩm.
      </p>

      <h2 id="nguyen-tac" className="font-display text-2xl text-ink mt-12 mb-4">Nguyên tắc tuyển chọn</h2>
      <ul className="space-y-3 text-charcoal/85">
        <li>• Mỗi sản phẩm được chấm điểm trên 6 tiêu chí: thiết kế, giá, công năng, chất liệu, đáng tiền và tiềm năng nội dung.</li>
        <li>• Chúng tôi viết nhận xét bằng lời của mình, không sao chép mô tả từ người bán.</li>
        <li>• Mọi sản phẩm đều có cả ưu điểm và điểm cần lưu ý — không có sản phẩm nào là hoàn hảo.</li>
        <li>• Chúng tôi không tuyên bố &quot;rẻ nhất thị trường&quot; hay &quot;tốt nhất&quot; nếu không có dữ liệu chứng minh.</li>
        <li>• Không có sản phẩm fake sales, fake reviews hay testimonial giả mạo trên Nhà Có Gu.</li>
      </ul>

      <h2 className="font-display text-2xl text-ink mt-12 mb-4">Mô hình kinh doanh</h2>
      <p className="text-charcoal/85 leading-relaxed">
        Nhà Có Gu hoạt động theo mô hình affiliate marketing — khi bạn mua hàng qua liên kết trên website, chúng
        tôi có thể nhận hoa hồng từ Shopee, TikTok Shop, Lazada hoặc thương hiệu, không làm tăng giá bạn phải trả.
        Xem chi tiết tại{" "}
        <a href="/chinh-sach/affiliate" className="text-wood underline underline-offset-2">
          Chính sách affiliate
        </a>
        .
      </p>
    </div>
  );
}
