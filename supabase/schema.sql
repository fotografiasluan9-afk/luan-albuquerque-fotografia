-- Luan Albuquerque Fotografia — schema Supabase
-- Rode no SQL Editor do projeto: https://supabase.com/dashboard

-- 1) Tabela de slots de fotos
create table if not exists public.photo_slots (
  id text primary key,
  label text not null,
  section text not null check (section in ('hero', 'portfolio', 'about')),
  format text not null check (format in ('1:1', '16:9', '9:16')),
  aspect_css text not null,
  sort_order int not null default 0,
  image_path text,
  updated_at timestamptz not null default now()
);

-- 2) Seed dos slots (rótulos claros para o admin)
insert into public.photo_slots (id, label, section, format, aspect_css, sort_order) values
  ('hero_main', 'Hero — imagem de fundo', 'hero', '16:9', '16/9', 1),
  ('about_portrait', 'Sobre — retrato do fotógrafo', 'about', '1:1', '1/1', 1),
  ('portfolio_1', 'Portfólio 1 — Casamento', 'portfolio', '9:16', '9/16', 1),
  ('portfolio_2', 'Portfólio 2 — Gestante', 'portfolio', '1:1', '1/1', 2),
  ('portfolio_3', 'Portfólio 3 — Família', 'portfolio', '16:9', '16/9', 3),
  ('portfolio_4', 'Portfólio 4 — Ensaio externo', 'portfolio', '9:16', '9/16', 4),
  ('portfolio_5', 'Portfólio 5 — Eventos', 'portfolio', '16:9', '16/9', 5),
  ('portfolio_6', 'Portfólio 6 — Pré-wedding', 'portfolio', '1:1', '1/1', 6)
on conflict (id) do update set
  label = excluded.label,
  section = excluded.section,
  format = excluded.format,
  aspect_css = excluded.aspect_css,
  sort_order = excluded.sort_order;

-- 3) RLS
alter table public.photo_slots enable row level security;

drop policy if exists "photo_slots_public_read" on public.photo_slots;
create policy "photo_slots_public_read"
  on public.photo_slots for select
  to anon, authenticated
  using (true);

drop policy if exists "photo_slots_auth_update" on public.photo_slots;
create policy "photo_slots_auth_update"
  on public.photo_slots for update
  to authenticated
  using (true)
  with check (true);

-- 4) Storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 5) Storage policies
drop policy if exists "photos_public_read" on storage.objects;
create policy "photos_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photos');

drop policy if exists "photos_auth_insert" on storage.objects;
create policy "photos_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

drop policy if exists "photos_auth_update" on storage.objects;
create policy "photos_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');

drop policy if exists "photos_auth_delete" on storage.objects;
create policy "photos_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos');

-- 6) Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists photo_slots_set_updated_at on public.photo_slots;
create trigger photo_slots_set_updated_at
  before update on public.photo_slots
  for each row execute function public.set_updated_at();
