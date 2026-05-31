import type { Metadata } from "next";
import BuffetsClient from "./BuffetsClient";

export const metadata: Metadata = {
  title: "Les Meilleurs Buffets à Volonté d'Edmonton — Sushi, BBQ Coréen, Hot Pot",
  description:
    "Notre sélection des meilleurs buffets à volonté à Edmonton : sushi AYCE, korean BBQ, hot pot, brunch. Curée par quartier (Downtown, Whyte Ave, West Edmonton) et budget.",
  alternates: { canonical: "/buffets" },
  openGraph: {
    title: "Les Meilleurs Buffets d'Edmonton — Where To Go YEG",
    description: "Sushi, Korean BBQ, Hot Pot — buffets à volonté curés à Edmonton.",
    type: "website",
  },
};

export default function BuffetsPage() {
  return <BuffetsClient />;
}
