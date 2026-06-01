"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { useContextPicker, PERSONA_META, type Persona } from "@/lib/context-picker";

const PERSONAS: Persona[] = ["couple", "famille", "amis", "solo", "business"];

export default function ContextPicker() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const { persona, guests, setPersona, setGuests } = useContextPicker();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click + Esc
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const meta = PERSONA_META[persona];
  const guestLabel = persona === "solo"
    ? (fr ? "Solo" : "Solo")
    : fr
      ? `${guests} pers`
      : `${guests} ppl`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={fr ? "Changer le contexte" : "Change context"}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 hover:bg-gold/25 border border-gold/30 text-navy text-xs font-semibold transition-colors"
      >
        <span aria-hidden>{meta.emoji}</span>
        <span className="hidden sm:inline">{fr ? meta.fr : meta.en}</span>
        <span className="text-navy/60 tabular-nums">· {guestLabel}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 bg-surface border border-black/10 rounded-2xl shadow-xl p-4 z-50"
            role="dialog"
            aria-label={fr ? "Sélecteur de contexte" : "Context picker"}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-navy/70 text-[10px] uppercase tracking-widest font-bold">
                {fr ? "Tu sors avec qui ?" : "Who's coming?"}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={fr ? "Fermer" : "Close"}
                className="text-navy/40 hover:text-navy"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {PERSONAS.map((p) => {
                const m = PERSONA_META[p];
                const active = persona === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPersona(p)}
                    className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 border transition-colors ${
                      active
                        ? "border-gold bg-gold/10"
                        : "border-black/10 bg-cream hover:border-gold/40"
                    }`}
                  >
                    <span className="text-xl leading-none" aria-hidden>{m.emoji}</span>
                    <span className="text-[10px] font-semibold text-navy text-center leading-tight">
                      {fr ? m.fr : m.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {persona !== "solo" && (
              <div className="mb-3">
                <span className="text-navy/70 text-[10px] uppercase tracking-widest font-bold block mb-2">
                  {persona === "couple" ? (fr ? "Combien de couples ?" : "How many couples?") : fr ? "Combien êtes-vous ?" : "How many?"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(guests - 1)}
                    aria-label={fr ? "Diminuer" : "Decrease"}
                    className="w-9 h-9 rounded-full bg-navy/10 hover:bg-navy hover:text-cream text-navy transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <span className="flex-1 text-center font-serif text-2xl font-bold text-navy tabular-nums">
                    {guests}
                  </span>
                  <button
                    onClick={() => setGuests(guests + 1)}
                    aria-label={fr ? "Augmenter" : "Increase"}
                    className="w-9 h-9 rounded-full bg-navy/10 hover:bg-navy hover:text-cream text-navy transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}

            <a
              href={meta.href}
              className="block text-center w-full gradient-gold text-navy font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              {fr ? `Voir les activités ${meta.fr.toLowerCase()}` : `See ${meta.en.toLowerCase()} activities`}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
