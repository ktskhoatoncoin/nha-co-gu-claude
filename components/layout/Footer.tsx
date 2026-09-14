import Link from "next/link";
import { categories } from "@/lib/data/categories";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/90 mt-24">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-lg text-paper">Nhà Có Gu</span>
            <p className="mt-3 text-sm text-paper/60 max-w-xs">
              Chọn đúng một món – đẹp cả căn nhà. Chúng tôi không bán mọi thứ, chỉ chọn những thứ đáng mua.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper mb-3">Nhóm sản phẩm</h3>
            <ul className="space-y-2 text-sm text-paper/60">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="hover:text-paper transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper mb-3">Về Nhà Có Gu</h3>
            <ul className="space-y-2 text-sm text-paper/60">
              <li><Link href="/about" className="hover:text-paper transition-colors">Về Nhà Có Gu</Link></li>
              <li><Link href="/about#nguyen-tac" className="hover:text-paper transition-colors">Nguyên tắc tuyển chọn</Link></li>
              <li><Link href="/blog" className="hover:text-paper transition-colors">Góc kiến trúc sư</Link></li>
              <li><Link href="/lien-he" className="hover:text-paper transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper mb-3">Chính sách</h3>
            <ul className="space-y-2 text-sm text-paper/60">
              <li><Link href="/chinh-sach/affiliate" className="hover:text-paper transition-colors">Chính sách affiliate</Link></li>
              <li><Link href="/chinh-sach/dieu-khoan" className="hover:text-paper transition-colors">Điều khoản</Link></li>
              <li><Link href="/chinh-sach/rieng-tu" className="hover:text-paper transition-colors">Chính sách riêng tư</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/15 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-paper/50 max-w-2xl">
            Một số liên kết trên Nhà Có Gu có thể là liên kết tiếp thị liên kết (affiliate). Khi bạn mua hàng
            qua liên kết này, chúng tôi có thể nhận được hoa hồng mà không làm tăng giá bạn phải trả.
          </p>
          <p className="text-xs text-paper/40">© {new Date().getFullYear()} Nhà Có Gu. Dữ liệu sản phẩm trong bản demo là dữ liệu mẫu.</p>
        </div>
      </div>
    </footer>
  );
}
