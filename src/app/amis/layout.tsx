import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorties entre amis Edmonton — EVJF, anniversaires, groupes | YEG Date",
  description:
    "Escape rooms, axe throwing, soirées thématiques, EVJF Premium. Organisez votre sortie entre amis à Edmonton en quelques clics.",
};

export default function AmisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
