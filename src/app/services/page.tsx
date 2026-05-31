"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Flower2, UtensilsCrossed, ChefHat, Car, Video, Plus, type LucideIcon } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import plansData from "@/data/plans.json";
import QuoteBuilder from "@/components/QuoteBuilder";

const iconMap: Record<string, LucideIcon> = {
  Camera, Flower2, UtensilsCrossed, ChefHat, Car, Video,
};

export default function ServicesPage() {
  const { locale, t } = useLocale();

  return (
    <>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80" alt="Premium services" fill sizes="100vw" className="object-cover saturate-[0.9] contrast-[1.08]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3">
              {locale === "fr" ? "Nos services à la carte" : "Our à la carte services"}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl">
              {locale === "fr" ? "Ajoutez ces services à n'importe quelle sortie." : "Add these services to any outing."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plansData.services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Camera;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-surface rounded-3xl shadow-sm border border-black/5 p-7 flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy mb-2">{(service.title as Record<string, string>)[locale]}</h3>
                <p className="text-navy/60 text-sm leading-relaxed mb-5 flex-1">{(service.description as Record<string, string>)[locale]}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-bold">{t("common.from")} ${service.price}<span className="text-navy/40 text-xs font-normal"> {(service.unit as Record<string, string>)[locale]}</span></span>
                  <a href="#devis" className="inline-flex items-center gap-1 bg-navy text-cream text-xs font-semibold px-4 py-2 rounded-full hover:bg-navy-light transition-colors">
                    <Plus className="w-3.5 h-3.5" strokeWidth={2} /> {locale === "fr" ? "Ajouter à mon plan" : "Add to my plan"}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <QuoteBuilder />
    </>
  );
}
