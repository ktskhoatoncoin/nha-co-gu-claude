import { BudgetTier, Style } from "@/lib/types";

export const styles: Style[] = [
  {
    id: "style-japandi",
    slug: "japandi",
    name: "Japandi",
    description:
      "Giao thoa giữa sự tối giản Nhật Bản và sự ấm áp Bắc Âu. Ít món, chọn kỹ, ưu tiên gỗ sáng màu và tông trung tính.",
    heroImage: "/images/styles/japandi.jpg",
  },
  {
    id: "style-modern",
    slug: "modern",
    name: "Modern",
    description:
      "Đường nét dứt khoát, vật liệu công nghiệp như kim loại và kính, ít chi tiết trang trí thừa.",
    heroImage: "/images/styles/modern.jpg",
  },
  {
    id: "style-minimal",
    slug: "minimal",
    name: "Minimal",
    description:
      "Chỉ giữ lại những gì cần thiết. Bảng màu gần như đơn sắc, ưu tiên công năng hơn trang trí.",
    heroImage: "/images/styles/minimal.jpg",
  },
  {
    id: "style-scandinavian",
    slug: "scandinavian",
    name: "Scandinavian",
    description:
      "Gỗ sáng, vải dệt tự nhiên, ánh sáng ấm — phong cách được thiết kế cho những mùa ít nắng.",
    heroImage: "/images/styles/scandinavian.jpg",
  },
  {
    id: "style-indochine",
    slug: "indochine",
    name: "Indochine",
    description:
      "Tinh thần Đông Dương với gỗ tối màu, họa tiết hoa văn nhẹ và điểm nhấn từ mây tre — hợp với nhà phố truyền thống.",
    heroImage: "/images/styles/indochine.jpg",
  },
  {
    id: "style-luxury",
    slug: "luxury",
    name: "Luxury",
    description:
      "Vật liệu cao cấp, chi tiết hoàn thiện tỉ mỉ, bảng màu đậm và ánh kim làm điểm nhấn có chọn lọc.",
    heroImage: "/images/styles/luxury.jpg",
  },
  // V2.2: added to bring "Chọn theo phong cách" from 6 to 10 styles, so the
  // homepage grid fills a clean 5×2 on desktop instead of leaving a gap in
  // row two. (V3.2: all 10 styles below now use real photography supplied
  // for this section — see public/images/styles/.)
  {
    id: "style-wabi-sabi",
    slug: "wabi-sabi",
    name: "Wabi-Sabi",
    description:
      "Vẻ đẹp của sự không hoàn hảo — vật liệu thô mộc, bề mặt còn dấu vết thời gian, tông màu trầm ấm và ít can thiệp trang trí.",
    heroImage: "/images/styles/wabi-sabi.jpg",
  },
  {
    id: "style-mid-century-modern",
    slug: "mid-century-modern",
    name: "Mid-century Modern",
    description:
      "Tinh thần nội thất giữa thế kỷ 20: chân gỗ thon vát, đường nét hữu cơ, gỗ óc chó và điểm nhấn màu có chọn lọc.",
    heroImage: "/images/styles/mid-century-modern.jpg",
  },
  {
    id: "style-contemporary",
    slug: "contemporary",
    name: "Contemporary",
    description:
      "Đường nét sạch, vật liệu hiện đại, luôn cập nhật theo tinh thần thiết kế của thời điểm hiện tại thay vì cố định vào một quy tắc cứng.",
    heroImage: "/images/styles/contemporary.jpg",
  },
  {
    id: "style-rustic",
    slug: "rustic",
    name: "Rustic",
    description:
      "Chất liệu mộc mạc như gỗ thô và đá tự nhiên, mang lại cảm giác ấm áp, gần gũi và ít gọt giũa.",
    heroImage: "/images/styles/rustic.jpg",
  },
];

export const budgetTiers: BudgetTier[] = [
  {
    id: "budget-under-300k",
    slug: "under-300k",
    name: "Dưới 300K",
    min: 0,
    max: 300000,
    description: "Những món nhỏ để thử một phong cách mới mà không cần cân nhắc nhiều.",
  },
  {
    id: "budget-300k-1m",
    slug: "300k-1m",
    name: "300K – 1 triệu",
    min: 300000,
    max: 1000000,
    description: "Mức giá phổ biến nhất cho decor và các món nội thất nhỏ.",
  },
  {
    id: "budget-1m-3m",
    slug: "1m-3m",
    name: "1 – 3 triệu",
    min: 1000000,
    max: 3000000,
    description: "Bắt đầu chạm tới nội thất chính như bàn, ghế, kệ cỡ vừa.",
  },
  {
    id: "budget-3m-10m",
    slug: "3m-10m",
    name: "3 – 10 triệu",
    min: 3000000,
    max: 10000000,
    description: "Mức ngân sách cho nội thất lớn: sofa, giường, bàn ăn.",
  },
  {
    id: "budget-over-10m",
    slug: "over-10m",
    name: "Trên 10 triệu",
    min: 10000000,
    max: null,
    description: "Đầu tư dài hạn — những món dùng 10-15 năm không đổi.",
  },
];
