import { Category, Style } from "@/lib/curator/types";

/** Categories are data, not hard-coded unions — new ones can be appended
 *  here (or later loaded from a table) without touching any component. */
export const curatorCategories: Category[] = [
  {
    id: "cat-sofa",
    name: "Sofa",
    slug: "sofa",
    subcategories: [
      { id: "sub-sofa-bang", name: "Sofa băng", slug: "sofa-bang" },
      { id: "sub-sofa-goc", name: "Sofa góc", slug: "sofa-goc" },
      { id: "sub-sofa-don", name: "Ghế sofa đơn", slug: "sofa-don" },
    ],
  },
  {
    id: "cat-ban",
    name: "Bàn",
    slug: "ban",
    subcategories: [
      { id: "sub-ban-tra", name: "Bàn trà", slug: "ban-tra" },
      { id: "sub-ban-an", name: "Bàn ăn", slug: "ban-an" },
      { id: "sub-ban-lam-viec", name: "Bàn làm việc", slug: "ban-lam-viec" },
      { id: "sub-ban-console", name: "Bàn console", slug: "ban-console" },
    ],
  },
  {
    id: "cat-ghe",
    name: "Ghế",
    slug: "ghe",
    subcategories: [
      { id: "sub-ghe-an", name: "Ghế ăn", slug: "ghe-an" },
      { id: "sub-ghe-thu-gian", name: "Ghế thư giãn", slug: "ghe-thu-gian" },
      { id: "sub-ghe-lam-viec", name: "Ghế làm việc", slug: "ghe-lam-viec" },
    ],
  },
  {
    id: "cat-giuong",
    name: "Giường",
    slug: "giuong",
    subcategories: [
      { id: "sub-giuong-go", name: "Giường gỗ", slug: "giuong-go" },
      { id: "sub-giuong-boc-ni", name: "Giường bọc nỉ", slug: "giuong-boc-ni" },
    ],
  },
  {
    id: "cat-tu",
    name: "Tủ",
    slug: "tu",
    subcategories: [
      { id: "sub-tu-quan-ao", name: "Tủ quần áo", slug: "tu-quan-ao" },
      { id: "sub-tu-dau-giuong", name: "Tủ đầu giường", slug: "tu-dau-giuong" },
      { id: "sub-tu-giay", name: "Tủ giày", slug: "tu-giay" },
    ],
  },
  {
    id: "cat-ke",
    name: "Kệ",
    slug: "ke",
    subcategories: [
      { id: "sub-ke-sach", name: "Kệ sách", slug: "ke-sach" },
      { id: "sub-ke-tv", name: "Kệ TV", slug: "ke-tv" },
      { id: "sub-ke-trang-tri", name: "Kệ trang trí", slug: "ke-trang-tri" },
    ],
  },
  {
    id: "cat-den",
    name: "Đèn",
    slug: "den",
    subcategories: [
      { id: "sub-den-ban", name: "Đèn bàn", slug: "den-ban" },
      { id: "sub-den-cay", name: "Đèn cây", slug: "den-cay" },
      { id: "sub-den-tha", name: "Đèn thả", slug: "den-tha" },
      { id: "sub-den-tuong", name: "Đèn tường", slug: "den-tuong" },
    ],
  },
  {
    id: "cat-guong",
    name: "Gương",
    slug: "guong",
    subcategories: [
      { id: "sub-guong-treo", name: "Gương treo tường", slug: "guong-treo" },
      { id: "sub-guong-dung", name: "Gương đứng", slug: "guong-dung" },
    ],
  },
  {
    id: "cat-tham",
    name: "Thảm",
    slug: "tham",
    subcategories: [
      { id: "sub-tham-phong-khach", name: "Thảm phòng khách", slug: "tham-phong-khach" },
      { id: "sub-tham-trai-san", name: "Thảm trải sàn nhỏ", slug: "tham-trai-san" },
    ],
  },
  {
    id: "cat-rem",
    name: "Rèm",
    slug: "rem",
    subcategories: [
      { id: "sub-rem-vai", name: "Rèm vải", slug: "rem-vai" },
      { id: "sub-rem-cuon", name: "Rèm cuốn", slug: "rem-cuon" },
    ],
  },
  {
    id: "cat-decor",
    name: "Decor",
    slug: "decor",
    subcategories: [
      { id: "sub-binh-hoa", name: "Bình hoa", slug: "binh-hoa" },
      { id: "sub-tuong-trang-tri", name: "Tượng trang trí", slug: "tuong-trang-tri" },
      { id: "sub-nen-thom", name: "Nến thơm", slug: "nen-thom" },
    ],
  },
  {
    id: "cat-tranh",
    name: "Tranh",
    slug: "tranh",
    subcategories: [
      { id: "sub-tranh-canvas", name: "Tranh canvas", slug: "tranh-canvas" },
      { id: "sub-tranh-khung", name: "Tranh có khung", slug: "tranh-khung" },
    ],
  },
  {
    id: "cat-cay-chau",
    name: "Cây & chậu",
    slug: "cay-chau",
    subcategories: [
      { id: "sub-chau-cay", name: "Chậu cây", slug: "chau-cay" },
      { id: "sub-ke-cay", name: "Kệ cây", slug: "ke-cay" },
    ],
  },
  {
    id: "cat-phu-kien",
    name: "Phụ kiện",
    slug: "phu-kien",
    subcategories: [
      { id: "sub-khay-go", name: "Khay gỗ", slug: "khay-go" },
      { id: "sub-moc-treo", name: "Móc treo", slug: "moc-treo" },
    ],
  },
  {
    id: "cat-ngoai-troi",
    name: "Ngoài trời",
    slug: "ngoai-troi",
    subcategories: [
      { id: "sub-ban-ghe-ban-cong", name: "Bàn ghế ban công", slug: "ban-ghe-ban-cong" },
      { id: "sub-den-san-vuon", name: "Đèn sân vườn", slug: "den-san-vuon" },
    ],
  },
];

export const curatorStyles: Style[] = [
  { id: "Minimalism", name: "Minimalism", description: "Tối giản, ít chi tiết, ưu tiên công năng" },
  { id: "Japandi", name: "Japandi", description: "Giao thoa Nhật – Bắc Âu, gỗ sáng, tông trung tính" },
  { id: "Scandinavian", name: "Scandinavian", description: "Gỗ sáng, vải tự nhiên, ánh sáng ấm" },
  { id: "Modern", name: "Modern", description: "Đường nét dứt khoát, vật liệu công nghiệp" },
  { id: "Contemporary", name: "Contemporary", description: "Đương đại, linh hoạt theo xu hướng hiện tại" },
  { id: "Wabi-Sabi", name: "Wabi-Sabi", description: "Vẻ đẹp của sự không hoàn hảo, chất liệu thô mộc" },
  { id: "Indochine", name: "Indochine", description: "Đông Dương, gỗ tối màu, mây tre, hoa văn nhẹ" },
  { id: "Tropical", name: "Tropical", description: "Nhiệt đới, cây xanh, mây tre, màu tươi" },
  { id: "Rustic", name: "Rustic", description: "Mộc mạc, gỗ thô, cảm giác thủ công" },
  { id: "Industrial", name: "Industrial", description: "Kim loại đen, bê tông, cấu trúc lộ" },
  { id: "Classic", name: "Classic", description: "Cổ điển, cân đối, chi tiết chạm khắc" },
  { id: "Luxury", name: "Luxury", description: "Vật liệu cao cấp, hoàn thiện tỉ mỉ, điểm nhấn ánh kim" },
];

export function getCategory(id: string) {
  return curatorCategories.find((c) => c.id === id);
}

export function getSubcategory(categoryId: string, subcategoryId: string | null) {
  if (!subcategoryId) return undefined;
  return getCategory(categoryId)?.subcategories.find((s) => s.id === subcategoryId);
}

export function getCategoryName(id: string) {
  return getCategory(id)?.name ?? "—";
}
