"use client";

import { ExternalLink } from "lucide-react";
import { Product } from "@/lib/types";
import { platformLabels } from "@/lib/format";
import { trackAffiliateClick, trackOutboundClick } from "@/lib/analytics";

export default function AffiliateButton({ product, page }: { product: Product; page: string }) {
  function handleClick() {
    trackAffiliateClick({ productId: product.id, platform: product.platform, page });
    trackOutboundClick(product.affiliateUrl, "product_detail");
  }

  return (
    <div>
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={handleClick}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper hover:bg-charcoal transition-colors"
      >
        Xem sản phẩm trên {platformLabels[product.platform]}
        <ExternalLink className="size-4" />
      </a>
      <p className="mt-2 text-xs text-stone">
        Bạn sẽ được chuyển tới {platformLabels[product.platform]}. Đây là liên kết tiếp thị liên kết — Nhà Có Gu có
        thể nhận hoa hồng mà không làm tăng giá bạn phải trả.
      </p>
    </div>
  );
}
