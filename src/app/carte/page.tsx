"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-warm-grey">
      <span className="text-navy/40">…</span>
    </div>
  ),
});

const legend = [
  { key: "couples", color: "#c4a456" },
  { key: "famille", color: "#2a4a7f" },
  { key: "amis", color: "#9333ea" },
  { key: "business", color: "#0f2341" },
];

export default function CartePage() {
  const { locale, t } = useLocale();

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-3">
            {locale === "fr" ? "La carte d'Edmonton" : "The Edmonton map"}
          </h1>
          <p className="text-navy/60 text-lg">
            {locale === "fr" ? "Toutes nos activités, sur une seule carte." : "All our activities, on a single map."}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {legend.map((l) => (
            <span key={l.key} className="flex items-center gap-2 text-sm text-navy/70">
              <span className="w-3 h-3 rounded-full" style={{ background: l.color }} /> {t(`nav.${l.key}`)}
            </span>
          ))}
        </div>

        <div className="h-[70vh] min-h-[420px] rounded-3xl overflow-hidden border border-black/5 shadow-sm">
          <MapView />
        </div>
      </div>
    </section>
  );
}
