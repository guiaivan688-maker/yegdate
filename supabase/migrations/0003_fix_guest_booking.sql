-- 0003 — Réservation invité : permettre à un client anonyme de réserver une offre publiée.
-- Problème : (a) l'ancienne WITH CHECK faisait une sous-requête sur `offers` filtrée par RLS ;
-- (b) l'UI relisait la ligne après insertion, or la policy de lecture interdit à un invité
-- de relire sa propre réservation → pas de ticket.
-- Correctif base : WITH CHECK via une fonction SECURITY DEFINER (contourne la RLS croisée).
-- Correctif app (voir src/app/reserver/page.tsx) : id généré côté client, pas de relecture.
create or replace function public.offer_is_published(oid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.offers where id = oid and status = 'published');
$$;

drop policy if exists "booking_insert_on_published" on public.booking_requests;
create policy "booking_insert_on_published" on public.booking_requests
  for insert with check (public.offer_is_published(offer_id));
