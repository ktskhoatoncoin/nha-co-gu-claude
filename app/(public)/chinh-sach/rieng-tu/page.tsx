import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chính sách riêng tư" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl text-ink mb-6">Chính sách riêng tư</h1>
      <div className="space-y-4 text-charcoal/85 leading-relaxed">
        <p>
          Nhà Có Gu ghi nhận một số dữ liệu sử dụng ẩn danh (lượt xem sản phẩm, lượt click ra sàn thương mại điện
          tử, tìm kiếm) nhằm cải thiện chất lượng tuyển chọn sản phẩm và nội dung. Dữ liệu này không bao gồm
          thông tin định danh cá nhân trừ khi bạn chủ động cung cấp qua biểu mẫu liên hệ.
        </p>
        <p>
          Danh sách sản phẩm yêu thích (wishlist) và danh sách so sánh được lưu trực tiếp trên trình duyệt của
          bạn (localStorage) và không được gửi về máy chủ trong bản V1.
        </p>
        <p>Đây là chính sách mẫu cho bản demo V1 và sẽ được rà soát bởi bộ phận pháp lý trước khi ra mắt chính thức.</p>
      </div>
    </div>
  );
}
