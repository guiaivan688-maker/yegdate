-- 0007 — "Match rate" du Compositeur + codes promo.
-- (a) composer_runs.fits : le Compositeur a-t-il trouvé une soirée concrète ?
--     → taux de succès + recherches sans résultat (quoi créer/négocier en priorité).
alter table public.composer_runs add column if not exists fits boolean not null default true;

-- (b) promo_codes : codes promo gérés depuis l'admin (lecture publique des codes actifs
--     pour validation au checkout plus tard ; création/édition réservée à l'admin).
create table if not exists public.promo_codes (
  id          bigint generated always as identity primary key,
  code        text not null unique,
  description text,
  percent_off integer not null default 10 check (percent_off between 1 and 100),
  active      boolean not null default true,
  uses        integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.promo_codes enable row level security;
grant select on public.promo_codes to anon, authenticated;
drop policy if exists "promo_public_read_active" on public.promo_codes;
create policy "promo_public_read_active" on public.promo_codes for select using (active = true or public.is_admin());
drop policy if exists "promo_admin_write" on public.promo_codes;
create policy "promo_admin_write" on public.promo_codes for all using (public.is_admin()) with check (public.is_admin());
