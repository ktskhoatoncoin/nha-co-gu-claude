import Link from "next/link";
import HeroImage from "@/components/home/HeroImage";

export default function Hero() {
  return (
    <section className="border-b border-linen bg-ivory">
      <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="ncg-eyebrow text-sm tracking-wide text-wood mb-4">Nhà Có Gu</p>
            <h1 className="ncg-h1 text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.14] max-w-xl">
              <span className="block">Để em chọn đồ đẹp</span>
              <span className="block">cho nhà anh chị</span>
            </h1>
            <p className="mt-5 text-lg text-charcoal/80 max-w-lg">
              Nội thất, decor và đồ gia dụng được tuyển chọn theo gu, không gian và ngân sách của bạn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="ncg-button rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-charcoal transition-colors"
              >
                Chọn đồ cho nhà tôi
              </Link>
              <Link
                href="/products?sort=nha-co-gu-chon"
                className="ncg-button rounded-full border border-ink px-6 py-3 text-sm text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Xem Top Picks
              </Link>
            </div>
          </div>

          <HeroImage
            src="/images/home/hero-image-map.png"
            alt="Nhà Có Gu — bản đồ hình ảnh giới thiệu các chuyên mục không gian và phong cách"
          />
        </div>
      </div>
    </section>
  );
}
