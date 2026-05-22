"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { CheckIcon } from "@heroicons/react/24/solid";
import plansData from "@/data/plans.json";

export default function PackagesPage() {
  const { locale, t } = useLocale();

  return (
    <>
      <section className="relative h-[44vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1920&q=80"
            alt="Packages"
            fill
            className="object-cover saturate-[0.9] contrast-[1.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3">{t("packages.title")}</h1>
            <p className="text-cream/80 text-lg max-w-xl">{t("packages.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <a href="/weekend-match" className="block mb-10 rounded-2xl bg-navy text-cream px-6 py-4 text-center hover:bg-navy-light transition-colors">
            {locale === "fr"
              ? "Pas sûr de ton choix ? Essaie Weekend Match — on te recommande le forfait parfait en 4 questions →"
              : "Not sure? Try Weekend Match — we recommend the perfect package in 4 questions →"}
          </a>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plansData.packages.map((pkg, i) => {
              const includes = (pkg.includes as Record<string, string[]>)[locale];
              const quoteOnly = (pkg as { quoteOnly?: boolean }).quoteOnly === true;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-surface rounded-3xl shadow-sm border border-black/5 overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={(pkg.title as Record<string, string>)[locale]}
                      fill
                      className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 right-4 gradient-navy text-cream rounded-full px-4 py-2 text-sm font-bold">
                      {quoteOnly ? (locale === "fr" ? "Sur devis" : "On quote") : `$${pkg.price}`}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-navy mb-2">
                      {(pkg.title as Record<string, string>)[locale]}
                    </h3>
                    <p className="text-navy/60 text-sm leading-relaxed mb-4">
                      {(pkg.description as Record<string, string>)[locale]}
                    </p>
                    <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                      {t("packages.includes")}
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-navy/70">
                          <CheckIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href="/services#devis" className="block text-center w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                      {quoteOnly ? t("common.quote") : t("packages.bookThis")}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
