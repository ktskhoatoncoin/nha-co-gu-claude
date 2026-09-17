"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Article } from "@/lib/types";
import { ArticleStatus } from "@/lib/cms/articles";
import { getAdminArticles } from "@/lib/admin/articles";
import AdminArticleForm from "@/components/admin/AdminArticleForm";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<(Article & { status: ArticleStatus }) | null | undefined>(undefined);
  useEffect(() => { getAdminArticles().then((items) => setArticle(items.find((item) => item.id === params.id))).catch(() => setArticle(null)); }, [params.id]);
  if (article === undefined) return null;
  if (!article) return <p className="text-stone">Không tìm thấy bài viết này.</p>;
  return <div><h2 className="font-display text-xl text-ink mb-6">Sửa: {article.title}</h2><AdminArticleForm article={article} /></div>;
}
