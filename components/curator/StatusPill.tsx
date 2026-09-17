import { ProductStatus, statusLabels } from "@/lib/curator/types";

const styles: Record<ProductStatus, string> = {
  DRAFT: "border-linen text-stone",
  REVIEW: "border-wood/40 text-wood",
  APPROVED: "border-moss/50 text-moss",
  FEATURED: "border-ink bg-ink text-paper",
  REJECTED: "border-alert/40 text-alert",
  ARCHIVED: "border-linen text-stone/70",
};

export default function StatusPill({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`ncg-label inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
