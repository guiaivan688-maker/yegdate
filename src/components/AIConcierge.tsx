"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";
import { useWeather, currentSeason } from "@/lib/weather-context";
import { allActivities, type Activity } from "@/lib/activities";

interface Message {
  role: "user" | "assistant";
  content: string;
  links?: { id: string; label: string }[];
}

function buildGreeting(temp: number | null, locale: "fr" | "en"): string {
  const season = currentSeason();
  if (temp === null) {
    return locale === "fr"
      ? "Bonjour ! Je suis votre concierge YEG. Dites-moi qui vous êtes (couple, famille, amis, affaires), votre budget et l'ambiance recherchée — je vous propose les meilleurs plans à Edmonton."
      : "Hello! I'm your YEG concierge. Tell me who you are (couple, family, friends, business), your budget and the vibe you want — I'll suggest the best plans in Edmonton.";
  }
  if (locale === "fr") {
    if (temp < 0)
      return `Il fait ${temp}°C à Edmonton aujourd'hui ❄️ — parfait pour des activités au chaud. Dites-moi avec qui vous sortez et votre budget, je vous propose 3 plans intérieurs.`;
    if (temp >= 18)
      return `Il fait ${temp}°C à Edmonton ☀️ — idéal pour profiter du soleil à la River Valley ! Dites-moi avec qui vous sortez et votre budget, je vous propose 3 plans extérieurs.`;
    return `Il fait ${temp}°C à Edmonton aujourd'hui. Dites-moi avec qui vous sortez (couple, famille, amis, affaires) et votre budget — je vous propose 3 plans parfaits pour la saison (${frSeason(season)}).`;
  }
  if (temp < 0)
    return `It's ${temp}°C in Edmonton today ❄️ — perfect for cozy indoor activities. Tell me who you're going out with and your budget, and I'll suggest 3 indoor plans.`;
  if (temp >= 18)
    return `It's ${temp}°C in Edmonton ☀️ — perfect to enjoy the sun in the River Valley! Tell me who you're going out with and your budget, and I'll suggest 3 outdoor plans.`;
  return `It's ${temp}°C in Edmonton today. Tell me who you're going out with (couple, family, friends, business) and your budget — I'll suggest 3 perfect plans for the season.`;
}

function frSeason(s: string) {
  return { spring: "printemps", summer: "été", fall: "automne", winter: "hiver" }[s] ?? s;
}

function recommend(input: string, temp: number | null, locale: "fr" | "en"): Message {
  const lower = input.toLowerCase();
  let pool: Activity[] = allActivities;

  if (/(couple|romanti|date|amour|love)/.test(lower)) pool = pool.filter((a) => a.segment === "couples");
  else if (/(famille|family|enfant|kid|child)/.test(lower)) pool = pool.filter((a) => a.segment === "famille");
  else if (/(ami|friend|evjf|evg|groupe|group|bachelor)/.test(lower)) pool = pool.filter((a) => a.segment === "amis");
  else if (/(business|affaire|corporate|team|entreprise|collег|colleg)/.test(lower)) pool = pool.filter((a) => a.segment === "business");

  const budgetMatch = lower.match(/(\d{2,4})\s*\$?/);
  if (budgetMatch) {
    const b = parseInt(budgetMatch[1]);
    pool = pool.filter((a) => a.priceFrom <= b * 1.2 || a.budgetTier <= b);
  }

  if (/(calme|calm|relax|tranquil)/.test(lower)) pool = pool.filter((a) => a.mood.includes("calme"));
  else if (/(dynami|lively|actif|active|sport|fun)/.test(lower)) pool = pool.filter((a) => a.mood.includes("dynamique"));
  else if (/(gourmand|food|manger|dîner|diner|eat|resto)/.test(lower)) pool = pool.filter((a) => a.mood.includes("gourmand"));
  else if (/(découv|decouv|discover|explor)/.test(lower)) pool = pool.filter((a) => a.mood.includes("decouverte"));

  // Weather-aware: cold → indoor (winter-friendly), warm → outdoor
  if (temp !== null) {
    if (temp < 0) {
      const indoor = pool.filter((a) => a.season.includes("winter"));
      if (indoor.length >= 2) pool = indoor;
    } else if (temp >= 18) {
      const outdoor = pool.filter((a) => a.season.includes("summer"));
      if (outdoor.length >= 2) pool = outdoor;
    }
  }

  if (pool.length === 0) pool = allActivities.slice(0, 3);
  const top = pool.sort((a, b) => b.rating - a.rating).slice(0, 3);

  const intro = locale === "fr" ? "Voici mes 3 recommandations :" : "Here are my 3 recommendations:";
  const body = top
    .map((a) => `• ${a.title[locale]} — ${a.priceRange[locale]}\n  📍 ${a.location}`)
    .join("\n\n");
  const outro =
    locale === "fr"
      ? "\n\nCliquez sur un plan pour voir les détails, ou ajustez votre budget/ambiance."
      : "\n\nClick a plan for details, or adjust your budget/vibe.";

  return {
    role: "assistant",
    content: `${intro}\n\n${body}${outro}`,
    links: top.map((a) => ({ id: a.id, label: a.title[locale] })),
  };
}

export default function AIConcierge() {
  const { locale, t } = useLocale();
  const weather = useWeather();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMessages([{ role: "assistant", content: buildGreeting(weather?.temperature ?? null, locale) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, locale]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const reply = recommend(input.trim(), weather?.temperature ?? null, locale);
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[340px] sm:w-[390px] h-[520px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gold/20"
          >
            <div className="gradient-navy px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gold text-lg">✦</span>
                <div>
                  <h3 className="text-cream font-serif font-bold text-lg leading-tight">{t("ai.title")}</h3>
                  <p className="text-cream/50 text-xs">{t("ai.subtitle")}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-cream/60 hover:text-cream">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-navy text-cream rounded-br-md"
                          : "bg-surface text-navy border border-black/5 rounded-bl-md shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  {msg.links && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.links.map((l) => (
                        <Link
                          key={l.id}
                          href={`/activite/${l.id}`}
                          onClick={() => setOpen(false)}
                          className="text-[11px] bg-gold/15 text-[#8a6f2c] border border-gold/30 rounded-full px-2.5 py-1 font-medium hover:bg-gold/25 transition-colors"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-black/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("ai.placeholder")}
                  className="flex-1 bg-cream/60 rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 outline-none focus:ring-2 focus:ring-gold/40 transition-shadow"
                />
                <button
                  onClick={handleSend}
                  aria-label={t("ai.send")}
                  className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
                >
                  <PaperAirplaneIcon className="w-4 h-4 text-navy" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="YEG Concierge"
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full gradient-gold shadow-lg flex items-center justify-center z-50 border-2 border-gold-light/50"
      >
        <span className="text-2xl text-navy">{open ? "×" : "✦"}</span>
      </motion.button>
    </>
  );
}
