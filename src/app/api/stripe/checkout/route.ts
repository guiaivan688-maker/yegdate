import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

interface CheckoutBody {
  offer_id?: string;
  guest_name?: string;
  party_size?: number;
  requested_for?: string;
  promo_code?: string;
  locale?: "fr" | "en";
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://guvyforoptoxcoetqcsh.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_5hlQOfQ5F_NGvukwsO5y7Q_wK9GGq1B";

function siteOrigin(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env;
  try { return new URL(req.url).origin; } catch { return "https://wheretogoyeg.ca"; }
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Graceful fallback before the env var is configured on Vercel.
    return Response.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  let body: CheckoutBody;
  try { body = await request.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { offer_id, guest_name, party_size = 1, requested_for, promo_code, locale = "fr" } = body;
  if (!offer_id || !guest_name) {
    return Response.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
  const partyQty = Math.max(1, Math.min(50, Math.round(Number(party_size) || 1)));

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

  // Look up the offer (must be published — RLS already enforces this for anon).
  const { data: offer, error: offerErr } = await supabase
    .from("offers")
    .select("id,title_fr,title_en,price_from,status")
    .eq("id", offer_id)
    .eq("status", "published")
    .single();
  if (offerErr || !offer) {
    return Response.json({ ok: false, error: "Offer not found" }, { status: 404 });
  }

  // Optional promo code (validated server-side; client cannot fake the discount).
  let percentOff = 0;
  let promoCodeUsed: string | null = null;
  if (promo_code && promo_code.trim()) {
    const code = promo_code.trim().toUpperCase();
    const { data: promo } = await supabase
      .from("promo_codes")
      .select("code,percent_off,active")
      .eq("code", code)
      .single();
    if (promo && promo.active) {
      percentOff = Math.max(0, Math.min(100, promo.percent_off));
      promoCodeUsed = code;
    }
  }

  const unitAmountCents = Math.round((offer.price_from as number) * 100);
  const discountedUnit = Math.max(50, Math.round(unitAmountCents * (1 - percentOff / 100))); // Stripe min ≈ $0.50.
  const offerTitle = locale === "en" && offer.title_en ? (offer.title_en as string) : (offer.title_fr as string);

  const bookingId = crypto.randomUUID();
  const confirmToken = crypto.randomUUID();
  const origin = siteOrigin(request);

  const stripe = new Stripe(secretKey);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: partyQty,
          price_data: {
            currency: "cad",
            unit_amount: discountedUnit,
            product_data: {
              name: offerTitle + (percentOff > 0 ? ` (-${percentOff}%)` : ""),
              description: offerTitle,
            },
          },
        },
      ],
      success_url: `${origin}/reservation-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reserver`,
      locale: locale === "fr" ? "fr-CA" : "en",
      metadata: {
        booking_id: bookingId,
        confirm_token: confirmToken,
        offer_id: offer.id as string,
        offer_title: offerTitle.slice(0, 200),
        party_size: String(partyQty),
        guest_name: guest_name.slice(0, 200),
        requested_for: requested_for || "",
        promo_code: promoCodeUsed || "",
      },
    });
  } catch (err) {
    console.error("[stripe/checkout] session create failed:", err);
    return Response.json({ ok: false, error: "Payment provider error" }, { status: 502 });
  }

  if (!session.url) {
    return Response.json({ ok: false, error: "No checkout URL" }, { status: 502 });
  }

  // Anchor the pending booking to the Stripe session. Anon insert is permitted by the
  // existing RLS policy (offer_is_published check).
  const { error: insErr } = await supabase.from("booking_requests").insert({
    id: bookingId,
    offer_id: offer.id,
    guest_name: guest_name.slice(0, 200),
    party_size: partyQty,
    requested_for: requested_for ? new Date(requested_for).toISOString() : null,
    status: "pending",
    stripe_session_id: session.id,
    confirm_token: confirmToken,
    promo_code: promoCodeUsed,
  });
  if (insErr) {
    console.error("[stripe/checkout] booking insert failed:", insErr);
    // Stripe session is orphaned (will simply expire unpaid) — acceptable.
    return Response.json({ ok: false, error: "Booking save failed" }, { status: 500 });
  }

  return Response.json({ ok: true, url: session.url });
}
