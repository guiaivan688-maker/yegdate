"use client";
import SegmentPage from "@/components/SegmentPage";

export default function FamillePage() {
  return (
    <SegmentPage
      segment="famille"
      title={{ fr: "Sorties en Famille", en: "Family Outings" }}
      subtitle={{
        fr: "Les vraies institutions familiales d'Edmonton, pour petits et grands",
        en: "Edmonton's real family institutions, for kids and grown-ups",
      }}
      heroImage="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
    />
  );
}
