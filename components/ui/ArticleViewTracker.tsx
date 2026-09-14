"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/lib/analytics";

export default function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    trackArticleView(articleId);
  }, [articleId]);
  return null;
}
