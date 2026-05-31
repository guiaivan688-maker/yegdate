"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Heart, Users, PartyPopper, Briefcase, Sparkles, Trees } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-warm-grey">
      <span className="text-navy/40 text-sm">…</span>
    </div>
  ),
});

export type CarteFilter = "all" | "couples" | "famille" | "amis" | "business" | "picnic";

const FILTERS: { key: CarteFilter; Icon: typeof Heart; color: string; labelFr: string; labelEn: string }[] = [
  { key: "all",      Icon: Sparkles,    color: "#1a365d", labelFr: "Tout",       labelEn: "All" },
  { key: "couples",  Icon: Heart,       color: "#c4a456", labelFr: "Couples",    labelEn: "Couples" },
  { key: "famille",  Icon: Users,       color: "#2a4a7f", labelFr: "Famille",    labelEn: "Family" },
  { key: "amis",     Icon: PartyPopper, color: "#16a34a", labelFr: "Amis",       labelEn: "Friends" },
  { key: "business", Icon: Briefcase,   color: "#9333ea", labelFr: "Affaires",   labelEn: "Business" },
  { key: "picnic",   Icon: Trees,       color: "#d4b976", labelFr: "Pique-nique", labelEn: "Picnic" },
];

export default function CarteClient() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [filter, setFilter] = useState<CarteFilter>("all");

  const visibleSegments = useMemo<Set<"couples" | "famille" | "amis" | "business">>(() => {
    if (filter === "all") return new Set(["couples", "famille", "amis", "business"]);
    if (filter === "picnic") return new Set();
    return new Set([filter]);
  }, [filter]);

  const showPicnicParks = filter === "all" || filter === "picnic";

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-3">
            {fr ? "La carte d'Edmonton" : "The Edmonton map"}
          </h1>
          <p className="text-navy/60 text-lg max-w-2xl mx-auto">
            {fr
              ? "Toutes nos activités et parcs sur une carte interactive. Filtre par contexte."
              : "All our activities and parks on a single interactive map. Filter by context."}
          </p>
        </motion.div>

        {/* Filter chips — horizontal scroll on mobile */}
        <div className="mb-5 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 min-w-min justify-center sm:flex-wrap">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    active
                      ? "bg-navy text-cream border-navy shadow-md scale-[1.02]"
                      : "bg-white text-navy/75 border-black/10 hover:border-gold/50 hover:text-navy"
                  }`}
                >
                  <span
                    aria-hidden
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ background: f.color }}
                  />
                  <f.Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {fr ? f.labelFr : f.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="h-[70vh] min-h-[420px] rounded-3xl overflow-hidden border border-black/5 shadow-sm">
          <MapView visibleSegments={Array.from(visibleSegments)} showPicnicParks={showPicnicParks} />
        </div>

        {/* Legend hint */}
        <p className="mt-4 text-center text-xs text-navy/50">
          {fr
            ? "Clique sur un point pour voir les détails. Carte © OpenStreetMap."
            : "Click a marker to see details. Map © OpenStreetMap."}
        </p>
      </div>
    </section>
  );
}
