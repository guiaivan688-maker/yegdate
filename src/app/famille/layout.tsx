import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activités famille Edmonton — Quoi faire avec les enfants | Where To Go YEG",
  description:
    "TELUS World of Science, Fort Edmonton Park, Galaxyland, Elk Island. Activités famille à Edmonton par âge et par budget.",
};

export default function FamilleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
