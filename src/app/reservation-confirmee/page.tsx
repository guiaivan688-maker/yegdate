import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import ConfirmationView from "./ConfirmationView";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://guvyforoptoxcoetqcsh.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_5hlQOfQ5F_NGvukwsO5y7Q_wK9GGq1B";

export default async function ReservationConfirmeePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) {
    return <ConfirmationView state="error" message="Session manquante / Missing session." />;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return <ConfirmationView state="error" message="Paiement non configuré / Payment not configured." />;
  }

  const stripe = new Stripe(secretKey);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return <ConfirmationView state="error" message="Session introuvable / Session not found." />;
  }

  if (session.payment_status !== "paid") {
    return <ConfirmationView state="error" message="Paiement non confirmé / Payment not confirmed." />;
  }

  const meta = session.metadata ?? {};
  const bookingId = (meta.booking_id as string | undefined) || "";
  const confirmToken = (meta.confirm_token as string | undefined) || "";
  const amount = session.amount_total ?? 0;
  const guestName = (meta.guest_name as string | undefined) || "";
  const offerName = (meta.offer_title as string | undefined) || "";

  // Idempotent server-side update : only writes the row if session_id + confirm_token match.
  // Safe to call on every page render (e.g. user reloads the confirmation page).
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  await supabase.rpc("mark_booking_paid", {
    p_session_id: session.id,
    p_amount_paid: amount,
    p_token: confirmToken,
  });

  return (
    <ConfirmationView
      state="ok"
      bookingId={bookingId}
      guestName={guestName}
      offerName={offerName}
      amount={amount}
    />
  );
}
