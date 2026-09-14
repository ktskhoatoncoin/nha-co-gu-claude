import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-linen bg-ivory">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm tracking-wide text-wood mb-4">Nhà Có Gu</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-ink text-balance">
              Để em chọn đồ đẹp cho nhà anh
            </h1>
            <p className="mt-5 text-lg text-charcoal/80 max-w-lg">
              Nội thất, decor và đồ gia dụng được tuyển chọn theo gu, không gian và ngân sách của bạn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-charcoal transition-colors"
              >
                Chọn đồ cho nhà tôi
              </Link>
              <Link
                href="/products?sort=nha-co-gu-chon"
                className="rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Xem Top Picks
              </Link>
            </div>
          </div>

          <div className="relative aspect-4/5 lg:aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://picsum.photos/seed/ncg-hero/1200/1200"
              alt="Phòng khách phong cách Japandi được tuyển chọn bởi Nhà Có Gu"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
