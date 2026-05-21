"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { useWeather } from "@/lib/weather-context";
import ActivityCard from "@/components/ActivityCard";
import WeatherWidget from "@/components/WeatherWidget";
import { allActivities } from "@/lib/activities";

const segmentFilters = ["all", "couples", "famille", "amis", "business"] as const;
const budgetFilters = [
  { key: "all", max: Infinity },
  { key: "b60", max: 60 },
  { key: "b120", max: 120 },
  { key: "b250", max: 250 },
  { key: "b400", max: Infinity, min: 250 },
] as const;

export default function DecouvrirPage() {
  const { locale, t } = useLocale();
  const weather = useWeather();
  const [segment, setSegment] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");

  let filtered = allActivities;
  if (segment !== "all") filtered = filtered.filter((a) => a.segment === segment);
  if (budget !== "all") {
    const def = budgetFilters.find((b) => b.key === budget)!;
    if (budget === "b400") filtered = filtered.filter((a) => a.budgetTier >= 250);
    else filtered = filtered.filter((a) => a.budgetTier <= def.max);
  }
  filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const temp = weather?.temperature ?? null;
  const contextMsg =
    temp === null
      ? null
      : temp < 0
      ? locale === "fr"
        ? `Il fait ${temp}°C — on a mis en avant nos plans au chaud ❄️`
        : `It's ${temp}°C — we've highlighted our cozy indoor plans ❄️`
      : temp >= 18
      ? locale === "fr"
        ? `Il fait ${temp}°C — profitez du soleil avec nos plans extérieurs ☀️`
        : `It's ${temp}°C — enjoy the sun with our outdoor plans ☀️`
      : null;

  return (
    <>
      <section className="relative h-[42vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
            alt="Edmonton"
            fill
            className="object-cover saturate-[0.9] contrast-[1.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="absolute top-20 right-4 sm:right-8 z-10">
          <WeatherWidget />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3">{t("discover.title")}</h1>
            <p className="text-cream/80 text-lg max-w-xl">{t("discover.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-cream/90 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <div className="flex gap-2 overflow-x-auto">
            {segmentFilters.map((s) => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  segment === s ? "gradient-navy text-cream" : "bg-surface text-navy/70 hover:text-navy border border-black/5"
                }`}
              >
                {s === "all" ? t("common.viewAll") : t(`nav.${s}`)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {budgetFilters.map((b) => (
              <button
                key={b.key}
                onClick={() => setBudget(b.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  budget === b.key ? "bg-gold text-navy" : "bg-surface text-navy/60 hover:text-navy border border-black/5"
                }`}
              >
                {b.key === "all" ? (locale === "fr" ? "Tous budgets" : "All budgets") : t(`budgets.${b.key}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {contextMsg && (
            <div className="mb-8 glass rounded-2xl px-5 py-3 text-navy/80 text-sm font-medium inline-flex items-center gap-2">
              {contextMsg}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-navy/60 py-16 text-lg">
              {locale === "fr" ? "Aucune activité pour ces filtres." : "No activities for these filters."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
