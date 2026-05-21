"use client";
import SegmentPage from "@/components/SegmentPage";

export default function BusinessPage() {
  return (
    <SegmentPage
      segment="business"
      title={{ fr: "Événements d'Affaires", en: "Business Events" }}
      subtitle={{
        fr: "Networking et événements professionnels à Edmonton",
        en: "Networking and professional events in Edmonton",
      }}
      heroImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
    />
  );
}
