"use client";
import SegmentPage from "@/components/SegmentPage";

export default function BusinessPage() {
  return (
    <SegmentPage
      segment="business"
      title={{ fr: "Événements d'Affaires", en: "Business Events" }}
      subtitle={{
        fr: "Team-building, afterworks et soirées corporate avec des partenaires réels d'Edmonton",
        en: "Team-building, afterworks and corporate evenings with real Edmonton partners",
      }}
      heroImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
    />
  );
}
