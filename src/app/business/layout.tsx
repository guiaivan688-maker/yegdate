import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team building & événements corporate Edmonton | Where To Go YEG Business",
  description:
    "Activités team-building, afterworks, fêtes d'entreprise, executive retreats à Edmonton. Packages sur mesure pour 10 à 300 personnes.",
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
