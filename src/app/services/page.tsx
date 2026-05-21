"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { CheckIcon } from "@heroicons/react/24/solid";
import plansData from "@/data/plans.json";
import QuoteBuilder from "@/components/QuoteBuilder";

export default function ServicesPage() {
  const { locale, t } = useLocale();

  return (
    <>
      <section className="relative h-[44vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80"
            alt="Services"
            fill
            className="object-cover saturate-[0.9] contrast-[1.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3">{t("sections.servicesTitle")}</h1>
            <p className="text-cream/80 text-lg max-w-xl">{t("sections.servicesSubtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plansData.services.map((service, i) => {
              const features = (service.features as Record<string, string[]>)[locale];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-3xl shadow-sm border border-black/5 overflow-hidden group hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={(service.title as Record<string, string>)[locale]}
                      fill
                      className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 glass rounded-full px-4 py-2">
                      <span className="text-navy font-bold text-lg">${service.price}</span>
                      <span className="text-navy/60 text-xs ml-1">{(service.unit as Record<string, string>)[locale]}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-navy mb-3">
                      {(service.title as Record<string, string>)[locale]}
                    </h3>
                    <p className="text-navy/60 text-sm leading-relaxed mb-5">
                      {(service.description as Record<string, string>)[locale]}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-navy/70">
                          <CheckIcon className="w-4 h-4 text-gold shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a href="#devis" className="block text-center w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                      {t("common.quote")}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <QuoteBuilder />
    </>
  );
}
