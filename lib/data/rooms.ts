import { Room } from "@/lib/types";

export const rooms: Room[] = [
  {
    id: "room-phong-khach",
    slug: "phong-khach",
    name: "Phòng khách",
    description:
      "Không gian tiếp khách nhưng cũng là nơi cả nhà dùng nhiều nhất — sofa, ánh sáng và cách sắp xếp quyết định 80% cảm giác chung của căn nhà.",
    commonProblems: [
      "Sofa quá to so với diện tích thật",
      "Chỉ có một nguồn sáng chính, thiếu đèn phụ",
      "Kệ TV chiếm hết mảng tường mà không có điểm nhấn",
    ],
    heroImage: "/images/rooms/phong-khach.jpg",
  },
  {
    id: "room-phong-ngu",
    slug: "phong-ngu",
    name: "Phòng ngủ",
    description:
      "Phòng ngủ cần ít đồ hơn bạn nghĩ. Ưu tiên chất lượng nệm, ánh sáng dịu và một tủ quần áo đủ dùng thay vì trang trí rườm rà.",
    commonProblems: [
      "Ánh sáng trắng gắt gây khó ngủ",
      "Tủ quần áo không đủ chỗ vì chọn sai kích thước",
      "Bàn trang điểm choán góc phòng nhỏ",
    ],
    heroImage: "/images/rooms/phong-ngu.jpg",
  },
  {
    id: "room-nha-bep",
    slug: "nha-bep",
    name: "Nhà bếp",
    description:
      "Bếp đẹp là bếp tiện dùng. Ưu tiên hệ kệ lưu trữ hợp lý và dụng cụ nấu ăn bền trước khi nghĩ đến trang trí.",
    commonProblems: [
      "Thiếu chỗ để đồ khô và gia vị",
      "Bộ nồi chảo không đồng bộ, khó chồng gọn",
      "Ánh sáng khu vực nấu bị khuất bóng",
    ],
    heroImage: "/images/rooms/nha-bep.jpg",
  },
  {
    id: "room-goc-lam-viec",
    slug: "goc-lam-viec",
    name: "Góc làm việc",
    description:
      "Làm việc tại nhà lâu dài cần một bộ ba: ghế đỡ lưng, bàn đủ cao, ánh sáng không gây mỏi mắt.",
    commonProblems: [
      "Ghế văn phòng không hỗ trợ lưng dưới",
      "Ngồi làm việc dưới ánh đèn trần duy nhất",
      "Bàn quá thấp hoặc quá sâu so với dáng ngồi",
    ],
    heroImage: "/images/rooms/goc-lam-viec.jpg",
  },
  {
    id: "room-ban-cong",
    slug: "ban-cong",
    name: "Ban công",
    description:
      "Một chiếc ghế, một chậu cây và ánh sáng buổi sáng — ban công không cần nhiều hơn thế để trở thành góc yêu thích trong nhà.",
    commonProblems: [
      "Đồ nội thất ngoài trời xuống cấp nhanh vì chọn sai vật liệu",
      "Ban công nhỏ nhưng chọn bàn ghế cỡ lớn",
      "Không có điểm nhấn nên hay bị biến thành kho chứa đồ",
    ],
    heroImage: "/images/rooms/ban-cong.jpg",
  },
];
