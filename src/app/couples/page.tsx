"use client";
import SegmentPage from "@/components/SegmentPage";
import LoveRooms from "@/components/LoveRooms";

export default function CouplesPage() {
  return (
    <>
      <SegmentPage
        segment="couples"
        title={{ fr: "Sorties en Couple", en: "Couple Outings" }}
        subtitle={{
          fr: "Des expériences romantiques exclusives, conçues pour deux à Edmonton",
          en: "Exclusive romantic experiences, designed for two in Edmonton",
        }}
        heroImage="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1920&q=80"
      />
      <LoveRooms />
    </>
  );
}
