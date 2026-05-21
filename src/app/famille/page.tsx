"use client";
import SegmentPage from "@/components/SegmentPage";

export default function FamillePage() {
  return (
    <SegmentPage
      segment="famille"
      title={{ fr: "Sorties en Famille", en: "Family Outings" }}
      subtitle={{
        fr: "Des activités pour toute la famille à Edmonton",
        en: "Activities for the whole family in Edmonton",
      }}
      heroImage="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
    />
  );
}
