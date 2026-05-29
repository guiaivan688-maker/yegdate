-- 0008 — Bannière de site (gérée depuis l'admin) + mix de catégories du Compositeur.
-- (a) site_banners : bannière d'annonce affichée en haut du site (ex: « Spécial fête des Mères »).
--     Lecture publique de la bannière active ; création/activation réservée à l'admin.
create table if not exists public.site_banners (
  id          bigint generated always as identity primary key,
  message_fr  text not null,
  message_en  text,
  href        text,
  active      boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.site_banners enable row level security;
grant select on public.site_banners to anon, authenticated;
grant insert, update, delete on public.site_banners to authenticated;
drop policy if exists "site_banner_public_read_active" on public.site_banners;
create policy "site_banner_public_read_active" on public.site_banners for select using (active = true or public.is_admin());
drop policy if exists "site_banner_admin_write" on public.site_banners;
create policy "site_banner_admin_write" on public.site_banners for all using (public.is_admin()) with check (public.is_admin());

-- (b) composer_runs.categories : catégories de la soirée composée (ex: {Resto,Spectacle})
--     → combinaisons les plus demandées, pour savoir quels forfaits créer/négocier.
alter table public.composer_runs add column if not exists categories text[];
