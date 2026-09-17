"use client";

import { useEffect } from "react";
import { trackProductView } from "@/lib/analytics";

export default function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackProductView(productId);
  }, [productId]);
  return null;
}
