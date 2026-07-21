-- Avaliações públicas — Luan Albuquerque Fotografia
-- Rode no SQL Editor ou via: supabase db query --linked -f supabase/schema-reviews.sql

create extension if not exists "pgcrypto";

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(trim(author_name)) between 2 and 80),
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null check (char_length(trim(comment)) between 3 and 500),
  created_at timestamptz not null default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read"
  on public.reviews for select
  to anon, authenticated
  using (true);

drop policy if exists "reviews_anon_insert" on public.reviews;
create policy "reviews_anon_insert"
  on public.reviews for insert
  to anon, authenticated
  with check (true);

drop policy if exists "reviews_auth_delete" on public.reviews;
create policy "reviews_auth_delete"
  on public.reviews for delete
  to authenticated
  using (true);
