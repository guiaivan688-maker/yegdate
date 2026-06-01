import type { Metadata } from "next";
import PiqueNiqueClient from "./PiqueNiqueClient";
import { buildPicnicServiceJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Pique-nique à Edmonton — Compose ta journée parc + déco + panier gourmet",
  description:
    "Compose ton pique-nique à Edmonton : 23 lieux (Walterdale, Hawrelak, Borden, Muttart Conservatory, Mill Creek, End of the World…), options décoration, photographe, panier gourmet, demande en mariage. Indoor + outdoor. Estimation instantanée.",
  alternates: { canonical: "/pique-nique" },
  openGraph: {
    title: "Pique-nique Edmonton — Where To Go YEG",
    description: "Choisis ton parc, ton occasion, tes options — on s'occupe de tout. 23 lieux vérifiés à Edmonton (indoor + outdoor).",
    type: "website",
  },
};

export default function PiqueNiquePage() {
  const jsonLd = buildPicnicServiceJsonLd();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PiqueNiqueClient />
    </>
  );
}
