-- 0006 — Marketing : mise en avant (sponsorisé) des offres.
-- Permet à l'admin de "propulser" une offre : elle remonte en tête de /reserver
-- avec un badge "En vedette". Levier publicitaire (placement sponsorisé).
alter table public.offers add column if not exists featured boolean not null default false;
