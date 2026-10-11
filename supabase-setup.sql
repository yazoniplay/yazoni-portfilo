-- Yazoni Labs app catalogue setup
-- Run this in the Supabase SQL Editor on a dedicated project.
-- This creates only app-store tables/buckets and does not alter existing app data.

create extension if not exists pgcrypto;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  description text not null check (char_length(description) between 1 and 400),
  version text,
  platform text not null default 'Android',
  price numeric(10,2) not null default 0 check (price >= 0),
  published boolean not null default false,
  checkout_url text,
  release_notes text,
  color text not null default '#d7f36a',
  icon_path text,
  icon_url text,
  file_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
alter table public.apps enable row level security;

drop policy if exists "Admins can read their own allowlist row" on public.app_admins;
create policy "Admins can read their own allowlist row"
on public.app_admins for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Anyone can read published free apps" on public.apps;
create policy "Anyone can read published free apps"
on public.apps for select to anon, authenticated
using (published = true and price = 0);

drop policy if exists "Admins can read all app listings" on public.apps;
create policy "Admins can read all app listings"
on public.apps for select to authenticated
using (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can insert app listings" on public.apps;
create policy "Admins can insert app listings"
on public.apps for insert to authenticated
with check (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can update app listings" on public.apps;
create policy "Admins can update app listings"
on public.apps for update to authenticated
using (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can delete app listings" on public.apps;
create policy "Admins can delete app listings"
on public.apps for delete to authenticated
using (exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

grant select on public.apps to anon, authenticated;
grant insert, update, delete on public.apps to authenticated;
grant select on public.app_admins to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('app-icons','app-icons',true,10485760,array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('app-files','app-files',false,524288000,array['application/vnd.android.package-archive','application/octet-stream','application/zip','application/x-msdownload','application/x-apple-diskimage','application/pdf'])
on conflict (id) do nothing;

drop policy if exists "Admins can upload app icons" on storage.objects;
create policy "Admins can upload app icons"
on storage.objects for insert to authenticated
with check (bucket_id = 'app-icons' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can update app icons" on storage.objects;
create policy "Admins can update app icons"
on storage.objects for update to authenticated
using (bucket_id = 'app-icons' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())))
with check (bucket_id = 'app-icons' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can delete app icons" on storage.objects;
create policy "Admins can delete app icons"
on storage.objects for delete to authenticated
using (bucket_id = 'app-icons' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can upload app files" on storage.objects;
create policy "Admins can upload app files"
on storage.objects for insert to authenticated
with check (bucket_id = 'app-files' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can update app files" on storage.objects;
create policy "Admins can update app files"
on storage.objects for update to authenticated
using (bucket_id = 'app-files' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())))
with check (bucket_id = 'app-files' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

drop policy if exists "Admins can delete app files" on storage.objects;
create policy "Admins can delete app files"
on storage.objects for delete to authenticated
using (bucket_id = 'app-files' and exists (select 1 from public.app_admins a where a.user_id = (select auth.uid())));

-- Public visitors may download ONLY builds attached to published FREE apps.
drop policy if exists "Public can download published free builds" on storage.objects;
create policy "Public can download published free builds"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'app-files'
  and exists (
    select 1 from public.apps a
    where a.file_path = storage.objects.name
      and a.published = true
      and a.price = 0
  )
);

-- After creating your account in Authentication > Users, copy its UUID and run:
-- insert into public.app_admins (user_id) values ('YOUR-AUTH-USER-UUID');
-- Never add public admin signup, and never expose service_role keys in browser code.
