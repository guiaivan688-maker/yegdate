"use client";
import SegmentPage from "@/components/SegmentPage";

export default function CouplesPage() {
  return (
    <SegmentPage
      segment="couple"
      title={{ fr: "Sorties en Couple", en: "Couple Outings" }}
      subtitle={{
        fr: "Des expériences romantiques inoubliables à Edmonton",
        en: "Unforgettable romantic experiences in Edmonton",
      }}
      heroImage="https://images.unsplash.com/photo-1522264373430-3c41337d38d0?w=1920&q=80"
    />
  );
}
