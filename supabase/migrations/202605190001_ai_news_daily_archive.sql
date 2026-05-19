-- Inspect the current public.news structure before applying this migration:
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'news'
-- order by ordinal_position;

alter table public.news
  add column if not exists batch_date date,
  add column if not exists rank integer,
  add column if not exists heat_score numeric,
  add column if not exists summary text,
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz default now(),
  add column if not exists fetched_at timestamptz default now(),
  add column if not exists status text default 'published';

create unique index if not exists news_source_url_unique on public.news (source_url);
create index if not exists news_batch_rank_idx on public.news (batch_date desc, rank asc);
