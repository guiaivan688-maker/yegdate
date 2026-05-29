-- 0009 — Paiements Stripe : champs sur booking_requests + fonction pour marquer payé.
alter table public.booking_requests add column if not exists paid_at         timestamptz;
alter table public.booking_requests add column if not exists stripe_session_id text;
alter table public.booking_requests add column if not exists amount_paid     integer;  -- en cents
alter table public.booking_requests add column if not exists promo_code      text;
alter table public.booking_requests add column if not exists confirm_token   text;

create index if not exists booking_requests_stripe_session_idx
  on public.booking_requests (stripe_session_id);

-- mark_booking_paid : marque la réservation payée APRÈS vérification serveur du paiement Stripe.
-- Sécurité : on n'écrit que si stripe_session_id ET confirm_token correspondent à ceux stockés
-- à la création de la session. Le confirm_token n'existe que dans la metadata Stripe — seul
-- le serveur (avec sa clé secrète) peut la lire. Un attaquant ne peut donc pas marquer comme
-- payée une réservation qu'il n'a pas créée. Idempotent : ne ré-écrit pas si déjà payé.
create or replace function public.mark_booking_paid(
  p_session_id  text,
  p_amount_paid integer,
  p_token       text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_promo   text;
  v_updated integer;
begin
  update public.booking_requests
     set paid_at     = now(),
         amount_paid = p_amount_paid,
         status      = 'confirmed'
   where stripe_session_id = p_session_id
     and confirm_token     = p_token
     and paid_at is null
  returning promo_code into v_promo;

  get diagnostics v_updated = row_count;

  if v_updated > 0 and v_promo is not null and v_promo <> '' then
    update public.promo_codes set uses = uses + 1 where code = upper(v_promo);
  end if;

  return v_updated > 0;
end;
$$;

revoke all   on function public.mark_booking_paid(text, integer, text) from public;
grant execute on function public.mark_booking_paid(text, integer, text) to anon, authenticated;
