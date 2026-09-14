"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/ui/ProductGrid";

export default function TopPicksTabs({
  collections,
}: {
  collections: { key: string; label: string; products: Product[] }[];
}) {
  const [active, setActive] = useState(collections[0]?.key);
  const current = collections.find((c) => c.key === active) ?? collections[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Bộ sưu tập Top Picks">
        {collections.map((c) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={active === c.key}
            onClick={() => setActive(c.key)}
            className={`rounded-full px-4 py-2 text-sm transition-colors border ${
              active === c.key
                ? "bg-ink text-paper border-ink"
                : "border-linen text-charcoal hover:border-wood"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <ProductGrid products={current?.products.slice(0, 4) ?? []} />
    </div>
  );
}
