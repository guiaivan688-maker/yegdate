"use client";
import SegmentPage from "@/components/SegmentPage";

export default function AmisPage() {
  return (
    <SegmentPage
      segment="amis"
      title={{ fr: "Sorties Entre Amis", en: "Outings with Friends" }}
      subtitle={{
        fr: "Lancer de hache, escape rooms, EVJF et soirées de groupe à Edmonton",
        en: "Axe throwing, escape rooms, bachelorettes and group nights in Edmonton",
      }}
      heroImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
    />
  );
}
