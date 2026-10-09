import { Product } from "@/lib/types";
import { products } from "@/lib/data/products";

// Curated fallback only. The canonical CMS remains the source of truth whenever
// it has published rows. IDs/slugs and editorial metadata come from the existing
// static catalogue; only demo presentation flags and local illustrative images
// are overlaid here.
const curatedImageBySlug: Record<string, string> = {
  "den-ban-lam-viec-dang-gap-led-3-che-do": "/images/products/demo/den-ban-gap-led-3-che-do.png",
  "guong-decor-vien-go-tan-bi-bo-tron": "/images/products/demo/guong-decor-go-tan-bi.png",
  "binh-hoa-decor-gom-men-ran": "/images/products/demo/binh-hoa-gom-men-ran.png",
  "dong-ho-treo-tuong-mat-so-toi-gian": "/images/products/demo/dong-ho-treo-tuong-toi-gian.png",
  "ke-gia-vi-goc-bep-xoay-360-do": "/images/products/demo/ke-gia-vi-xoay-360.png",
  "ke-de-do-goc-ban-lam-viec-3-tang": "/images/products/demo/ke-goc-ban-3-tang.png",
  "chau-cay-decor-xi-mang-mai-dang-tru": "/images/products/demo/chau-cay-xi-mang-tru.png",
  "gia-do-man-hinh-may-tinh-co-ngan-keo": "/images/products/demo/gia-do-man-hinh-co-ngan-keo.png",
  "den-cay-phong-khach-chan-go-3-chau": "/images/products/demo/den-cay-phong-khach-chan-go-3-chau.png",
  "ban-lam-viec-go-cong-nghiep-120cm": "/images/products/demo/ban-lam-viec-go-cong-nghiep-120cm.png",
  "ghe-cong-thai-hoc-luoi-lung-cao": "/images/products/demo/ghe-cong-thai-hoc-luoi-lung-cao.png",
  "giuong-ngu-khung-go-cao-cap-1m8": "/images/products/demo/giuong-ngu-khung-go-cao-cap-1m8.png",
  "bo-noi-chao-chong-dinh-5-mon-day-tu": "/images/products/demo/bo-noi-chao-chong-dinh-5-mon-day-tu.png",
  "robot-hut-bui-lau-nha-hut-am-tu-dong": "/images/products/demo/robot-hut-bui-lau-nha-hut-am-tu-dong.png",
  "sofa-bang-2m2-ni-bo-thao-vo-giat-duoc": "/images/products/demo/sofa-bang-2m2-ni-bo-thao-vo-giat-duoc.png",
  "den-tha-ban-an-dang-chuong-gom": "/images/products/demo/den-tha-ban-an-dang-chuong-gom.png",
};

const curatedSlugs = Object.keys(curatedImageBySlug);
const featuredSlugs = new Set([
  "den-cay-phong-khach-chan-go-3-chau",
  "ban-lam-viec-go-cong-nghiep-120cm",
  "ghe-cong-thai-hoc-luoi-lung-cao",
  "giuong-ngu-khung-go-cao-cap-1m8",
  "bo-noi-chao-chong-dinh-5-mon-day-tu",
  "robot-hut-bui-lau-nha-hut-am-tu-dong",
  "sofa-bang-2m2-ni-bo-thao-vo-giat-duoc",
  "den-tha-ban-an-dang-chuong-gom",
]);

export const curatedDemoProducts: Product[] = curatedSlugs.flatMap((slug) => {
  const product = products.find((candidate) => candidate.slug === slug);
  if (!product) return [];

  return [{
    ...product,
    imageUrl: curatedImageBySlug[slug],
    gallery: [curatedImageBySlug[slug]],
    isFeatured: featuredSlugs.has(slug),
    isDemoData: true,
    // No verified commercial destination is supplied for demo content.
    affiliateUrl: "",
  }];
});
