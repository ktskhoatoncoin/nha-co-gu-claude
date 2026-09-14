"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";

export default function SaveButton({ productId }: { productId: string }) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink px-6 py-3.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
    >
      <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Đã lưu sản phẩm" : "Lưu sản phẩm"}
    </button>
  );
}
