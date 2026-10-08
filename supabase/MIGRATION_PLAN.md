# Kế hoạch migration Supabase tiến về phía trước — Nhà Có Gu V3.3a

**Trạng thái:** chỉ là kế hoạch. Chưa chạy SQL, chưa sửa RLS, chưa nhập seed và chưa thay đổi database.

**Cơ sở kiểm tra:** project `nha-co-gu` (`sbxjugytzwqchdysimxx`), branch Git `feature/admin-cms`, HEAD `ba013ef4`. Đã đọc schema bằng Supabase ở chế độ chỉ đọc; Supabase hiện không báo migration nào trong lịch sử.

## 1. Schema hiện tại

Tám bảng trong `public` đều bật RLS. Các số dòng dưới đây lấy bằng SQL đếm trực tiếp, vì số dòng trong metadata của `list_tables` không khớp với số đếm SQL.

| Bảng | Cột và quan hệ hiện tại | Số dòng |
| --- | --- | ---: |
| `categories` | `id bigint identity` PK; `created_at`; `name`; `slug` UNIQUE; `description`; `sort_order`; `is_active`. `products.category_id → categories.id`, `ON DELETE SET NULL`. | 1 |
| `styles` | `id bigint identity` PK; `created_at`; `name`; `slug` UNIQUE; `description`; `image_url`; `sort_order`; `is_active`. | 10 |
| `tags` | `id bigint identity` PK; `created_at`; `name` UNIQUE; `slug` UNIQUE; `description`; `is_active`. | 0 |
| `products` | `id bigint identity` PK; `created_at`; `name`; `slug` UNIQUE; `category_id bigint` nullable FK; `description`; `price`; `affiliate_url`; `image_url`; `status text DEFAULT 'draft'`; `is_featured`; `created_by_ai`. | 0 |
| `product_images` | `id bigint identity` PK; `product_id bigint` FK cascade; `image_url`; `alt_text`; `sort_order`; `is_primary`; `created_at`. | 0 |
| `product_styles` | `(product_id bigint, style_id bigint)` composite PK; cả hai FK cascade; `created_at`. | 0 |
| `product_tags` | `(product_id bigint, tag_id bigint)` composite PK; cả hai FK cascade; `created_at`. | 0 |
| `user_roles` | `user_id uuid` PK/FK tới `auth.users` cascade; `role text` check `admin/user`, default `user`; `created_at`. | 1 |

Ba bảng được code hoặc `schema.sql` nhắc đến nhưng hiện không có là `articles`, `affiliate_clicks` và `rooms`. Không có bảng/migration riêng trong thư mục `supabase` ngoài `schema.sql`.

### Dữ liệu taxonomy đã có

- `categories` hiện có slug `den`, tên `Đèn`; dữ liệu tĩnh trong `lib/data/categories.ts` có 10 danh mục, trong đó slug `den` có tên `Đèn & Chiếu sáng`.
- `styles` có đủ 10 slug trong bộ tĩnh. Một số trường `name` trong DB có newline cuối chuỗi; không nên dùng trực tiếp làm nhãn UI nếu chưa trim.
- `tags` rỗng. `lib/types.ts` biểu diễn badge bằng union cố định; badge đó không đồng nghĩa với taxonomy tag liên kết trong `product_tags`.
- Phòng (5) và ngân sách (5 tier) hiện chỉ nằm trong `lib/data/rooms.ts` và `lib/data/styles.ts`; chưa có bảng rooms, và public pages dùng các dữ liệu tĩnh này.

### Chính sách và quyền hiện tại

- RLS bật cho cả tám bảng. `categories`, `styles`, `tags` có đọc công khai bản ghi active và thao tác ghi/xóa dành cho authenticated admin qua `is_admin()`.
- `products` có đọc công khai khi `status='published'`, cùng các policy admin insert/update/delete. `product_images`, `product_styles`, `product_tags` có policy đọc theo sản phẩm published và policy admin ghi/xóa.
- `user_roles` chỉ cho authenticated user đọc role của chính họ; không có policy client để tự cấp/cập nhật role. `is_admin()` là hàm `SECURITY DEFINER`, kiểm tra `user_roles.role='admin'`.
- Chưa có policy cho `articles` hay `affiliate_clicks` vì chưa có hai bảng đó.
- CMS hiện dùng `SUPABASE_SECRET_KEY` trong server client, nên truy vấn server vượt qua RLS. `requireAdminUser()` hiện chỉ xác nhận có user đăng nhập, chưa kiểm tra role; do đó policy DB hiện tại chưa tự bảo vệ các API CMS chạy bằng secret key.

## 2. Schema đích đề xuất

Giữ nguyên UI, route, framework và cách lưu trữ dữ liệu qua lớp `lib/cms`. Không thay/xóa khóa chính hiện có và không ép đổi toàn bộ numeric ID sang text.

### Taxonomy và ID

- **Giữ** `categories.id`, `styles.id`, `tags.id` là `bigint identity`; giữ slug UNIQUE làm khóa đối chiếu ổn định.
- Thêm `categories.hero_image text` vì `Category` có `heroImage`; `styles.image_url` đã đáp ứng `Style.heroImage` sau khi mapper đổi tên trường.
- `Product.categoryId` và `styleIds` trong giao diện là khóa tĩnh dạng `cat-den`, `style-japandi`, còn DB dùng bigint. Lớp CMS cần ánh xạ qua slug (ví dụ `den`, `japandi`) và quan hệ, không gọi `Number('cat-den')` hay so sánh ID DB trực tiếp với ID tĩnh.
- Giữ năm room IDs trong `products.room_ids text[]`; không tạo bảng `rooms` chỉ để phục vụ dữ liệu đang tĩnh.
- Không nhập/cập nhật taxonomy trong migration cấu trúc. Ở bước dữ liệu sau, đối chiếu bằng slug, thêm danh mục còn thiếu theo kiểu insert idempotent, giữ các dòng dư hiện có, và duyệt riêng tên danh mục `den` đang khác nhãn tĩnh. Trim tên style ở mapper/importer; không âm thầm ghi đè dữ liệu đang có.

### `products`

Giữ `id bigint identity`, `category_id bigint` và FK hiện tại để không phá các quan hệ `product_images`, `product_styles`, `product_tags`. Bổ sung các trường còn thiếu theo model `Product`/form admin:

- Nội dung: `short_description text`, `subcategory text`.
- Phòng và ngân sách: `room_ids text[]`, `suited_for jsonb`.
- Giá/thương mại: `original_price numeric`, `currency text`, `merchant_name text`, `platform text`, `commission_rate numeric`, `commission_type text`, `commission_updated_at timestamptz`.
- Đánh giá: `rating numeric`, `review_count integer`, `sold_count integer`, `our_score numeric`, `scores jsonb`.
- Nội dung biên tập: `badges text[]`, `pros text[]`, `cons text[]`, `is_hero boolean`, `is_demo_data boolean`.
- Đồng bộ: `updated_at timestamptz` có default `now()`; code ghi cập nhật cần duy trì giá trị này.

Các cột đang có (`name`, `slug`, `description`, `price`, `affiliate_url`, `image_url`, `status`, `is_featured`, `created_by_ai`, `created_at`) được giữ. `status` tiếp tục là nguồn chuẩn cho trạng thái; mapper chuyển `status='published'` thành `isActive`, không thêm cột `is_active` trùng nghĩa. Thêm CHECK cho `platform` và `commission_type` theo union trong `lib/types.ts` nếu dữ liệu form được validate cùng quy tắc.

Giữ bảng liên kết chuẩn hóa thay vì lưu lặp nhiều bản:

- `image_url` là ảnh chính; `product_images` lưu gallery, alt text và thứ tự, rồi mapper dựng `Product.gallery`.
- `product_styles` là quan hệ style chuẩn; mapper dựng `styleIds` qua slug. `product_tags` tiếp tục tùy chọn cho tag mở rộng; `badges` vẫn là các badge UI cố định.
- `room_ids` là mảng ID tĩnh do hiện không có bảng rooms.

Việc bổ sung schema cần đi cùng một thay đổi code sau này: `fromRow`/`toRow` hiện chỉ đọc/ghi một phần trường, đọc các điểm từ cột `design_score` riêng dù model dự định lưu `scores jsonb`, ép category ID bằng `Number()` và bỏ qua ảnh/style relation. Migration đơn thuần sẽ không khôi phục đủ model nếu chưa đồng bộ mapper.

### `articles`

Tạo bảng còn thiếu theo hợp đồng đang dùng trong `lib/cms/articles.ts`: `id text` PK; `slug text UNIQUE`; `title`; `excerpt`; `cover_image`; `author`; `published_at timestamptz`; `reading_time_minutes integer`; `category`; `content jsonb`; `related_product_slugs text[]`; `has_affiliate_links boolean`; `status text` check `draft/published/hidden`; `created_at` và `updated_at` timestamptz. ID seed `art-01` tương thích.

Đề xuất RLS: public đọc `published`; CRUD admin chỉ cho user có role admin. Trước khi tạo bảng cần xử lý hành vi tự seed hiện tại: lần gọi `getCmsArticles()` khi bảng rỗng sẽ chèn 10 bài. Không chạy build/request sau khi tạo bảng rỗng cho đến khi seed được bật rõ ràng ở bước đã duyệt.

### `affiliate_clicks`

Tạo riêng khi analytics Supabase được đưa vào sử dụng. Dùng `id uuid` PK default `gen_random_uuid()`, `product_id bigint NULL` FK tới `products.id ON DELETE SET NULL`, `platform`, `timestamp timestamptz`, `referrer`, `page`, `device_type`, `session_id`, và các trường attribution `campaign/source/medium/content`. **Không dùng `product_id text` trong `schema.sql` hiện tại**, vì không tương thích với `products.id bigint`.

Code analytics hiện vẫn ghi `localStorage`, chưa gửi dữ liệu tới bảng này. Trước khi tạo policy insert công khai cần chốt đường ghi có validate (API route hoặc client có giới hạn); policy đề xuất là chỉ insert cho tracking và đọc analytics dành admin, không cho public update/delete.

## 3. Thay đổi migration đề xuất theo bước

| Bước | Thay đổi | Lý do và ảnh hưởng | Rollback |
| --- | --- | --- | --- |
| A | `ALTER TABLE categories ADD COLUMN hero_image text` (nullable trong giai đoạn đầu). | Khớp `Category.heroImage`; không sửa/xóa dòng hiện tại. | Bỏ cột chỉ khi chưa có code/data phụ thuộc; nếu đã dùng thì giữ cột và revert code đọc. |
| B | Bổ sung các cột thiếu cho `products` như danh sách trên; giữ PK/FK `bigint`, cột cũ và các bảng con. Thêm CHECK/index cần thiết sau khi xác nhận trạng thái/collation dữ liệu. | Cho phép CMS lưu model hiện tại trong schema đang có mà không thay các identity được tham chiếu. Bảng products và bảng liên kết đều đang rỗng, nhưng vẫn dùng migration additive để bảo toàn an toàn. | Trước khi có dữ liệu/code phụ thuộc có thể bỏ riêng cột mới; sau khi có dữ liệu thì không drop, chỉ rollback ứng dụng và giữ cột. Không đảo kiểu hoặc đổi PK. |
| C | Tạo `articles` với đúng kiểu CMS, unique slug và index phục vụ lọc status/ngày; bật RLS và policy public published/admin CRUD trong migration được duyệt. | Gỡ lỗi thiếu bảng cho homepage/blog/admin; tránh import dữ liệu trong migration. | Nếu bảng vẫn rỗng: bỏ policy/index và bảng mới. Sau khi có bài viết: giữ bảng/dữ liệu, rollback code dùng bảng thay vì drop. |
| D | Tạo `affiliate_clicks` với FK `product_id bigint`; bật RLS và policy theo endpoint analytics được chốt. | Hợp đồng analytics tương thích khóa sản phẩm thật; bảng chưa được ghi bởi code hiện tại. | Nếu chưa có event: bỏ policy/index/bảng mới. Sau khi có event: giữ bảng/dữ liệu và rollback endpoint trước, không drop dữ liệu. |
| E | Không đổi cấu trúc `styles`, `tags`, `product_images`, `product_styles`, `product_tags`, `user_roles`; chỉ thay mapper/authorization ở code trong bước sau. | Cấu trúc/FK/RLS hiện có đã phục vụ quan hệ; không cần reset hay thay khóa. | Revert code mapper; không cần rollback schema. |

Migration thực tế nên chạy trong transaction khi Supabase cho phép, kiểm tra tồn tại từng cột/constraint/policy, ghi tên migration và xác minh lại schema, FK, RLS, policy, row counts sau mỗi bước. Không dùng `CREATE TABLE IF NOT EXISTS products` như cách đồng bộ, vì bảng đã tồn tại nhưng cấu trúc của nó sẽ không được cập nhật.

## 4. Rủi ro và cổng trước seed

1. Sửa `requireAdminUser()` để kiểm tra `user_roles.role='admin'` trước khi API dùng service key; hoặc chuyển các thao tác sang client session và policy tương ứng. Không dựa vào RLS cho request service-role.
2. Public read chỉ được trả sản phẩm published. Hiện `getCmsProducts()` dùng service key và trả mọi status; policy SELECT public không lọc được request này.
3. Đồng bộ `ProductWriteInput`/mapper với cột mới, nhất là category theo slug, score JSONB và các relation ảnh/style. Giữ giao diện hiện tại.
4. Tắt/gate auto-seed bài viết trước khi tạo `articles`. Chỉ nhập seed sản phẩm/bài viết/taxonomy sau khi migration, kiểm tra quyền và cơ chế import đã được duyệt riêng.
5. `supabase/schema.sql` không phải migration an toàn cho database hiện tại: `products IF NOT EXISTS` không sửa bảng đã có và định nghĩa `affiliate_clicks.product_id text` không khớp khóa `bigint`. Không chạy file đó nguyên trạng.

## 5. Phạm vi hiện tại

Trong giai đoạn này chỉ sửa export bị thiếu ở `lib/cms/products.ts` và tạo tài liệu này. Không có SQL chạy lên project, không thay RLS, không nhập seed, không thay UI/package và không commit/push.
