"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import ActivityCard from "@/components/ActivityCard";
import { getActivitiesBySegment } from "@/lib/activities";

interface SegmentPageProps {
  segment: "couples" | "famille" | "amis" | "business";
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  heroImage: string;
}

const seasonKeys = ["all", "spring", "summer", "fall", "winter"] as const;

export default function SegmentPage({ segment, title, subtitle, heroImage }: SegmentPageProps) {
  const { locale, t } = useLocale();
  const [season, setSeason] = useState<string>("all");

  const activities = getActivitiesBySegment(segment);
  const filtered =
    season === "all" ? activities : activities.filter((a) => a.season.includes(season));

  return (
    <>
      <section className="relative h-[55vh] min-h-[340px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={title[locale]}
            fill
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
            <p className="text-cream/80 text-lg max-w-xl">{subtitle[locale]}</p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-cream/90 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
          {seasonKeys.map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                season === s
                  ? "gradient-navy text-cream"
                  : "bg-surface text-navy/70 hover:text-navy border border-black/5"
              }`}
            >
              {t(`seasons.${s}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-navy/60 py-16 text-lg">
              {locale === "fr"
                ? "Aucune activité pour cette saison."
                : "No activities for this season."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
