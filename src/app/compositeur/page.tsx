"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Users, PartyPopper, User, MapPin, Sparkles, Share2, Bookmark, RotateCcw, RefreshCw } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import plansRaw from "@/data/weekend-plans.json";

interface Step { time: string; title: { fr: string; en: string }; place: string; address: string; price: number; }
interface Plan { id: string; segment: string; title: { fr: string; en: string }; image: string; ambiance: string; budgetTier: number; season: string[]; steps: Step[]; total: number; }

const plans = plansRaw as Plan[];

// Catégories par plan, pour suivre les combinaisons les plus demandées (ex: Resto + Spectacle).
const PLAN_CATEGORIES: Record<string, string[]> = {
  "cp-patinage-chocolat": ["Plein air", "Café"],
  "cp-brunch-jardins": ["Resto", "Plein air"],
  "cp-diner-exception": ["Resto", "Bar"],
  "cp-croisiere-coucher": ["Plein air", "Café"],
  "cp-sous-les-etoiles": ["Plein air"],
  "cp-escapade-fairmont": ["Hôtel", "Resto"],
  "cp-spa-diner": ["Spa", "Resto"],
  "cp-aventure-hivernale": ["Plein air", "Resto"],
  "cp-tramway-diner": ["Activité", "Resto"],
  "cp-pique-nique-riviere": ["Plein air", "Culture"],
  "fm-science-lunch": ["Culture", "Resto"],
  "fm-fort-edmonton-journee": ["Culture", "Café"],
  "fm-galaxyland-waterpark": ["Activité"],
  "fm-elk-island-nature": ["Plein air"],
  "am-axe-burgers": ["Activité", "Bar"],
  "am-escape-cocktails": ["Activité", "Bar"],
  "am-brewery-creatif": ["Activité", "Bar"],
  "bz-team-day": ["Activité"],
  "bz-afterwork": ["Bar"],
  "bz-soiree-corporate": ["Activité", "Culture"],
  "so-art-cafe": ["Culture", "Café"],
  "so-vallee-librairie": ["Plein air", "Café"],
  "so-jazz-bistro": ["Resto", "Spectacle"],
  "so-atelier-cuisine": ["Activité", "Culture"],
};

const MAX_BUDGET = 400;

type Season = "spring" | "summer" | "fall" | "winter";

function currentSeason(): Season {
  const m = new Date().getMonth(); // 0–11
  if (m >= 2 && m <= 4) return "spring";   // mars-mai
  if (m >= 5 && m <= 7) return "summer";   // juin-août
  if (m >= 8 && m <= 10) return "fall";    // sept-nov
  return "winter";                          // déc-fév
}

const SEASON_LABEL: Record<Season, { fr: string; en: string; emoji: string }> = {
  spring: { fr: "Printemps", en: "Spring", emoji: "🌸" },
  summer: { fr: "Été",       en: "Summer", emoji: "☀️" },
  fall:   { fr: "Automne",   en: "Fall",   emoji: "🍁" },
  winter: { fr: "Hiver",     en: "Winter", emoji: "❄️" },
};

const CTX_RECAP: Record<string, { fr: string; en: string }> = {
  couples: { fr: "En couple",   en: "As a couple" },
  famille: { fr: "En famille",  en: "As a family" },
  amis:    { fr: "Entre amis",  en: "With friends" },
  solo:    { fr: "En solo",     en: "Solo" },
};

const contextOptions = [
  { key: "couples", labelKey: "compositeur.ctxCouple",  Icon: Heart },
  { key: "famille", labelKey: "compositeur.ctxFamille", Icon: Users },
  { key: "amis",    labelKey: "compositeur.ctxAmis",    Icon: PartyPopper },
  { key: "solo",    labelKey: "compositeur.ctxSolo",    Icon: User },
];

const stepKey = (s: Step) => `${s.place}|${s.title.fr}`;
const sumPrice = (steps: Step[]) => steps.reduce((n, s) => n + s.price, 0);
const byTime = (a: Step, b: Step) => a.time.localeCompare(b.time);

function segmentSteps(segment: string): Step[] {
  const seen = new Set<string>();
  const out: Step[] = [];
  for (const p of plans) {
    if (p.segment !== segment) continue;
    for (const s of p.steps) {
      const k = stepKey(s);
      if (!seen.has(k)) { seen.add(k); out.push(s); }
    }
  }
  return out;
}

function pickForBudget(segment: string, budget: number): { plan: Plan | null; fits: boolean; pool: Plan[] } {
  const season = currentSeason();
  const segmentPlans = plans.filter((p) => p.segment === segment);
  // On préfère les plans qui collent à la saison actuelle ; si aucun ne correspond, on retombe sur tout le segment.
  const seasonal = segmentPlans.filter((p) => p.season.includes(season));
  const candidates = seasonal.length > 0 ? seasonal : segmentPlans;
  const cap = budget >= MAX_BUDGET ? Infinity : budget;
  const fitting = candidates.filter((p) => p.total <= cap).sort((a, b) => b.total - a.total);
  if (fitting.length > 0) return { plan: fitting[0], fits: true, pool: fitting };
  const cheapest = [...candidates].sort((a, b) => a.total - b.total)[0] ?? null;
  return { plan: cheapest, fits: false, pool: candidates };
}

export default function CompositeurPage() {
  const { locale, t } = useLocale();
  const fr = locale === "fr";
  const [step, setStep] = useState<"setup" | "result">("setup");
  const [context, setContext] = useState("couples");
  const [budget, setBudget] = useState(120);
  const [base, setBase] = useState<Plan | null>(null);
  const [nightSteps, setNightSteps] = useState<Step[]>([]);
  const [fits, setFits] = useState(true);
  const [saved, setSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const sharedId = new URLSearchParams(window.location.search).get("plan");
    if (!sharedId) return;
    const shared = plans.find((p) => p.id === sharedId);
    if (shared) {
      setContext(shared.segment);
      setBudget(shared.total >= MAX_BUDGET ? MAX_BUDGET : Math.max(20, Math.ceil(shared.total / 10) * 10));
      setBase(shared);
      setNightSteps([...shared.steps].sort(byTime));
      setFits(true);
      setStep("result");
    }
  }, []);

  const compose = useCallback(() => {
    const r = pickForBudget(context, budget);
    setBase(r.plan);
    setNightSteps(r.plan ? [...r.plan.steps].sort(byTime) : []);
    setFits(r.fits);
    setSaved(false);
    setShareCopied(false);
    setStep("result");
    // Suivi anonyme pour les analyses (budget, contexte, et si une soirée a été trouvée) — aucune donnée perso.
    const categories = r.plan ? PLAN_CATEGORIES[r.plan.id] ?? [] : [];
    void supabase.from("composer_runs").insert({ budget, context, fits: r.fits, categories });
  }, [context, budget]);

  const surprise = useCallback(() => {
    const r = pickForBudget(context, budget);
    const others = r.pool.filter((p) => p.id !== base?.id);
    const next = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : r.plan;
    if (next) {
      setBase(next);
      setNightSteps([...next.steps].sort(byTime));
      setFits(r.fits);
      setSaved(false);
      setShareCopied(false);
    }
  }, [context, budget, base]);

  const swapStep = useCallback((index: number) => {
    const pool = segmentSteps(context);
    const used = new Set(nightSteps.map(stepKey));
    const current = nightSteps[index];
    if (!current) return;
    const cap = budget >= MAX_BUDGET ? Infinity : budget;
    const baseSum = sumPrice(nightSteps) - current.price;
    const candidates = pool.filter((s) => !used.has(stepKey(s)));
    if (candidates.length === 0) return;
    const fitting = candidates.filter((s) => baseSum + s.price <= cap);
    const choices = fitting.length > 0 ? fitting : candidates;
    const choice = choices[Math.floor(Math.random() * choices.length)];
    if (!choice) return;
    const next = [...nightSteps];
    next[index] = choice;
    next.sort(byTime);
    setNightSteps(next);
    setSaved(false);
    setShareCopied(false);
  }, [context, budget, nightSteps]);

  function save() {
    if (!base) return;
    try {
      const key = "yegdate-soirees";
      const existing = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      if (!existing.includes(base.id)) localStorage.setItem(key, JSON.stringify([...existing, base.id]));
      setSaved(true);
    } catch { /* no-op */ }
  }

  async function share() {
    if (!base) return;
    const url = `${window.location.origin}/compositeur?plan=${encodeURIComponent(base.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: base.title[locale], url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
      }
    } catch { /* no-op */ }
  }

  const budgetLabel = budget >= MAX_BUDGET ? "$400+" : `$${budget}`;
  const total = sumPrice(nightSteps);
  const remaining = budget - total;
  const season = currentSeason();

  const HOW_STEPS: { n: string; fr: string; en: string }[] = [
    { n: "1", fr: "Dis-nous avec qui tu sors + ton budget",            en: "Tell us who's coming + your budget" },
    { n: "2", fr: "On compose 2–3 vrais spots à Edmonton, à l'heure",  en: "We pick 2–3 real Edmonton spots, with times" },
    { n: "3", fr: "Tu peux échanger une étape ou réserver en 1 clic",  en: "Swap any step or book in 1 click" },
  ];

  return (
    <div className="min-h-screen bg-navy-dark text-cream py-16 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {step === "setup" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Header */}
            <div className="text-center">
              <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">{t("compositeur.title")}</h1>
              <p className="text-cream/65 text-base sm:text-lg max-w-2xl mx-auto">{t("compositeur.subtitle")}</p>
            </div>

            {/* « Comment ça marche » : 3 étapes pour que les visiteurs comprennent immédiatement le flow. */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {HOW_STEPS.map((s) => (
                <div key={s.n} className="bg-cream/5 border border-cream/12 rounded-2xl p-4 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold/20 text-gold font-bold text-xs mb-2">{s.n}</span>
                  <p className="text-cream/80 text-xs sm:text-sm leading-snug">{fr ? s.fr : s.en}</p>
                </div>
              ))}
            </div>

            {/* Question 1 — contexte */}
            <div>
              <h2 className="font-serif text-2xl font-semibold mb-6 text-center">{t("compositeur.q1")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {contextOptions.map((o) => {
                  const active = context === o.key;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      key={o.key}
                      onClick={() => setContext(o.key)}
                      className={`rounded-2xl border px-4 py-5 text-center transition-all ${active ? "border-gold bg-cream/10" : "border-cream/15 bg-cream/5 hover:border-gold/60"}`}
                    >
                      <o.Icon className={`w-7 h-7 mx-auto mb-2 ${active ? "text-gold" : "text-cream/70"}`} strokeWidth={1.5} />
                      <span className={`font-semibold text-sm ${active ? "text-gold" : ""}`}>{t(o.labelKey)}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 — budget */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-serif text-2xl font-semibold">{t("compositeur.budgetLabel")}</h2>
                <span className="font-serif text-3xl font-bold text-gold">{budgetLabel}</span>
              </div>
              <input
                type="range"
                min={20}
                max={MAX_BUDGET}
                step={10}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
                aria-label={t("compositeur.budgetLabel")}
              />
              <div className="flex justify-between text-cream/40 text-xs mt-2">
                <span>$20</span>
                <span>$400+</span>
              </div>
            </div>

            <button
              onClick={compose}
              className="w-full gradient-gold text-navy font-bold text-lg py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              {t("compositeur.compose")}
            </button>

            {/* Hint saison : transparent sur le fait qu'on filtre selon la météo actuelle. */}
            <p className="text-center text-cream/40 text-xs">
              {fr
                ? `Suggestions adaptées à la saison actuelle : ${SEASON_LABEL[season].fr.toLowerCase()} ${SEASON_LABEL[season].emoji} à Edmonton.`
                : `Suggestions tuned to the current season: ${SEASON_LABEL[season].en.toLowerCase()} ${SEASON_LABEL[season].emoji} in Edmonton.`}
            </p>
          </motion.div>
        )}

        {step === "result" && base && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header résultat distinct + recap (contexte · budget · saison) → l'utilisateur sait ce qu'on lui a composé. */}
            <div className="text-center mb-7">
              <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
                {fr ? "Voilà votre soirée" : "Here's your night"}
              </h1>
              <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                <span className="bg-cream/10 rounded-full px-3 py-1 text-cream/80">{CTX_RECAP[context]?.[locale] ?? context}</span>
                <span className="bg-cream/10 rounded-full px-3 py-1 text-cream/80">${budget}</span>
                <span className="bg-gold/15 border border-gold/25 rounded-full px-3 py-1 text-gold">{SEASON_LABEL[season].emoji} {SEASON_LABEL[season][locale]} · Edmonton</span>
              </div>
            </div>

            {!fits && (
              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 mb-6 text-center">
                <p className="font-semibold text-gold mb-1">{t("compositeur.noFitTitle")}</p>
                <p className="text-cream/70 text-sm">{t("compositeur.noFitText")}</p>
              </div>
            )}
            <div className="bg-cream/5 border border-cream/12 rounded-3xl overflow-hidden">
              <div className="relative h-56">
                <Image src={base.image} alt={base.title[locale]} fill className="object-cover saturate-[0.92]" sizes="(max-width:768px) 100vw, 768px" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 to-transparent" />
                <h2 className="absolute bottom-4 left-5 right-5 font-serif text-2xl font-bold">{base.title[locale]}</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider">{t("compositeur.steps")}</p>
                  <p className="text-cream/55 text-xs inline-flex items-center gap-1"><RefreshCw className="w-3 h-3" strokeWidth={2} /> {t("compositeur.swapHint")}</p>
                </div>
                <div className="space-y-3 mb-5">
                  {nightSteps.map((s, i) => (
                    <div key={stepKey(s)} className="flex gap-3 items-start">
                      <span className="text-cream/40 text-xs font-mono pt-0.5 w-12 shrink-0">{s.time}</span>
                      <div className="flex-1">
                        <p className="text-cream text-sm font-medium">{s.title[locale]}</p>
                        <p className="text-cream/45 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" strokeWidth={1.5} /> {s.place} · {s.address}</p>
                      </div>
                      <span className="text-cream/70 text-sm font-semibold shrink-0">{s.price > 0 ? `$${s.price}` : "—"}</span>
                      <button onClick={() => swapStep(i)} aria-label={t("compositeur.swap")} title={t("compositeur.swap")} className="shrink-0 text-cream/40 hover:text-gold transition-colors p-1 -m-1">
                        <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-cream/12 pt-4 mb-5">
                  <div>
                    <span className="text-cream/50 text-xs">{t("compositeur.total")}</span>
                    <span className="block font-serif text-2xl font-bold">${total}</span>
                  </div>
                  <div className="text-right">
                    {remaining >= 0 ? (
                      <>
                        <span className="text-cream/50 text-xs">{t("compositeur.remaining")}</span>
                        <span className="block font-serif text-2xl font-bold text-gold">${remaining}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-cream/50 text-xs">{t("compositeur.over")}</span>
                        <span className="block font-serif text-2xl font-bold text-red-300">${Math.abs(remaining)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button onClick={surprise} className="flex items-center gap-1.5 border border-cream/25 text-cream text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-cream/10 transition-colors">
                    <Sparkles className="w-4 h-4" strokeWidth={1.5} /> {t("compositeur.surprise")}
                  </button>
                  <button onClick={save} className="flex items-center gap-1.5 border border-cream/25 text-cream text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-cream/10 transition-colors">
                    <Bookmark className="w-4 h-4" strokeWidth={1.5} /> {saved ? t("compositeur.saved") : t("compositeur.save")}
                  </button>
                  <button onClick={share} className="flex items-center gap-1.5 border border-cream/25 text-cream text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-cream/10 transition-colors">
                    <Share2 className="w-4 h-4" strokeWidth={1.5} /> {shareCopied ? t("compositeur.shareCopied") : t("compositeur.share")}
                  </button>
                  <a href={`/contact?plan=${encodeURIComponent(base.title[locale])}`} className="flex items-center gap-1.5 gradient-gold text-navy text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity ml-auto">
                    {t("compositeur.reserve")}
                  </a>
                </div>
              </div>
            </div>

            <button onClick={() => setStep("setup")} className="flex items-center gap-1.5 mx-auto mt-7 text-gold text-sm font-semibold hover:underline">
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} /> {t("compositeur.restart")}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
