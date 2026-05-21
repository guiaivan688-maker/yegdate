import { Resend } from "resend";

interface QuoteBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  activity?: string;
  addons?: string[];
  guests?: number;
  total?: number;
  locale?: "fr" | "en";
}

const OWNER_EMAIL = process.env.QUOTE_TO_EMAIL || "guiaivan688@gmail.com";
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "YEG Date <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: QuoteBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, message, activity, addons = [], guests, total, locale = "fr" } = body;

  if (!name || !email) {
    return Response.json({ ok: false, error: "Name and email are required" }, { status: 400 });
  }

  const summary = [
    activity && `Activité / Activity: ${activity}`,
    addons.length > 0 && `Options: ${addons.join(", ")}`,
    guests && `Personnes / Guests: ${guests}`,
    typeof total === "number" && `Total estimé / Estimated total: $${total}`,
    phone && `Téléphone / Phone: ${phone}`,
    message && `Message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  // Graceful fallback: no key configured yet → log and return success so the UX works in dev.
  if (!apiKey) {
    console.log("[quote-request] RESEND_API_KEY not set. Quote received:\n", { name, email, summary });
    return Response.json({ ok: true, simulated: true });
  }

  const resend = new Resend(apiKey);

  try {
    // 1) Notify the business owner
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Nouvelle demande de devis — ${name}`,
      text: `Nouvelle demande de devis depuis YEG Date\n\nDe: ${name} <${email}>\n\n${summary}`,
    });

    // 2) Confirmation to the client
    const clientSubject = locale === "fr" ? "Votre demande de devis — YEG Date" : "Your quote request — YEG Date";
    const clientText =
      locale === "fr"
        ? `Bonjour ${name},\n\nMerci pour votre demande ! Nous avons bien reçu les détails suivants :\n\n${summary}\n\nNotre équipe revient vers vous sous 24h.\n\n— L'équipe YEG Date`
        : `Hello ${name},\n\nThank you for your request! We've received the following details:\n\n${summary}\n\nOur team will get back to you within 24h.\n\n— The YEG Date team`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: clientSubject,
      text: clientText,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[quote-request] Resend error:", err);
    return Response.json({ ok: false, error: "Email send failed" }, { status: 500 });
  }
}
