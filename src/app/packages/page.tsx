"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import { CheckIcon } from "@heroicons/react/24/solid";
import plansData from "@/data/plans.json";

export default function PackagesPage() {
  const { locale } = useLocale();

  return (
    <>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1920&q=80"
            alt="Packages"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1
              className="text-4xl sm:text-5xl font-bold text-cream mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {t("packages", "title", locale)}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl">
              {t("packages", "subtitle", locale)}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plansData.packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 gradient-navy text-cream rounded-full px-4 py-2 text-sm font-bold">
                    {pkg.price}$
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-bold text-navy mb-2"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {pkg.title[locale]}
                  </h3>
                  <p className="text-navy/60 text-sm leading-relaxed mb-4">
                    {pkg.description[locale]}
                  </p>
                  <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                    {t("packages", "includes", locale)}
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {pkg.includes[locale].map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-navy/70">
                        <CheckIcon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                    {t("packages", "bookThis", locale)}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
