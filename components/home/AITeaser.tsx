import Image from "next/image";

export default function AITeaser() {
  return (
    <section className="bg-ivory border-y border-linen">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="ncg-eyebrow text-xs tracking-wide text-wood mb-3">Sắp ra mắt</p>
            <h2 className="ncg-h2 text-3xl leading-tight">
              Chụp căn phòng — AI chọn đồ cho bạn
            </h2>
            <p className="mt-4 text-charcoal/80 max-w-md">
              Một ngày không xa, bạn chỉ cần chụp căn phòng. Nhà Có Gu sẽ giúp bạn tìm phong cách, màu sắc
              và những món đồ phù hợp — dựa trên đúng những gì đang có trong nhà bạn.
            </p>
            <span className="mt-6 inline-flex items-center rounded-full border border-linen text-stone px-5 py-2.5 text-sm">
              Sắp ra mắt
            </span>
          </div>
          <div className="relative aspect-4/3 rounded-lg overflow-hidden">
            <Image
              src="/images/home/ai-teaser.jpg"
              alt="Minh họa tính năng AI chọn đồ nội thất sắp ra mắt"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
