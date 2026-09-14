"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="vi">
      <body>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-sm text-wood mb-3">Đã có lỗi xảy ra</p>
          <h1 className="font-display text-2xl text-ink mb-3">Không thể tải trang này ngay lúc này</h1>
          <p className="text-stone mb-8">Vui lòng thử lại. Nếu lỗi tiếp diễn, hãy quay về trang chủ.</p>
          <button
            type="button"
            onClick={reset}
            className="inline-block rounded-full bg-ink text-paper px-6 py-3 text-sm"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
