import type { Metadata } from "next";
import SegmentPage from "@/components/SegmentPage";
import LoveRooms from "@/components/LoveRooms";
import { buildSegmentItemListJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Date Night & Sorties en Couple à Edmonton — Streetcar, Spa, Chefs-Table",
  description:
    "Idées de date night à Edmonton : streetcar privatisé du High Level Bridge, dîners chefs-table, spas, Love Rooms. Expériences romantiques vérifiées avec prix par couple.",
  alternates: { canonical: "/couples" },
  openGraph: {
    title: "Sorties Romantiques en Couple à Edmonton — Where To Go YEG",
    description: "Du Streetcar du High Level aux dîners chefs-table — date night vérifiés à Edmonton.",
    type: "website",
  },
};

export default function CouplesPage() {
  const jsonLd = buildSegmentItemListJsonLd("couples");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SegmentPage
        segment="couples"
        title={{ fr: "Sorties en Couple", en: "Couple Outings" }}
        subtitle={{
          fr: "Soirées romantiques à Edmonton — du Streetcar du High Level aux dîners chefs-table.",
          en: "Romantic Edmonton dates — from the High Level Streetcar to chef's-table dinners.",
        }}
        heroImage="/images/edmonton/couples-walterdale-sunset.jpg"
        featuredSection={<LoveRooms />}
      />
    </>
  );
}
