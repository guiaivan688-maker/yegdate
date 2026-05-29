"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Ticket, XCircle } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

interface Props {
  state: "ok" | "error";
  message?: string;
  bookingId?: string;
  guestName?: string;
  offerName?: string;
  amount?: number;
}

export default function ConfirmationView(props: Props) {
  const { locale } = useLocale();
  const fr = locale === "fr";

  if (props.state === "error") {
    return (
      <div className="min-h-screen py-16 sm:py-20 px-4">
        <div className="max-w-md mx-auto bg-surface border border-black/5 rounded-3xl p-8 text-center">
          <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl font-bold text-navy mb-1">
            {fr ? "Paiement non confirmé" : "Payment not confirmed"}
          </h1>
          <p className="text-navy/55 text-sm mb-6">{props.message || ""}</p>
          <Link href="/reserver" className="text-gold text-sm font-semibold hover:underline">
            {fr ? "Retour aux offres" : "Back to offers"}
          </Link>
        </div>
      </div>
    );
  }

  const dollars = ((props.amount ?? 0) / 100).toFixed(2);
  const shortId = (props.bookingId || "").slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-md mx-auto bg-surface border border-black/5 rounded-3xl p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" strokeWidth={1.5} />
        <h1 className="font-serif text-2xl font-bold text-navy mb-1">
          {fr ? "Paiement confirmé !" : "Payment confirmed!"}
        </h1>
        {props.offerName && <p className="text-navy/65 text-sm">{props.offerName}</p>}
        <p className="text-navy/45 text-xs mb-5">
          {props.guestName ? `${props.guestName} · ` : ""}${dollars} CAD
        </p>
        <div className="inline-block bg-white border border-black/10 rounded-2xl p-5">
          <QRCodeSVG value={`YEGDATE-TICKET:${props.bookingId}`} size={168} />
        </div>
        <p className="text-navy/45 text-xs mt-4 flex items-center justify-center gap-1">
          <Ticket className="w-3.5 h-3.5" strokeWidth={1.5} /> {fr ? "Ton ticket" : "Your ticket"} · {shortId}
        </p>
        <p className="text-navy/45 text-xs mt-1">
          {fr ? "Le partenaire confirmera ta réservation." : "The partner will confirm your booking."}
        </p>
        <Link href="/reserver" className="block mt-6 text-gold text-sm font-semibold hover:underline">
          {fr ? "Réserver autre chose" : "Book something else"}
        </Link>
      </div>
    </div>
  );
}
