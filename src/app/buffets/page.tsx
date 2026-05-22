"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import buffets from "@/data/buffets.json";

interface Restaurant {
  name: string;
  address: string;
  note: Record<string, string>;
  price: Record<string, string>;
}
interface BuffetCategory {
  category: string;
  icon: string;
  image: string;
  restaurants: Restaurant[];
}

export default function BuffetsPage() {
  const { locale, t } = useLocale();
  const data = buffets as BuffetCategory[];

  return (
    <>
      <section className="relative h-[42vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            alt="Buffets Edmonton"
            fill
            className="object-cover saturate-[0.9] contrast-[1.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3">{t("buffets.title")}</h1>
            <p className="text-cream/80 text-lg max-w-2xl">{t("buffets.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {data.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">{t(`buffets.${cat.category}`)}</h2>
                <span className="flex-1 h-px bg-black/10 ml-2" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {cat.restaurants.map((r, ri) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ri * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="bg-surface rounded-3xl border border-black/5 shadow-sm overflow-hidden group"
                  >
                    {ri === 0 && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={t(`buffets.${cat.category}`)}
                          fill
                          className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-serif text-lg font-bold text-navy leading-snug">{r.name}</h3>
                        <span className="text-gold font-bold text-sm whitespace-nowrap">{r.price[locale]}</span>
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-navy/90 text-cream rounded-full px-2.5 py-0.5 mb-2">
                        {cat.category === "western" && r.name.includes("Chateau") ? "Brunch" : "AYCE · À volonté"}
                      </span>
                      <p className="text-navy/60 text-sm mb-3">{r.note[locale]}</p>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(r.name + " " + r.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy/50 hover:text-gold text-xs flex items-center gap-1 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {r.address}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quel buffet pour quelle occasion */}
      <section className="py-16 px-4 bg-warm-grey">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy text-center mb-3">
            {locale === "fr" ? "Quel buffet pour quelle occasion ?" : "Which buffet for which occasion?"}
          </h2>
          <div className="w-16 h-1 gradient-gold rounded-full mx-auto mb-10" />
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { occ: { fr: "🎂 Anniversaire enfant", en: "🎂 Kid's birthday" }, reco: "Yang Ming · Buffet Royale" },
              { occ: { fr: "💑 Date night sushi", en: "💑 Sushi date night" }, reco: "Tatsu Sushi" },
              { occ: { fr: "🍖 Groupe d'amis carnivore", en: "🍖 Carnivore friend group" }, reco: "Pampa Brazilian" },
              { occ: { fr: "❄️ Hot Pot en hiver", en: "❄️ Hot Pot in winter" }, reco: "Chili Hot Pot" },
            ].map((item) => (
              <motion.div
                key={item.reco}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface rounded-2xl border border-black/5 shadow-sm p-5 flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-navy">{item.occ[locale]}</span>
                <span className="text-gold font-bold text-sm text-right">{item.reco}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
