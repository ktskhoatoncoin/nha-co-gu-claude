import { Badge } from "@/lib/types";
import { badgeLabels } from "@/lib/format";

const styleMap: Record<Badge, string> = {
  nha_co_gu_chon: "bg-wood text-paper",
  dang_tien: "bg-moss/90 text-paper",
  duoi_500k: "bg-ivory text-charcoal border border-linen",
  phu_hop_nha_nho: "bg-ivory text-charcoal border border-linen",
  san_pham_noi_bat: "bg-ink text-paper",
};

export default function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${styleMap[badge]}`}
    >
      {badgeLabels[badge]}
    </span>
  );
}
