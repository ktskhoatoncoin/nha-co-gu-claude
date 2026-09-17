import type { MetadataRoute } from "next";
import { categories } from "@/lib/data/categories";
import { rooms } from "@/lib/data/rooms";
import { styles, budgetTiers } from "@/lib/data/styles";
import { getActiveProducts } from "@/lib/data/products";
import { articles } from "@/lib/data/articles";

const BASE_URL = "https://nhacogu.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/blog", "/compare", "/wishlist", "/about"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({ url: `${BASE_URL}/category/${c.slug}`, lastModified: new Date() }));
  const roomRoutes = rooms.map((r) => ({ url: `${BASE_URL}/rooms/${r.slug}`, lastModified: new Date() }));
  const styleRoutes = styles.map((s) => ({ url: `${BASE_URL}/styles/${s.slug}`, lastModified: new Date() }));
  const budgetRoutes = budgetTiers.map((b) => ({ url: `${BASE_URL}/budget/${b.slug}`, lastModified: new Date() }));
  const productRoutes = getActiveProducts().map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(p.updatedAt),
  }));
  const articleRoutes = articles.map((a) => ({ url: `${BASE_URL}/blog/${a.slug}`, lastModified: new Date(a.date) }));

  return [...staticRoutes, ...categoryRoutes, ...roomRoutes, ...styleRoutes, ...budgetRoutes, ...productRoutes, ...articleRoutes];
}
