"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import PlanCard from "@/components/PlanCard";
import plansData from "@/data/plans.json";

type Step = "segment" | "budget" | "mood" | "season" | "results";

export default function WeekendMatchPage() {
  const { locale } = useLocale();
  const [step, setStep] = useState<Step>("segment");
  const [segment, setSegment] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [season, setSeason] = useState("");

  const steps: Step[] = ["segment", "budget", "mood", "season"];
  const currentIndex = steps.indexOf(step);

  function nextStep(value: string) {
    if (step === "segment") { setSegment(value); setStep("budget"); }
    else if (step === "budget") { setBudget(value); setStep("mood"); }
    else if (step === "mood") { setMood(value); setStep("season"); }
    else if (step === "season") { setSeason(value); setStep("results"); }
  }

  function reset() {
    setSegment(""); setBudget(""); setMood(""); setSeason("");
    setStep("segment");
  }

  const results = plansData.plans.filter((p) => {
    if (segment && !p.segments.includes(segment)) return false;
    if (budget && p.budget !== budget) return false;
    if (mood && !p.moods.includes(mood)) return false;
    if (season && !p.seasons.includes(season)) return false;
    return true;
  });

  const optionClass =
    "bg-white rounded-2xl border border-gray-200 px-6 py-4 text-left hover:border-gold hover:shadow-md transition-all cursor-pointer group";

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl sm:text-5xl font-bold text-navy mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t("weekendMatch", "title", locale)}
          </h1>
          <p className="text-navy/60 text-lg">
            {t("weekendMatch", "subtitle", locale)}
          </p>
        </motion.div>

        {step !== "results" && (
          <div className="flex justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  i <= currentIndex ? "gradient-gold" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {step === "segment" && (
            <motion.div key="segment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-semibold text-navy mb-6 text-center">
                {t("weekendMatch", "segment", locale)}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(["couple", "famille", "amis", "business"] as const).map((seg) => (
                  <button key={seg} onClick={() => nextStep(seg)} className={optionClass}>
                    <span className="text-2xl mb-2 block">
                      {seg === "couple" ? "💑" : seg === "famille" ? "👨‍👩‍👧‍👦" : seg === "amis" ? "🎉" : "💼"}
                    </span>
                    <span className="text-navy font-semibold group-hover:text-gold transition-colors">
                      {t("segments", seg, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "budget" && (
            <motion.div key="budget" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-semibold text-navy mb-6 text-center">
                {t("weekendMatch", "budget", locale)}
              </h2>
              <div className="grid gap-4">
                {(["low", "medium", "high"] as const).map((b) => (
                  <button key={b} onClick={() => nextStep(b)} className={optionClass}>
                    <span className="text-navy font-semibold group-hover:text-gold transition-colors">
                      {t("budgets", b, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "mood" && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-semibold text-navy mb-6 text-center">
                {t("weekendMatch", "mood", locale)}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(["romantic", "adventure", "relaxation", "culture", "festive"] as const).map((m) => (
                  <button key={m} onClick={() => nextStep(m)} className={optionClass}>
                    <span className="text-2xl mb-2 block">
                      {m === "romantic" ? "💕" : m === "adventure" ? "🏔️" : m === "relaxation" ? "🧘" : m === "culture" ? "🎭" : "🎊"}
                    </span>
                    <span className="text-navy font-semibold group-hover:text-gold transition-colors">
                      {t("moods", m, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "season" && (
            <motion.div key="season" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-semibold text-navy mb-6 text-center">
                {t("weekendMatch", "season", locale)}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(["spring", "summer", "fall", "winter"] as const).map((s) => (
                  <button key={s} onClick={() => nextStep(s)} className={optionClass}>
                    <span className="text-2xl mb-2 block">
                      {s === "spring" ? "🌸" : s === "summer" ? "☀️" : s === "fall" ? "🍂" : "❄️"}
                    </span>
                    <span className="text-navy font-semibold group-hover:text-gold transition-colors">
                      {t("seasons", s, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-navy">
                  {t("weekendMatch", "results", locale)} ({results.length})
                </h2>
                <button
                  onClick={reset}
                  className="text-sm text-gold font-semibold hover:underline"
                >
                  {locale === "fr" ? "Recommencer" : "Start over"}
                </button>
              </div>
              {results.length === 0 ? (
                <p className="text-navy/60 text-center py-10">
                  {t("weekendMatch", "noResults", locale)}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.map((plan, i) => (
                    <PlanCard key={plan.id} plan={plan} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
