"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import PlanCard from "@/components/PlanCard";
import WeatherWidget from "@/components/WeatherWidget";
import plansData from "@/data/plans.json";

const filterCategories = [
  { key: "all", icon: "🌟" },
  { key: "restaurants", icon: "🍽️" },
  { key: "parks", icon: "🌳" },
  { key: "events", icon: "🎪" },
  { key: "culture", icon: "🎭" },
  { key: "seasonal", icon: "📅" },
];

export default function DecouvrirPage() {
  const { locale } = useLocale();
  const [activeFilter, setActiveFilter] = useState("all");

  const allPlans = plansData.plans;
  const filtered =
    activeFilter === "all"
      ? allPlans
      : allPlans.filter((p) => {
          if (activeFilter === "restaurants")
            return p.moods.includes("culture") || p.moods.includes("festive");
          if (activeFilter === "parks")
            return p.moods.includes("adventure") || p.moods.includes("relaxation");
          if (activeFilter === "events") return p.moods.includes("festive");
          if (activeFilter === "culture") return p.moods.includes("culture");
          if (activeFilter === "seasonal") return p.seasons.length < 4;
          return true;
        });

  return (
    <>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
            alt="Edmonton"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        </div>
        <div className="absolute top-20 right-4 sm:right-8 z-10">
          <WeatherWidget />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1
              className="text-4xl sm:text-5xl font-bold text-cream mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {t("discover", "title", locale)}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl">
              {t("discover", "subtitle", locale)}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4 border-b border-gray-100 bg-white/80 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {filterCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === cat.key
                    ? "gradient-navy text-cream"
                    : "bg-cream text-navy/70 hover:bg-gold/10 hover:text-navy border border-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.key === "all"
                  ? locale === "fr" ? "Tout" : "All"
                  : t("discover", cat.key, locale)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-navy/60 py-16 text-lg">
              {locale === "fr"
                ? "Aucune activité trouvée pour ce filtre."
                : "No activities found for this filter."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
