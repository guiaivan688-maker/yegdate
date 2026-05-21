"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import { CheckIcon } from "@heroicons/react/24/solid";
import plansData from "@/data/plans.json";

export default function ServicesPage() {
  const { locale } = useLocale();

  return (
    <>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80"
            alt="Services"
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
              {t("services", "title", locale)}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl">
              {t("services", "subtitle", locale)}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plansData.services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 right-4 glass rounded-full px-4 py-2">
                    <span className="text-navy font-bold text-lg">
                      {service.price}$
                    </span>
                    <span className="text-navy/60 text-xs ml-1">
                      {service.unit[locale]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-2xl font-bold text-navy mb-3"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {service.title[locale]}
                  </h3>
                  <p className="text-navy/60 text-sm leading-relaxed mb-5">
                    {service.description[locale]}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features[locale].map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-navy/70">
                        <CheckIcon className="w-4 h-4 text-gold flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                    {t("services", "getQuote", locale)}
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
