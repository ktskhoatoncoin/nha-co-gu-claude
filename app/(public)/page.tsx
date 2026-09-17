import Hero from "@/components/home/Hero";
import ImageCardGrid from "@/components/home/ImageCardGrid";
import AITeaser from "@/components/home/AITeaser";
import TopPicksTabs from "@/components/home/TopPicksTabs";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/ui/ProductGrid";
import ArticleCard from "@/components/ui/ArticleCard";
import { rooms } from "@/lib/data/rooms";
import { styles } from "@/lib/data/styles";
import { getCmsArticles } from "@/lib/cms/articles";
import { getCmsProducts } from "@/lib/cms/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, articles] = await Promise.all([getCmsProducts(), getCmsArticles()]);
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const under500k = products.filter((p) => p.price <= 500000).slice(0, 8);
  const latestArticles = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

  const dangMua = [...products].sort((a, b) => b.ourScore - a.ourScore);
  const giaTot = [...products].sort((a, b) => a.price - b.price);
  const nhaNho = products.filter((p) => p.badges.includes("phu_hop_nha_nho"));
  const premium = [...products].sort((a, b) => b.price - a.price);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Chọn theo không gian" subtitle="Bắt đầu từ căn phòng bạn đang muốn thay đổi." />
        <ImageCardGrid
          aspect="aspect-[4/3]"
          items={rooms.map((r) => ({
            href: `/rooms/${r.slug}`,
            name: r.name,
            description: r.description,
            image: r.heroImage,
          }))}
        />
      </section>

      <section className="bg-ivory border-y border-linen">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeading title="Chọn theo phong cách" subtitle="Mỗi phong cách kể một câu chuyện khác nhau về ngôi nhà." />
          <ImageCardGrid
            aspect="aspect-square"
            items={styles.map((s) => ({
              href: `/styles/${s.slug}`,
              name: s.name,
              description: s.description,
              image: s.heroImage,
            }))}
          />
        </div>
      </section>

      <section className="bg-ivory border-y border-linen">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeading
            title="Nhà Có Gu chọn"
            subtitle="Những sản phẩm chúng tôi tin là đáng mua nhất ở thời điểm hiện tại."
            cta={{ href: "/products?sort=nha-co-gu-chon", label: "Xem tất cả" }}
          />
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          title="Đồ đẹp dưới 500K"
          subtitle="Những món nhỏ nhưng có thể thay đổi cảm giác của cả căn phòng."
          cta={{ href: "/budget/under-300k", label: "Xem theo ngân sách" }}
        />
        <ProductGrid products={under500k} />
      </section>

      <section className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          title="Góc kiến trúc sư"
          subtitle="Kiến thức giúp bạn quyết định tốt hơn, không chỉ để bán hàng."
          cta={{ href: "/blog", label: "Xem tất cả bài viết" }}
        />
        <div className="grid gap-8 sm:grid-cols-3">
          {latestArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      <section className="bg-ivory border-y border-linen">
        <div className="mx-auto max-w-(--container-content) px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeading title="Top Picks" subtitle="Những bộ sưu tập được tuyển chọn theo từng nhu cầu." />
          <TopPicksTabs
            collections={[
              { key: "dang-mua", label: "Đáng mua nhất", products: dangMua },
              { key: "gia-tot", label: "Giá tốt nhất", products: giaTot },
              { key: "nha-nho", label: "Nhà nhỏ nên mua", products: nhaNho },
              { key: "duoi-500k", label: "Dưới 500K", products: under500k },
              { key: "premium", label: "Premium Picks", products: premium },
            ]}
          />
        </div>
      </section>

      <AITeaser />
    </>
  );
}
