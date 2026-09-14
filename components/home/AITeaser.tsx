import Image from "next/image";

export default function AITeaser() {
  return (
    <section className="border-y border-linen bg-ink">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-paper/50 mb-3">Sắp ra mắt</p>
            <h2 className="font-display text-3xl text-paper leading-tight">
              Chụp căn phòng — AI chọn đồ cho bạn
            </h2>
            <p className="mt-4 text-paper/70 max-w-md">
              Một ngày không xa, bạn chỉ cần chụp căn phòng. Nhà Có Gu sẽ giúp bạn tìm phong cách, màu sắc
              và những món đồ phù hợp — dựa trên đúng những gì đang có trong nhà bạn.
            </p>
            <span className="mt-6 inline-flex items-center rounded-full border border-paper/30 px-5 py-2.5 text-sm text-paper/80">
              Sắp ra mắt
            </span>
          </div>
          <div className="relative aspect-4/3 rounded-lg overflow-hidden opacity-90">
            <Image
              src="https://picsum.photos/seed/ncg-ai-teaser/1000/750"
              alt="Minh họa tính năng AI chọn đồ nội thất sắp ra mắt"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
