-- 0010 — Signalements utilisateurs : un visiteur (même anonyme) peut signaler une offre,
-- un événement, ou un problème général ; les signalements n'apparaissent que dans l'admin.
create table if not exists public.reports (
  id             bigint generated always as identity primary key,
  target_type    text not null,           -- 'offer' | 'event' | 'general'
  target_id      text,                    -- id de l'offre/événement signalé (texte pour rester souple)
  target_label   text,                    -- snapshot du titre au moment du signalement (le contenu peut changer/disparaître)
  category       text,                    -- 'content' | 'price' | 'image' | 'spam' | 'other'
  message        text not null,
  reporter_email text,                    -- optionnel
  status         text not null default 'open',  -- 'open' | 'resolved' | 'dismissed'
  resolved_at    timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists reports_status_idx     on public.reports (status, created_at desc);
create index if not exists reports_target_idx     on public.reports (target_type, target_id);

alter table public.reports enable row level security;

grant select on public.reports to anon, authenticated;
grant insert on public.reports to anon, authenticated;
grant update, delete on public.reports to authenticated;

-- Insertion publique avec validation basique (type valide + longueur message raisonnable).
drop policy if exists "report_public_insert" on public.reports;
create policy "report_public_insert" on public.reports
  for insert with check (
    target_type in ('offer','event','general')
    and char_length(message) between 5 and 2000
  );

-- Lecture : admin uniquement.
drop policy if exists "report_admin_read" on public.reports;
create policy "report_admin_read" on public.reports
  for select using (public.is_admin());

-- Modification / suppression : admin uniquement.
drop policy if exists "report_admin_write" on public.reports;
create policy "report_admin_write" on public.reports
  for all using (public.is_admin()) with check (public.is_admin());
