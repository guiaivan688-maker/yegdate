-- 0005 — Tableau de bord admin sur mesure.
-- (a) L'admin peut modifier n'importe quel profil → gestion des rôles depuis l'UI (fini le SQL manuel).
-- (b) Table composer_runs : suivi ANONYME des budgets/contextes demandés dans le Compositeur
--     (aucune donnée personnelle) → alimente les analyses budgets clients du dashboard.
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

create table if not exists public.composer_runs (
  id         bigint generated always as identity primary key,
  budget     integer not null,
  context    text not null,
  created_at timestamptz not null default now()
);
alter table public.composer_runs enable row level security;
grant insert on public.composer_runs to anon, authenticated;
drop policy if exists "composer_runs_insert_any" on public.composer_runs;
create policy "composer_runs_insert_any" on public.composer_runs
  for insert with check (true);
drop policy if exists "composer_runs_admin_read" on public.composer_runs;
create policy "composer_runs_admin_read" on public.composer_runs
  for select using (public.is_admin());
