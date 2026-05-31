import type { Metadata } from "next";
import PiqueNiqueClient from "./PiqueNiqueClient";

export const metadata: Metadata = {
  title: "Pique-nique à Edmonton — Compose ta journée parc + déco + panier gourmet",
  description:
    "Compose ton pique-nique à Edmonton : 14 parcs (Walterdale, Hawrelak, Borden, Mill Creek, End of the World…), options décoration, photographe, panier gourmet, demande en mariage. Estimation instantanée.",
  alternates: { canonical: "/pique-nique" },
  openGraph: {
    title: "Pique-nique Edmonton — Where To Go YEG",
    description: "Choisis ton parc, ton occasion, tes options — on s'occupe de tout. 14 parcs vérifiés à Edmonton.",
    type: "website",
  },
};

export default function PiqueNiquePage() {
  return <PiqueNiqueClient />;
}
