"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";
import plansRaw from "@/data/weekend-plans.json";

interface Step {
  time: string;
  title: { fr: string; en: string };
  place: string;
  address: string;
  price: number;
}
interface Plan {
  id: string;
  segment: string;
  title: { fr: string; en: string };
  image: string;
  ambiance: string;
  budgetTier: number;
  season: string[];
  steps: Step[];
  total: number;
}

const plans = plansRaw as Plan[];

type StepName = "segment" | "budget" | "ambiance" | "timing" | "results";

const budgetOptions = [
  { key: "b60", value: 60 },
  { key: "b120", value: 120 },
  { key: "b250", value: 250 },
  { key: "b400", value: 100000 },
];
const ambianceOptions = [
  { key: "calme", emoji: "🌿" },
  { key: "dynamique", emoji: "⚡" },
  { key: "gourmand", emoji: "🍽️" },
  { key: "decouverte", emoji: "🧭" },
];
const timingOptions = [
  { key: "weekend", emoji: "📅" },
  { key: "twoweeks", emoji: "🗓️" },
  { key: "month", emoji: "📆" },
  { key: "later", emoji: "🔮" },
];
const segmentOptions = [
  { key: "couples", emoji: "💑" },
  { key: "famille", emoji: "👨‍👩‍👧‍👦" },
  { key: "amis", emoji: "🎉" },
  { key: "business", emoji: "💼" },
];

export default function WeekendMatchPage() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState<StepName>("segment");
  const [segment, setSegment] = useState("");
  const [budget, setBudget] = useState(0);
  const [ambiance, setAmbiance] = useState("");

  const steps: StepName[] = ["segment", "budget", "ambiance", "timing"];
  const currentIndex = steps.indexOf(step);

  function reset() {
    setSegment(""); setBudget(0); setAmbiance(""); setStep("segment");
  }

  // Matching logic
  let results = plans.filter((p) => p.segment === segment);
  if (budget) results = results.filter((p) => p.budgetTier <= budget);
  const withAmbiance = ambiance ? results.filter((p) => p.ambiance === ambiance) : results;
  // Prefer ambiance matches; relax if fewer than 2
  let finalResults = withAmbiance.length >= 2 ? withAmbiance : results;
  finalResults = [...finalResults].sort((a, b) => b.budgetTier - a.budgetTier).slice(0, 3);
  const isExact = withAmbiance.length >= 2;

  const optionCard =
    "bg-surface rounded-2xl border border-black/10 px-6 py-5 text-left hover:border-gold hover:shadow-md transition-all cursor-pointer group";

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-3">{t("weekendMatch.title")}</h1>
          <p className="text-navy/60 text-lg">{t("weekendMatch.subtitle")}</p>
        </motion.div>

        {step !== "results" && (
          <div className="flex justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className={`h-1.5 w-14 rounded-full transition-colors ${i <= currentIndex ? "gradient-gold" : "bg-black/10"}`} />
            ))}
          </div>
        )}

        <div>
          {step === "segment" && (
            <div key="segment">
              <h2 className="font-serif text-2xl font-semibold text-navy mb-6 text-center">{t("weekendMatch.q1")}</h2>
              <div className="grid grid-cols-2 gap-4">
                {segmentOptions.map((o) => (
                  <button key={o.key} onClick={() => { setSegment(o.key); setStep("budget"); }} className={optionCard}>
                    <span className="text-3xl mb-2 block">{o.emoji}</span>
                    <span className="font-semibold text-navy group-hover:text-gold transition-colors">{t(`nav.${o.key}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "budget" && (
            <div key="budget">
              <h2 className="font-serif text-2xl font-semibold text-navy mb-6 text-center">{t("weekendMatch.q2")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {budgetOptions.map((o) => (
                  <button key={o.key} onClick={() => { setBudget(o.value); setStep("ambiance"); }} className={`${optionCard} text-center`}>
                    <span className="font-serif text-2xl font-bold text-navy group-hover:text-gold transition-colors">{t(`budgets.${o.key}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "ambiance" && (
            <div key="ambiance">
              <h2 className="font-serif text-2xl font-semibold text-navy mb-6 text-center">{t("weekendMatch.q3")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ambianceOptions.map((o) => (
                  <button key={o.key} onClick={() => { setAmbiance(o.key); setStep("timing"); }} className={`${optionCard} text-center`}>
                    <span className="text-3xl mb-2 block">{o.emoji}</span>
                    <span className="font-semibold text-navy group-hover:text-gold transition-colors">{t(`ambiance.${o.key}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "timing" && (
            <div key="timing">
              <h2 className="font-serif text-2xl font-semibold text-navy mb-6 text-center">{t("weekendMatch.q4")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {timingOptions.map((o) => (
                  <button key={o.key} onClick={() => setStep("results")} className={`${optionCard} text-center`}>
                    <span className="text-3xl mb-2 block">{o.emoji}</span>
                    <span className="font-semibold text-navy group-hover:text-gold transition-colors">{t(`timing.${o.key}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "results" && (
            <div key="results">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-semibold text-navy">{t("weekendMatch.results")}</h2>
                <button onClick={reset} className="text-sm text-gold font-semibold hover:underline">{t("weekendMatch.restart")}</button>
              </div>
              {!isExact && finalResults.length > 0 && (
                <p className="text-navy/60 text-sm mb-6">{t("weekendMatch.noResults")}</p>
              )}
              <div className="space-y-6">
                {finalResults.map((plan, idx) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-surface rounded-3xl border border-black/5 shadow-sm overflow-hidden md:flex"
                  >
                    <div className="relative h-48 md:h-auto md:w-2/5">
                      <Image src={plan.image} alt={plan.title[locale]} fill className="object-cover saturate-[0.92]" sizes="(max-width: 768px) 100vw, 40vw" />
                    </div>
                    <div className="p-6 md:w-3/5">
                      <h3 className="font-serif text-xl font-bold text-navy mb-4">{plan.title[locale]}</h3>
                      <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{t("weekendMatch.perStep")}</p>
                      <div className="space-y-3 mb-5">
                        {plan.steps.map((s, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="text-navy/40 text-xs font-mono pt-0.5 w-12 shrink-0">{s.time}</span>
                            <div className="flex-1">
                              <p className="text-navy text-sm font-medium">{s.title[locale]}</p>
                              <p className="text-navy/50 text-xs flex items-center gap-1">
                                <MapPinIcon className="w-3 h-3" /> {s.place} · {s.address}
                              </p>
                            </div>
                            <span className="text-navy/70 text-sm font-semibold shrink-0">{s.price > 0 ? `$${s.price}` : "—"}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-black/5 pt-4">
                        <div>
                          <span className="text-navy/50 text-xs">{t("weekendMatch.total")}</span>
                          <span className="block font-serif text-2xl font-bold text-navy">${plan.total}</span>
                        </div>
                        <a href="/services#devis" className="gradient-gold text-navy text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                          {t("weekendMatch.reserve")}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
