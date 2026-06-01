import type { Metadata } from "next";
import SegmentPage from "@/components/SegmentPage";
import { buildSegmentItemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Sorties Entre Amis à Edmonton — Escape Rooms, Lancer de Hache, Bar Crawls",
  description:
    "Idées de sorties entre amis à Edmonton : EVJF/EVG, escape rooms, lancer de hache, bar crawls de Whyte Avenue. Activités vérifiées avec prix, capacité de groupe et quartier.",
  alternates: { canonical: "/amis" },
  openGraph: {
    title: "Sorties Entre Amis à Edmonton — Where To Go YEG",
    description: "Lancer de hache, escape rooms, bar crawls — sorties de groupe vérifiées à Edmonton.",
    type: "website",
  },
};

export default function AmisPage() {
  const jsonLd = buildSegmentItemListJsonLd("amis");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SegmentPage
      segment="amis"
      title={{ fr: "Sorties Entre Amis", en: "Outings with Friends" }}
      subtitle={{
        fr: "Lancer de hache, escape rooms, EVJF et soirées de groupe à Edmonton",
        en: "Axe throwing, escape rooms, bachelorettes and group nights in Edmonton",
      }}
      heroImage="/images/edmonton/amis-picnic-walterdale.jpg"
      />
    </>
  );
}
