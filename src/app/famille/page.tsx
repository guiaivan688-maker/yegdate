import type { Metadata } from "next";
import SegmentPage from "@/components/SegmentPage";
import FamilleMoreLink from "@/components/FamilleMoreLink";

export const metadata: Metadata = {
  title: "Sorties en Famille à Edmonton — TELUS Science, Parcs, Activités Petits & Grands",
  description:
    "Activités familiales à Edmonton : TELUS World of Science, parcs, musées, sorties hiver et été. Sélection de classiques avec prix par famille, durée et capacité.",
  alternates: { canonical: "/famille" },
  openGraph: {
    title: "Sorties en Famille à Edmonton — Where To Go YEG",
    description: "Les classiques familiaux d'Edmonton — ceux que les enfants adorent et les parents approuvent.",
    type: "website",
  },
};

export default function FamillePage() {
  return (
    <>
      <SegmentPage
        segment="famille"
        title={{ fr: "Sorties en Famille", en: "Family Outings" }}
        subtitle={{
          fr: "Les classiques familiaux d'Edmonton — ceux que les enfants adorent et les parents approuvent.",
          en: "The Edmonton family classics — places kids love and parents trust.",
        }}
        heroImage="/images/edmonton/famille-hawrelak-aerial.jpg"
      />
      <FamilleMoreLink />
    </>
  );
}
