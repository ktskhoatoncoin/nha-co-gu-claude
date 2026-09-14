import { articles } from "@/lib/data/articles";
import { timeAgoOrDate } from "@/lib/format";

export default function AdminArticlesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-ink">Bài viết ({articles.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-stone border-b border-linen">
              <th className="py-2 pr-3 font-medium">Tiêu đề</th>
              <th className="py-2 pr-3 font-medium">Chuyên mục</th>
              <th className="py-2 pr-3 font-medium">Ngày đăng</th>
              <th className="py-2 pr-3 font-medium">Affiliate</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-xs text-stone max-w-xl">
        Quản lý bài viết trong bản demo V1 hiện chỉ ở chế độ xem. CRUD bài viết dùng cùng khuôn mẫu với sản phẩm
        (lib/admin/store.ts) và sẽ được nối vào bảng <code>articles</code> khi tích hợp Supabase.
      </p>
    </div>
  );
}
