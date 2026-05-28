import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meilleurs buffets Edmonton — AYCE, Korean BBQ, Sushi, Hot Pot | Where To Go YEG",
  description:
    "Guide complet des buffets all-you-can-eat à Edmonton : Yang Ming, BB2 Korean BBQ, Tatsu Sushi, Pampa Brazilian. Prix, adresses, spécialités.",
};

export default function BuffetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
