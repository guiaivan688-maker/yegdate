"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, MapPin, Minus, Plus } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import ActivityCard from "@/components/ActivityCard";
import { getActivitiesBySegment } from "@/lib/activities";
import { getNeighbourhood, fitsGroupSize, NEIGHBOURHOODS, type Neighbourhood } from "@/lib/activity-filters";

interface SegmentPageProps {
  segment: "couples" | "famille" | "amis" | "business";
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  heroImage: string;
}

const seasonKeys = ["all", "spring", "summer", "fall", "winter"] as const;

export default function SegmentPage({ segment, title, subtitle, heroImage }: SegmentPageProps) {
  const { locale, t } = useLocale();
  const fr = locale === "fr";
  const [season, setSeason] = useState<string>("all");
  const [neighbourhood, setNeighbourhood] = useState<Neighbourhood | "all">("all");
  // Pour couples : nombre de COUPLES (×2 pour pers). Sinon : nombre de personnes.
  const isCouples = segment === "couples";
  const [unit, setUnit] = useState<number>(isCouples ? 1 : 2);
  const guests = isCouples ? unit * 2 : unit;

  const all = getActivitiesBySegment(segment);

  const availableNeighbourhoods = useMemo(() => {
    const set = new Set(all.map((a) => getNeighbourhood(a.address || "")));
    return NEIGHBOURHOODS.filter((n) => set.has(n));
  }, [all]);

  const filtered = all.filter((a) => {
    if (season !== "all" && !a.season.includes(season)) return false;
    if (neighbourhood !== "all" && getNeighbourhood(a.address || "") !== neighbourhood) return false;
    if (!fitsGroupSize(a, guests, locale)) return false;
    return true;
  });

  const guestLabel = isCouples
    ? fr ? "Combien de couples ?" : "How many couples?"
    : fr ? "Combien êtes-vous ?" : "How many are you?";

  const unitWord = isCouples
    ? unit > 1 ? (fr ? "couples" : "couples") : (fr ? "couple" : "couple")
    : unit > 1 ? (fr ? "personnes" : "people") : (fr ? "personne" : "person");

  return (
    <>
      <section className="relative h-[55vh] min-h-[340px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={title[locale]}
            fill
            sizes="100vw"
            className="object-cover saturate-[0.9] contrast-[1.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3 leading-tight">
              {title[locale]}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl min-h-[3rem]">{subtitle[locale]}</p>
          </motion.div>
        </div>
      </section>

      {/* Sticky filter bar — opaque + 1px divider pour éviter la collision avec la nav */}
      <section className="sticky top-16 z-30 bg-cream/95 backdrop-blur border-b border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
          {/* Row 1: Personnes + Saison */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-surface rounded-full border border-black/10 px-3 py-1.5">
              <Users className="w-4 h-4 text-gold shrink-0" strokeWidth={1.5} />
              <span className="text-navy/70 text-xs font-medium whitespace-nowrap">{guestLabel}</span>
              <button
                onClick={() => setUnit(Math.max(1, unit - 1))}
                aria-label={fr ? "Diminuer" : "Decrease"}
                className="w-6 h-6 rounded-full bg-navy/10 text-navy hover:bg-navy hover:text-cream transition-colors flex items-center justify-center"
              >
                <Minus className="w-3 h-3" strokeWidth={2.5} />
              </button>
              <span className="text-navy font-bold text-sm w-5 text-center tabular-nums">{unit}</span>
              <button
                onClick={() => setUnit(Math.min(50, unit + 1))}
                aria-label={fr ? "Augmenter" : "Increase"}
                className="w-6 h-6 rounded-full bg-navy/10 text-navy hover:bg-navy hover:text-cream transition-colors flex items-center justify-center"
              >
                <Plus className="w-3 h-3" strokeWidth={2.5} />
              </button>
              <span className="text-navy/45 text-[10px] uppercase tracking-wider whitespace-nowrap">{unitWord}</span>
              {isCouples && (
                <span className="text-navy/40 text-[10px] hidden sm:inline">= {guests} {fr ? "pers" : "ppl"}</span>
              )}
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {seasonKeys.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    season === s ? "gradient-navy text-cream" : "bg-surface text-navy/70 hover:text-navy border border-black/10"
                  }`}
                >
                  {t(`seasons.${s}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Quartier */}
          {availableNeighbourhoods.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-navy/40 shrink-0" strokeWidth={1.5} />
              <button
                onClick={() => setNeighbourhood("all")}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                  neighbourhood === "all" ? "bg-navy text-cream" : "bg-surface text-navy/70 border border-black/10 hover:text-navy"
                }`}
              >
                {fr ? "Tous les quartiers" : "All neighbourhoods"}
              </button>
              {availableNeighbourhoods.map((n) => (
                <button
                  key={n}
                  onClick={() => setNeighbourhood(n)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                    neighbourhood === n ? "bg-navy text-cream" : "bg-surface text-navy/70 border border-black/10 hover:text-navy"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-navy/55 text-xs sm:text-sm mb-8">
            {filtered.length > 0
              ? fr
                ? `${filtered.length} activité${filtered.length > 1 ? "s" : ""} • estimation pour ${guests} ${guests > 1 ? "pers" : "pers"}`
                : `${filtered.length} ${filtered.length > 1 ? "activities" : "activity"} • estimate for ${guests} ${guests > 1 ? "people" : "person"}`
              : fr
                ? "Aucune activité ne correspond à ces filtres."
                : "No activities match these filters."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 [grid-auto-flow:dense]">
            {filtered.map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={i}
                featured={i === 0}
                guests={guests}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <button
                onClick={() => { setSeason("all"); setNeighbourhood("all"); setUnit(isCouples ? 1 : 2); }}
                className="text-navy/60 hover:text-navy text-sm underline underline-offset-4"
              >
                {fr ? "Réinitialiser les filtres" : "Reset filters"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
