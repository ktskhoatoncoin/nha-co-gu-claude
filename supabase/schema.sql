create extension if not exists pgcrypto;

create table if not exists products (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text not null default '',
  short_description text not null default '',
  category_id text not null,
  subcategory text not null default '',
  room_ids text[] not null default '{}',
  style_ids text[] not null default '{}',
  price numeric not null default 0,
  original_price numeric,
  currency text not null default 'VND',
  image_url text not null default '',
  gallery text[] not null default '{}',
  rating numeric not null default 0,
  review_count integer not null default 0,
  sold_count integer not null default 0,
  merchant_name text not null default '',
  platform text not null default 'other',
  affiliate_url text not null default '',
  commission_rate numeric not null default 0,
  commission_type text not null default 'percentage',
  commission_updated_at timestamptz,
  our_score numeric not null default 0,
  scores jsonb not null default '{}'::jsonb,
  badges text[] not null default '{}',
  suited_for jsonb not null default '{}'::jsonb,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  is_featured boolean not null default false,
  is_hero boolean not null default false,
  is_active boolean not null default true,
  is_demo_data boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  cover_image text not null default '',
  author text not null default 'Nhà Có Gu',
  published_at timestamptz,
  reading_time_minutes integer not null default 1,
  category text not null default 'Góc kiến trúc sư',
  content jsonb not null default '[]'::jsonb,
  related_product_slugs text[] not null default '{}',
  has_affiliate_links boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(id) on delete set null,
  platform text,
  timestamp timestamptz not null default now(),
  referrer text,
  page text,
  device_type text,
  session_id text,
  campaign text,
  source text,
  medium text,
  content text
);

alter table products enable row level security;
alter table articles enable row level security;
alter table affiliate_clicks enable row level security;

create policy "Public can read active products" on products for select using (is_active = true);
create policy "Public can read published articles" on articles for select using (status = 'published');
create policy "Public can insert analytics" on affiliate_clicks for insert with check (true);
