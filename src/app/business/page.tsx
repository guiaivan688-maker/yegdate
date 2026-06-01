import type { Metadata } from "next";
import SegmentPage from "@/components/SegmentPage";
import { buildSegmentItemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Team-Building & Événements Corporate à Edmonton — Where To Go YEG",
  description:
    "Team-building, 5 à 7 et soirées corporate à Edmonton avec partenaires Edmontoniens vérifiés. Estimation immédiate par taille de groupe et quartier.",
  alternates: { canonical: "/business" },
  openGraph: {
    title: "Team-Building & Corporate Events à Edmonton",
    description: "Partenaires vérifiés à Edmonton pour team-building, 5 à 7 et soirées corporate.",
    type: "website",
  },
};

export default function BusinessPage() {
  const jsonLd = buildSegmentItemListJsonLd("business");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SegmentPage
      segment="business"
      title={{ fr: "Événements d'Affaires", en: "Business Events" }}
      subtitle={{
        fr: "Team-building, 5 à 7 et soirées corporate avec des partenaires Edmontoniens vérifiés.",
        en: "Team-building, after-work mixers and corporate evenings with vetted Edmonton partners.",
      }}
      heroImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
      />
    </>
  );
}
