# Nhà Có Gu — Affiliate Interior & Home Lifestyle Platform (V1)

> "Chọn đúng một món – đẹp cả căn nhà."

Nhà Có Gu là một website affiliate về nội thất, decor, đèn và đồ gia dụng,
được thiết kế theo hướng **editorial / tuyển chọn** thay vì một marketplace
bán đại trà. Tài liệu này mô tả kiến trúc, cách chạy local, và những gì cần
làm để đưa bản V1 (demo) lên môi trường production thật.

## 1. Tổng quan

- **Không phải marketplace.** Không giỏ hàng, không thanh toán, không flash
  sale. Mỗi trang trả lời một câu hỏi: nên mua gì, vì sao, có hợp nhà mình
  không, giá bao nhiêu, có lựa chọn nào khác.
- **Affiliate-first.** Doanh thu đến từ hoa hồng khi người dùng click "Xem
  sản phẩm" và mua hàng trên Shopee / TikTok Shop / Lazada / website thương
  hiệu. Toàn bộ liên kết trong bản demo là placeholder (`example.com/...`) —
  xem mục 8.
- **V1 hiện tại chạy hoàn toàn trên dữ liệu tĩnh** (`lib/data/*.ts`), không
  cần Supabase để chạy demo. Mục 5–6 mô tả cách migrate sang Supabase khi
  sẵn sàng, mà **không cần sửa bất kỳ component UI nào** — chỉ thay lớp đọc
  dữ liệu.

## 2. Kiến trúc & Tech stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**
- `lib/types.ts` — data model dùng chung, được thiết kế map 1:1 sang bảng
  Postgres/Supabase (xem mục 6).
- `lib/data/*.ts` — seed data (10 categories, 5 rooms, 6 styles, 5 budget
  tier, 50 sản phẩm, 10 bài viết). Đây là "data layer" — component UI không
  bao giờ hard-code sản phẩm, chỉ import từ đây.
- `lib/admin/store.ts` — lớp CRUD demo cho khu vực `/admin`, lưu các thay
  đổi (override / tạo mới / xóa) vào `localStorage` **đè lên** seed data.
  Đây là điểm duy nhất cần thay khi nối Supabase thật (xem mục 6.3).
- `lib/analytics.ts` — các hàm `trackAffiliateClick`, `trackProductView`,
  `trackSearch`, `trackCategoryView`, `trackArticleView`, `trackOutboundClick`.
  Hiện ghi vào `localStorage`; production sẽ insert vào bảng
  `affiliate_clicks` (xem mục 6.2).
- `lib/hooks/useWishlist.ts`, `lib/hooks/useCompare.ts` — wishlist & so
  sánh tối đa 3 sản phẩm, lưu trên `localStorage`, dùng
  `useSyncExternalStore` để tránh lỗi hydration.
- `components/` — chia theo `layout/`, `ui/` (dùng chung), `home/`,
  `product/`, `admin/`.
- Mọi trang danh sách/chi tiết dùng `generateStaticParams` +
  `generateMetadata` để SSG và tối ưu SEO.

### Vì sao không dùng next/font/google?

Môi trường build hiện tại không có quyền truy cập mạng tới
`fonts.googleapis.com`, nên layout dùng font-stack hệ thống (khai báo ở
`app/globals.css`, biến `--font-display` / `--font-body`). Khi deploy ở môi
trường có mạng, khôi phục `next/font/google` với **Fraunces** (display) +
**Inter** (body) — xem comment trong `app/layout.tsx`.

## 3. Thiết kế (Design system)

- **Màu:** warm white `#FAF6F0`, ivory `#F1E9DC`, linen `#E8DDC9`, stone
  `#8C8275`, charcoal `#2A2621`, ink `#1C1916`, wood (accent) `#A9613F`.
  Khai báo tại `app/globals.css` (`@theme inline`).
- **Type scale:** serif cho display/heading, sans cho UI/body (xem mục 2).
- **Card sản phẩm:** ảnh tỉ lệ 4:5, tối đa 2 badge/card, CTA luôn là "Xem
  sản phẩm" — không dùng "Mua ngay".
- Ảnh trong bản demo dùng `picsum.photos` (placeholder, không vi phạm bản
  quyền) — thay bằng ảnh sản phẩm thật khi có dữ liệu affiliate thật.

## 4. Chạy local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # kiểm tra production build
npm run start    # chạy bản đã build
npm run lint
```

Không cần biến môi trường nào để chạy demo V1. Copy `.env.example` thành
`.env.local` nếu muốn thử admin password khác hoặc chuẩn bị Supabase.

## 5. Trạng thái V1 (đã có / demo hoá)

| Hạng mục | Trạng thái |
| --- | --- |
| Homepage đủ 8 section theo brief | Hoàn thành |
| `/products` (search, filter, sort) | Hoàn thành (client-side) |
| `/product/[slug]` (score, pros/cons, JSON-LD) | Hoàn thành |
| `/category`, `/rooms`, `/styles`, `/budget` | Hoàn thành |
| `/compare` (tối đa 3), `/wishlist` | Hoàn thành (localStorage) |
| `/blog`, `/blog/[slug]` | Hoàn thành |
| `/admin` (dashboard, CRUD sản phẩm, bài viết, analytics) | Hoàn thành (demo store) |
| Affiliate click tracking | Hoàn thành (demo, localStorage) |
| SEO: metadata, sitemap.xml, robots.txt, JSON-LD Product | Hoàn thành |
| Error/empty states (404, product/category not found, empty search) | Hoàn thành |
| Accessibility cơ bản (alt text, focus visible, aria-label) | Hoàn thành |
| Supabase / Postgres thật | Chưa nối — xem mục 6 |
| Admin Auth thật | Chỉ có password gate demo — xem mục 7 |
| AI chọn đồ theo ảnh phòng | Chỉ là teaser UI, không triển khai (đúng yêu cầu V1) |

## 6. Chuyển sang Supabase (khi sẵn sàng)

### 6.1 Schema đề xuất

```sql
create table categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text,
  hero_image text
);

create table rooms (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text,
  common_problems text[],
  hero_image text
);

create table styles (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text,
  hero_image text
);

create table products (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  category_id text references categories(id),
  subcategory text,
  price numeric not null,
  original_price numeric,
  currency text default 'VND',
  image_url text,
  gallery text[],
  rating numeric,
  review_count integer default 0,
  sold_count integer default 0,
  merchant_name text,
  platform text check (platform in ('shopee','tiktok_shop','lazada','brand','other')),
  affiliate_url text not null,
  commission_rate numeric,
  commission_type text check (commission_type in ('percentage','fixed')),
  commission_updated_at timestamptz,
  our_score numeric,
  design_score numeric,
  price_score numeric,
  function_score numeric,
  material_score numeric,
  value_score numeric,
  content_score numeric,
  badge text[],
  is_featured boolean default false,
  is_hero boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_rooms (product_id text references products(id), room_id text references rooms(id), primary key (product_id, room_id));
create table product_styles (product_id text references products(id), style_id text references styles(id), primary key (product_id, style_id));

create table articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image text,
  author text,
  published_at date,
  reading_time_minutes integer,
  category text,
  content jsonb,
  related_product_slugs text[],
  has_affiliate_links boolean default false
);

create table affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(id),
  platform text,
  timestamp timestamptz default now(),
  referrer text,
  page text,
  device_type text,
  session_id text,
  campaign text,
  source text,
  medium text,
  content text
);
```

### 6.2 Thay `lib/analytics.ts`

Giữ nguyên chữ ký hàm (`trackAffiliateClick`, `trackProductView`, ...) và
đổi phần thân để gọi `supabase.from('affiliate_clicks').insert(...)` (hoặc
qua một API route `/api/track`) thay vì ghi `localStorage`. Không component
nào khác cần sửa.

### 6.3 Thay `lib/data/*.ts` và `lib/admin/store.ts`

- Đổi `getActiveProducts()`, `getProductBySlug()` trong
  `lib/data/products.ts` thành server-side fetch từ Supabase (React Server
  Component hoặc route handler).
- `lib/admin/store.ts` đổi từ localStorage sang gọi Supabase client với
  service role key (chỉ ở server) cho các thao tác create/update/delete.
- Giữ nguyên `ProductFormValues` và các hàm `createAdminProduct` /
  `updateAdminProduct` / `deleteAdminProduct` — chỉ đổi phần triển khai bên
  trong để UI admin không cần sửa.

## 7. Admin — bảo mật (quan trọng trước khi go-live)

`components/admin/AdminGate.tsx` hiện chỉ là **demo gate phía client**
(so sánh mật khẩu trong bundle JS) — **không an toàn**, chỉ để tránh
`/admin` mở hoàn toàn công khai trong bản demo. Trước khi production:

1. Bật Supabase Auth (email/password hoặc magic link) cho tài khoản admin.
2. Thêm `middleware.ts` chặn `/admin/**` ở tầng server, kiểm tra session
   Supabase hợp lệ trước khi render bất kỳ page admin nào.
3. Xóa `AdminGate.tsx` và biến `NEXT_PUBLIC_ADMIN_DEMO_PASSWORD`.

`app/robots.ts` đã disallow `/admin` với search engine, nhưng đó không phải
là biện pháp bảo mật.

## 8. Quản lý Affiliate URL

- **V1 không tự động scrape** Shopee/TikTok/Lazada — đúng theo yêu cầu.
  Affiliate URL được nhập thủ công qua form admin (`affiliateUrl`).
- Toàn bộ affiliate URL trong seed data là placeholder dạng
  `https://example.com/affiliate/<slug>?demo=true` và được đánh dấu
  `isDemoData: true` trong data model. **Không dùng các URL này để đi live**
  — thay bằng link affiliate thật trước khi publish.
- `commissionRate` / `commissionUpdatedAt` có thể cập nhật độc lập theo
  từng sản phẩm qua form admin, không hard-code tỉ lệ hoa hồng cố định.

## 9. Seed data

- 10 categories, 5 rooms, 6 styles, 5 budget tier — `lib/data/categories.ts`,
  `rooms.ts`, `styles.ts`.
- 50 sản phẩm mẫu (đủ 10 nhóm × 5 loại theo brief) — nội dung ở
  `lib/data/product-specs.ts`, được `lib/data/products.ts` build thành đối
  tượng `Product` đầy đủ (tính điểm tổng, badge, slug, ảnh placeholder...).
- 10 bài viết editorial — `lib/data/articles.ts`, viết theo giọng tư vấn có
  quan điểm, có ưu/nhược, không phải nội dung AI chung chung.
- Tất cả sản phẩm/bài viết đều được đánh dấu là dữ liệu mẫu ở nơi hiển thị
  cho người dùng (chân trang, trang chi tiết sản phẩm).

## 10. Roadmap V2 (không triển khai ở V1, đúng theo brief)

- **AI Interior Assistant**: người dùng upload ảnh phòng → phân tích room
  type, style, color palette, layout → gợi ý sản phẩm từ database. Data
  model (`roomIds`, `styleIds`, `subcategory`, `suitedFor.size/budget`) đã
  được thiết kế sẵn để phục vụ truy vấn kiểu "tìm đèn phù hợp phòng ngủ
  Japandi 12m² dưới 800K" khi tính năng này được xây.
- Import affiliate tự động khi có API/quyền hợp lệ từ các sàn.
- Reporting engine đầy đủ (CTR, conversion rate, EPC, revenue) dựa trên
  bảng `affiliate_clicks` đã có sẵn cấu trúc.

## 11. Giới hạn đã biết của bản demo này

- Không có network access tới Google Fonts trong môi trường build hiện
  tại → dùng font hệ thống thay vì Fraunces/Inter (xem mục 2).
- Ảnh sản phẩm là placeholder từ `picsum.photos`, không phải ảnh thật.
- `/admin` chưa có auth thật (mục 7).
- Filter ở `/products` chạy client-side trên toàn bộ 50 sản phẩm — đủ cho
  demo, nhưng khi có hàng nghìn sản phẩm thật cần chuyển sang server-side
  filter/pagination qua Supabase.
