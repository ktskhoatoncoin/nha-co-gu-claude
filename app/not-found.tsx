import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm text-wood mb-3">404</p>
      <h1 className="font-display text-3xl text-ink mb-3">Không tìm thấy trang này</h1>
      <p className="text-stone mb-8">
        Trang, sản phẩm hoặc bài viết bạn tìm có thể đã bị gỡ hoặc đường dẫn không còn chính xác.
      </p>
      <Link href="/" className="inline-block rounded-full bg-ink text-paper px-6 py-3 text-sm">
        Về trang chủ
      </Link>
    </div>
  );
}
