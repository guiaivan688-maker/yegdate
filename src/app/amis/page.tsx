"use client";
import SegmentPage from "@/components/SegmentPage";

export default function AmisPage() {
  return (
    <SegmentPage
      segment="amis"
      title={{ fr: "Sorties Entre Amis", en: "Outings with Friends" }}
      subtitle={{
        fr: "Des moments inoubliables entre amis à Edmonton",
        en: "Unforgettable moments with friends in Edmonton",
      }}
      heroImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
    />
  );
}
