import { Badge } from "@/lib/types";

export function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Returns an original price only when it represents a real discount. */
export function getDisplayOriginalPrice(
  price: number,
  originalPrice: number | null | undefined
): number | null {
  if (!Number.isFinite(price) || price <= 0) return null;
  if (originalPrice == null || !Number.isFinite(originalPrice) || originalPrice <= price) return null;
  return originalPrice;
}

export function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export const badgeLabels: Record<Badge, string> = {
  nha_co_gu_chon: "Nhà Có Gu chọn",
  dang_tien: "Đáng tiền",
  duoi_500k: "Dưới 500K",
  phu_hop_nha_nho: "Phù hợp nhà nhỏ",
  san_pham_noi_bat: "Sản phẩm nổi bật",
};

export const platformLabels: Record<string, string> = {
  shopee: "Shopee",
  tiktok_shop: "TikTok Shop",
  lazada: "Lazada",
  brand: "Website thương hiệu",
  other: "Khác",
};

export function timeAgoOrDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
