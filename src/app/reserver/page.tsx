"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Loader2, CheckCircle2, Ticket, ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import ReportButton from "@/components/ReportButton";

interface Offer {
  id: string;
  title_fr: string;
  title_en: string | null;
  location: string | null;
  price_from: number;
  image: string | null;
  featured?: boolean;
}

export default function ReserverPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [ticket, setTicket] = useState<{ id: string; offer: Offer } | null>(null);

  useEffect(() => {
    supabase
      .from("offers")
      .select("id,title_fr,title_en,location,price_from,image,featured")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOffers((data as Offer[]) ?? []);
        setLoading(false);
      });
  }, []);

  const offerTitle = (o: Offer) => (locale === "en" && o.title_en ? o.title_en : o.title_fr);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || busy) return;
    setBusy(true);
    try {
      // Crée la session Stripe côté serveur (la clé secrète n'est jamais exposée au client)
      // et redirige vers la page de paiement. Le ticket QR s'affiche sur /reservation-confirmee
      // après vérification serveur du paiement.
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer_id: selected.id,
          guest_name: name,
          party_size: partySize,
          requested_for: date || undefined,
          locale,
        }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setBusy(false);
      console.error("[reserver] checkout failed:", data.error);
      alert(fr ? "Réservation temporairement indisponible. Réessaie dans un instant." : "Booking is temporarily unavailable. Please retry shortly.");
    } catch (err) {
      setBusy(false);
      console.error(err);
      alert(fr ? "Une erreur est survenue." : "Something went wrong.");
    }
  }

  function reset() {
    setTicket(null);
    setSelected(null);
    setName("");
    setPartySize(2);
    setDate("");
  }

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{fr ? "Réserver une expérience" : "Book an experience"}</h1>
        <p className="text-navy/60 text-lg mb-10 max-w-2xl">{fr ? "Réserve directement auprès de nos partenaires d'Edmonton — confirmation et ticket QR instantanés." : "Book directly with our Edmonton partners — instant confirmation and QR ticket."}</p>

        {ticket ? (
          <div className="bg-surface border border-black/5 rounded-3xl p-8 text-center max-w-md mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-bold text-navy mb-1">{fr ? "Demande envoyée !" : "Request sent!"}</h2>
            <p className="text-navy/60 text-sm mb-6">{offerTitle(ticket.offer)}</p>
            <div className="inline-block bg-white border border-black/10 rounded-2xl p-5">
              <QRCodeSVG value={`YEGDATE-TICKET:${ticket.id}`} size={168} />
            </div>
            <p className="text-navy/45 text-xs mt-4 flex items-center justify-center gap-1"><Ticket className="w-3.5 h-3.5" strokeWidth={1.5} /> {fr ? "Ton ticket" : "Your ticket"} · {ticket.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-navy/45 text-xs mt-1">{fr ? "Le partenaire confirmera ta réservation." : "The partner will confirm your booking."}</p>
            <button onClick={reset} className="mt-6 text-gold text-sm font-semibold hover:underline">{fr ? "Réserver autre chose" : "Book something else"}</button>
          </div>
        ) : selected ? (
          <div className="bg-surface border border-black/5 rounded-3xl p-6 max-w-md">
            <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1 text-navy/50 hover:text-navy text-sm mb-4"><ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> {fr ? "Retour" : "Back"}</button>
            <h2 className="font-serif text-xl font-bold text-navy mb-1">{offerTitle(selected)}</h2>
            <p className="text-navy/45 text-xs flex items-center gap-1 mb-5"><MapPin className="w-3 h-3" strokeWidth={1.5} /> {selected.location} · {fr ? "dès" : "from"} ${selected.price_from}</p>
            <form onSubmit={book} className="flex flex-col gap-4">
              <label className="text-sm text-navy/70">
                {fr ? "Ton nom" : "Your name"}
                <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full border border-black/10 rounded-xl px-4 py-2.5 text-navy" />
              </label>
              <div className="flex gap-4">
                <label className="text-sm text-navy/70 flex-1">
                  {fr ? "Personnes" : "Guests"}
                  <input type="number" min={1} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="mt-1 w-full border border-black/10 rounded-xl px-4 py-2.5 text-navy" />
                </label>
                <label className="text-sm text-navy/70 flex-1">
                  {fr ? "Quand" : "When"}
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full border border-black/10 rounded-xl px-4 py-2.5 text-navy" />
                </label>
              </div>
              <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <Ticket className="w-4 h-4" strokeWidth={2} />}
                {fr ? "Confirmer ma réservation" : "Confirm my booking"}
              </button>
            </form>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 text-navy/50"><Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} /> {fr ? "Chargement…" : "Loading…"}</div>
        ) : offers.length === 0 ? (
          <div className="bg-surface border border-black/5 rounded-2xl px-5 py-8 text-center text-navy/55">
            {fr ? "Aucune offre publiée pour l'instant. Les offres validées par l'admin apparaîtront ici." : "No published offers yet. Offers approved by the admin will appear here."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {offers.map((o) => (
              <div key={o.id} className={`bg-surface border rounded-2xl p-5 flex flex-col ${o.featured ? "border-gold/40 ring-1 ring-gold/20" : "border-black/5"}`}>
                {o.featured && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9a7e34] bg-gold/15 border border-gold/30 rounded-full px-2 py-0.5 mb-2 w-fit">★ {fr ? "En vedette" : "Featured"}</span>}
                <h3 className="font-serif text-lg font-bold text-navy mb-1">{offerTitle(o)}</h3>
                <p className="text-navy/45 text-xs flex items-center gap-1 mb-4"><MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {o.location} · {fr ? "dès" : "from"} ${o.price_from}</p>
                <button onClick={() => setSelected(o)} className="mt-auto inline-flex items-center justify-center gap-1.5 gradient-gold text-navy font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                  <Ticket className="w-4 h-4" strokeWidth={2} /> {fr ? "Réserver" : "Book"}
                </button>
                <ReportButton target_type="offer" target_id={o.id} target_label={offerTitle(o)} className="inline-flex items-center gap-1 mt-2 mx-auto text-[11px] text-navy/40 hover:text-navy/60 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
