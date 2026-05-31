import type { Metadata } from "next";
import NightOutClient from "./NightOutClient";

export const metadata: Metadata = {
  title: "Night Out Edmonton — Soirées Clé en Main par Vibe (Afro, Latino, Hip-Hop)",
  description:
    "Choisis ta vibe (Afro, Latino, Hip-Hop, EDM, Lounge…), on compose ta soirée à Edmonton. Coupe-file, table réservée, du club au food de nuit. Aucune queue.",
  alternates: { canonical: "/night-out" },
  openGraph: {
    title: "Night Out Edmonton — Choisis ta vibe, on compose ta soirée",
    description: "Soirées clé en main à Edmonton — Afro, Latino, Hip-Hop, EDM, Lounge.",
    type: "website",
  },
};

export default function NightOutPage() {
  return <NightOutClient />;
}
