-- YEG Date — v3.0 backend multi-rôles (Supabase / Postgres)
-- Implémente la matrice de permissions : admin ⊃ prestataire (ses lignes) ⊃ client (demande).
-- Comment l'activer :
--   1. Crée un projet Supabase (gratuit) → https://supabase.com
--   2. SQL Editor → colle ce fichier → Run
--   3. Donne-moi le Project URL + la clé "anon public" pour câbler l'app
--   4. Pour te donner les droits admin : update public.profiles set role='admin' where id='<ton-user-id>';

-- ---------- Rôles ----------
create type user_role as enum ('client', 'prestataire', 'admin');

-- ---------- Profils (au-dessus de auth.users) ----------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         user_role not null default 'client',
  display_name text,
  created_at   timestamptz not null default now()
);

-- ---------- Offres (la fiche d'un prestataire ; peut "réclamer" une fiche curée) ----------
create table public.offers (
  id                 uuid primary key default gen_random_uuid(),
  owner              uuid not null references public.profiles(id) on delete cascade,
  source_activity_id text,            -- id de la fiche curée réclamée (P7), nullable
  title_fr           text not null,
  title_en           text,
  location           text,
  price_from         integer not null default 0,
  image              text,
  status             text not null default 'draft' check (status in ('draft','published','suspended')),
  created_at         timestamptz not null default now()
);
create index offers_owner_idx  on public.offers(owner);
create index offers_status_idx on public.offers(status);

-- ---------- Demandes de réservation ----------
create table public.booking_requests (
  id            uuid primary key default gen_random_uuid(),
  offer_id      uuid not null references public.offers(id) on delete cascade,
  client        uuid references public.profiles(id) on delete set null,
  guest_name    text,
  requested_for timestamptz,
  party_size    integer default 1,
  status        text not null default 'pending' check (status in ('pending','confirmed','declined')),
  created_at    timestamptz not null default now()
);
create index booking_offer_idx on public.booking_requests(offer_id);

-- ---------- Helpers ----------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- Crée automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Row-Level Security ----------
alter table public.profiles         enable row level security;
alter table public.offers           enable row level security;
alter table public.booking_requests enable row level security;

-- profiles : chacun lit/édite le sien ; l'admin voit tout
create policy "profiles_read_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- offers : les offres publiées sont publiques (découverte client) ; propriétaire & admin voient tout
create policy "offers_read_published_or_owner_or_admin" on public.offers
  for select using (status = 'published' or owner = auth.uid() or public.is_admin());
create policy "offers_insert_owner" on public.offers
  for insert with check (owner = auth.uid());
create policy "offers_update_owner_or_admin" on public.offers
  for update using (owner = auth.uid() or public.is_admin());
create policy "offers_delete_owner_or_admin" on public.offers
  for delete using (owner = auth.uid() or public.is_admin());

-- booking_requests : tout le monde peut demander une offre publiée ;
-- lecture par le client demandeur + le propriétaire de l'offre + l'admin ;
-- confirmation/refus par le propriétaire ou l'admin
create policy "booking_insert_on_published" on public.booking_requests
  for insert with check (
    exists (select 1 from public.offers o where o.id = offer_id and o.status = 'published')
  );
create policy "booking_read_involved" on public.booking_requests
  for select using (
    client = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.offers o where o.id = offer_id and o.owner = auth.uid())
  );
create policy "booking_update_owner_or_admin" on public.booking_requests
  for update using (
    public.is_admin()
    or exists (select 1 from public.offers o where o.id = offer_id and o.owner = auth.uid())
  );
