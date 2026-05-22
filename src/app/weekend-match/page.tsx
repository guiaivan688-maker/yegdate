"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Heart, Users, PartyPopper, Briefcase, Coffee, Zap, UtensilsCrossed, Compass, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import plansRaw from "@/data/weekend-plans.json";

interface Step { time: string; title: { fr: string; en: string }; place: string; address: string; price: number; }
interface Plan { id: string; segment: string; title: { fr: string; en: string }; image: string; ambiance: string; budgetTier: number; season: string[]; steps: Step[]; total: number; }

const plans = plansRaw as Plan[];

type StepName = "segment" | "budget" | "ambiance" | "timing" | "loading" | "results";

const segmentOptions = [
  { key: "couples", Icon: Heart },
  { key: "famille", Icon: Users },
  { key: "amis", Icon: PartyPopper },
  { key: "business", Icon: Briefcase },
];
const budgetOptions = [
  { key: "b60", value: 60 },
  { key: "b120", value: 120 },
  { key: "b250", value: 250 },
  { key: "b400", value: 100000 },
];
const ambianceOptions = [
  { key: "calme", Icon: Coffee },
  { key: "dynamique", Icon: Zap },
  { key: "gourmand", Icon: UtensilsCrossed },
  { key: "decouverte", Icon: Compass },
];
const timingOptions = ["weekend", "twoweeks", "month", "later"];

export default function WeekendMatchPage() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState<StepName>("segment");
  const [segment, setSegment] = useState("");
  const [budget, setBudget] = useState(0);
  const [ambiance, setAmbiance] = useState("");
  const [saved, setSaved] = useState(false);

  const steps: StepName[] = ["segment", "budget", "ambiance", "timing"];
  const currentIndex = steps.indexOf(step);

  useEffect(() => {
    if (step === "loading") {
      const id = setTimeout(() => setStep("results"), 2000);
      return () => clearTimeout(id);
    }
  }, [step]);

  function reset() {
    setSegment(""); setBudget(0); setAmbiance(""); setSaved(false); setStep("segment");
  }

  let results = plans.filter((p) => p.segment === segment);
  if (budget) results = results.filter((p) => p.budgetTier <= budget);
  const withAmbiance = ambiance ? results.filter((p) => p.ambiance === ambiance) : results;
  const isExact = withAmbiance.length >= 2;
  const finalResults = [...(isExact ? withAmbiance : results)].sort((a, b) => b.budgetTier - a.budgetTier).slice(0, 3);

  const optionCard = "rounded-2xl border border-cream/15 bg-cream/5 px-6 py-5 text-center hover:border-gold hover:bg-cream/10 transition-all cursor-pointer group";

  return (
    <div className="min-h-screen bg-navy-dark text-cream py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">{t("weekendMatch.title")}</h1>
          <p className="text-cream/60 text-lg">{t("weekendMatch.subtitle")}</p>
        </motion.div>

        {step !== "results" && step !== "loading" && (
          <div className="flex justify-center gap-2 mb-12">
            {steps.map((s, i) => (
              <div key={s} className={`h-1.5 w-14 rounded-full transition-colors ${i <= currentIndex ? "gradient-gold" : "bg-cream/15"}`} />
            ))}
          </div>
        )}

        <div>
          {step === "segment" && (
            <motion.div key="segment" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif text-2xl font-semibold mb-7 text-center">{t("weekendMatch.q1")}</h2>
              <div className="grid grid-cols-2 gap-4">
                {segmentOptions.map((o) => (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} key={o.key} onClick={() => { setSegment(o.key); setStep("budget"); }} className={optionCard}>
                    <o.Icon className="w-8 h-8 text-gold mx-auto mb-2" strokeWidth={1.5} />
                    <span className="font-semibold group-hover:text-gold transition-colors">{t(`nav.${o.key}`)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "budget" && (
            <motion.div key="budget" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif text-2xl font-semibold mb-7 text-center">{t("weekendMatch.q2")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {budgetOptions.map((o) => (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} key={o.key} onClick={() => { setBudget(o.value); setStep("ambiance"); }} className={optionCard}>
                    <span className="font-serif text-2xl font-bold block group-hover:text-gold transition-colors">{t(`budgets.${o.key}`)}</span>
                    <span className="text-cream/50 text-xs">{t(`budgetLabels.${o.key}`)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "ambiance" && (
            <motion.div key="ambiance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif text-2xl font-semibold mb-7 text-center">{t("weekendMatch.q3")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ambianceOptions.map((o) => (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} key={o.key} onClick={() => { setAmbiance(o.key); setStep("timing"); }} className={optionCard}>
                    <o.Icon className="w-7 h-7 text-gold mx-auto mb-2" strokeWidth={1.5} />
                    <span className="font-semibold group-hover:text-gold transition-colors">{t(`ambiance.${o.key}`)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "timing" && (
            <motion.div key="timing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-serif text-2xl font-semibold mb-7 text-center">{t("weekendMatch.q4")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {timingOptions.map((key) => (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} key={key} onClick={() => setStep("loading")} className={optionCard}>
                    <span className="font-semibold group-hover:text-gold transition-colors">{t(`timing.${key}`)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Loader2 className="w-12 h-12 text-gold mx-auto mb-6 animate-spin" strokeWidth={1.5} />
              <p className="font-serif text-2xl text-cream/90">{t("weekendMatch.loading")}</p>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-semibold">{t("weekendMatch.results")}</h2>
                <button onClick={reset} className="text-sm text-gold font-semibold hover:underline">{t("weekendMatch.restart")}</button>
              </div>
              {!isExact && finalResults.length > 0 && <p className="text-cream/55 text-sm mb-6">{t("weekendMatch.noResults")}</p>}
              <div className="space-y-6">
                {finalResults.map((plan) => (
                  <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-cream/5 border border-cream/12 rounded-3xl overflow-hidden md:flex">
                    <div className="relative h-48 md:h-auto md:w-2/5">
                      <Image src={plan.image} alt={plan.title[locale]} fill className="object-cover saturate-[0.92]" sizes="(max-width:768px) 100vw, 40vw" />
                    </div>
                    <div className="p-6 md:w-3/5">
                      <h3 className="font-serif text-xl font-bold mb-4">{plan.title[locale]}</h3>
                      <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{t("weekendMatch.perStep")}</p>
                      <div className="space-y-3 mb-5">
                        {plan.steps.map((s, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="text-cream/40 text-xs font-mono pt-0.5 w-12 shrink-0">{s.time}</span>
                            <div className="flex-1">
                              <p className="text-cream text-sm font-medium">{s.title[locale]}</p>
                              <p className="text-cream/45 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.5} /> {s.place} · {s.address}</p>
                            </div>
                            <span className="text-cream/70 text-sm font-semibold shrink-0">{s.price > 0 ? `$${s.price}` : "—"}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-cream/12 pt-4 gap-3 flex-wrap">
                        <div>
                          <span className="text-cream/50 text-xs">{t("weekendMatch.total")}</span>
                          <span className="block font-serif text-2xl font-bold">${plan.total}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setSaved(true)} className="border border-cream/25 text-cream text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-cream/10 transition-colors">
                            {t("weekendMatch.save")}
                          </button>
                          <a href={`/contact?plan=${encodeURIComponent(plan.title[locale])}`} className="gradient-gold text-navy text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                            {t("weekendMatch.reserve")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {saved && <p className="text-gold text-sm text-center mt-6">{t("weekendMatch.saved")}</p>}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
