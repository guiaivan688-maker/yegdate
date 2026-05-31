import type { Metadata } from "next";
import CarteClient from "./CarteClient";

export const metadata: Metadata = {
  title: "Carte d'Edmonton — Toutes nos activités et parcs sur une carte",
  description:
    "Visualise toutes les activités, parcs et expériences à Edmonton sur une carte interactive. Filtre par contexte : couple, famille, amis, business, pique-nique.",
  alternates: { canonical: "/carte" },
  openGraph: {
    title: "Carte d'Edmonton — Where To Go YEG",
    description:
      "Toutes nos activités et parcs à Edmonton sur une carte interactive. Filtre par couple, famille, amis, business, pique-nique.",
    type: "website",
  },
};

export default function CartePage() {
  return <CarteClient />;
}
