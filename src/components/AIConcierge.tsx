"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import plansData from "@/data/plans.json";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function generateResponse(input: string, locale: "fr" | "en"): string {
  const lower = input.toLowerCase();
  const plans = plansData.plans;

  const budgetMatch = lower.match(/(\d+)\s*\$/);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

  let filtered = plans;

  if (lower.includes("couple") || lower.includes("romantique") || lower.includes("romantic") || lower.includes("date")) {
    filtered = filtered.filter((p) => p.segments.includes("couple"));
  } else if (lower.includes("famille") || lower.includes("family") || lower.includes("enfant") || lower.includes("kid")) {
    filtered = filtered.filter((p) => p.segments.includes("famille"));
  } else if (lower.includes("ami") || lower.includes("friend")) {
    filtered = filtered.filter((p) => p.segments.includes("amis"));
  } else if (lower.includes("business") || lower.includes("affaire") || lower.includes("corporate")) {
    filtered = filtered.filter((p) => p.segments.includes("business"));
  }

  if (budget !== null) {
    if (budget < 50) filtered = filtered.filter((p) => p.budget === "low");
    else if (budget < 150) filtered = filtered.filter((p) => p.budget === "low" || p.budget === "medium");
  }

  if (lower.includes("hiver") || lower.includes("winter")) {
    filtered = filtered.filter((p) => p.seasons.includes("winter"));
  } else if (lower.includes("été") || lower.includes("summer")) {
    filtered = filtered.filter((p) => p.seasons.includes("summer"));
  } else if (lower.includes("automne") || lower.includes("fall")) {
    filtered = filtered.filter((p) => p.seasons.includes("fall"));
  } else if (lower.includes("printemps") || lower.includes("spring")) {
    filtered = filtered.filter((p) => p.seasons.includes("spring"));
  }

  if (filtered.length === 0) filtered = plans.slice(0, 3);

  const top = filtered.slice(0, 3);
  const suggestions = top
    .map(
      (p, i) =>
        `${i + 1}. **${p.title[locale]}** — ${p.price[locale]}\n   📍 ${p.location}\n   ${p.description[locale]}`
    )
    .join("\n\n");

  const intro =
    locale === "fr"
      ? "Voici mes recommandations pour vous :"
      : "Here are my recommendations for you:";

  const outro =
    locale === "fr"
      ? "\n\nVoulez-vous plus de détails sur l'une de ces activités, ou souhaitez-vous que j'ajuste les critères ?"
      : "\n\nWould you like more details on any of these activities, or should I adjust the criteria?";

  return `${intro}\n\n${suggestions}${outro}`;
}

export default function AIConcierge() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("ai", "greeting", locale) }]);
    }
  }, [open, messages.length, locale]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const response = generateResponse(input.trim(), locale);
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: response }]);
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
            className="fixed bottom-24 right-4 sm:right-6 w-[340px] sm:w-[380px] h-[500px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gold/20"
          >
            <div className="gradient-navy px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-cream font-serif font-bold text-lg">
                  {t("ai", "title", locale)}
                </h3>
                <p className="text-cream/50 text-xs">AI-powered</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-cream/60 hover:text-cream">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-navy text-cream rounded-br-md"
                        : "bg-white text-navy border border-gray-100 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("ai", "placeholder", locale)}
                  className="flex-1 bg-cream/50 rounded-xl px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center hover:opacity-90 transition-opacity"
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
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full gradient-gold shadow-lg flex items-center justify-center z-50 border-2 border-gold-light/50"
      >
        <span className="text-2xl">{open ? "×" : "✦"}</span>
      </motion.button>
    </>
  );
}
