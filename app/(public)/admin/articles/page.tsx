"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { ArticleStatus } from "@/lib/cms/articles";
import { deleteAdminArticle, getAdminArticles } from "@/lib/admin/articles";
import { timeAgoOrDate } from "@/lib/format";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<(Article & { status: ArticleStatus })[]>([]);
  useEffect(() => { getAdminArticles().then(setArticles).catch(() => setArticles([])); }, []);

  async function remove(article: Article) {
    if (!window.confirm(`Xóa bài viết "${article.title}"?`)) return;
    await deleteAdminArticle(article.id);
    setArticles((current) => current.filter((item) => item.id !== article.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-ink">Bài viết ({articles.length})</h2>
        <Link href="/admin/articles/new" className="rounded-full bg-ink text-paper px-4 py-2 text-sm">+ Bài viết mới</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-stone border-b border-linen">
              <th className="py-2 pr-3 font-medium">Tiêu đề</th>
              <th className="py-2 pr-3 font-medium">Chuyên mục</th>
              <th className="py-2 pr-3 font-medium">Ngày đăng</th>
              <th className="py-2 pr-3 font-medium">Affiliate</th>
              <th className="py-2 pr-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-linen/70">
                <td className="py-3 pr-3 max-w-sm">{a.title}</td>
                <td className="py-3 pr-3 text-stone">{a.category}</td>
                <td className="py-3 pr-3 text-stone">{timeAgoOrDate(a.date)}</td>
                <td className="py-3 pr-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                      a.hasAffiliateLinks ? "bg-wood/10 text-wood" : "bg-linen/60 text-stone"
                    }`}
                  >
                    {a.hasAffiliateLinks ? "Có" : "Không"}
                  </span>
                </td>
                <td className="py-3 pr-3"><Link href={`/admin/articles/${a.id}`} className="text-wood mr-3">Sửa</Link><button type="button" onClick={() => void remove(a)} className="text-alert">Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
