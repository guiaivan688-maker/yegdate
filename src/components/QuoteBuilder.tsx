"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import plansData from "@/data/plans.json";

const addons = [
  { id: "photographer", price: 150 },
  { id: "picnic", price: 200 },
  { id: "roomDecor", price: 250 },
  { id: "eventPlanner", price: 500 },
];

export default function QuoteBuilder() {
  const { locale } = useLocale();
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);

  const services = plansData.services;

  const activityPrice = selectedActivity
    ? (services.find((s) => s.id === selectedActivity)?.price ?? 0)
    : 0;

  const addonsTotal = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const total = activityPrice + addonsTotal;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy text-center mb-3">
            {t("quote", "title", locale)}
          </h2>
          <div className="w-16 h-1 gradient-gold rounded-full mx-auto mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <label className="block text-navy font-semibold text-sm mb-2">
                {t("quote", "activity", locale)}
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-navy text-sm focus:ring-2 focus:ring-gold/30 outline-none"
              >
                <option value="">--</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title[locale]} — {s.price}$
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-navy font-semibold text-sm mb-2">
                {t("quote", "guests", locale)}
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full accent-gold"
              />
              <p className="text-navy/60 text-sm mt-1">{guests} {locale === "fr" ? "personnes" : "people"}</p>
            </div>

            <div>
              <label className="block text-navy font-semibold text-sm mb-3">
                {t("quote", "addons", locale)}
              </label>
              <div className="space-y-2">
                {addons.map((addon) => {
                  const service = services.find((s) => s.id === addon.id);
                  if (!service) return null;
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedAddons.includes(addon.id)
                          ? "border-gold bg-gold/5"
                          : "border-gray-200 bg-white hover:border-gold/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="accent-gold w-4 h-4"
                        />
                        <span className="text-navy text-sm font-medium">
                          {service.title[locale]}
                        </span>
                      </div>
                      <span className="text-navy/60 text-sm">{addon.price}$</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24"
          >
            <h3 className="font-serif text-xl font-bold text-navy mb-6">
              {t("quote", "summary", locale)}
            </h3>

            <div className="space-y-3 mb-6">
              {selectedActivity && (
                <div className="flex justify-between text-sm">
                  <span className="text-navy/70">
                    {services.find((s) => s.id === selectedActivity)?.title[locale]}
                  </span>
                  <span className="text-navy font-semibold">{activityPrice}$</span>
                </div>
              )}
              {selectedAddons.map((id) => {
                const addon = addons.find((a) => a.id === id);
                const service = services.find((s) => s.id === id);
                if (!addon || !service) return null;
                return (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-navy/70">{service.title[locale]}</span>
                    <span className="text-navy font-semibold">{addon.price}$</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-sm">
                <span className="text-navy/70">
                  {guests} {locale === "fr" ? "personnes" : "people"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-navy font-semibold">
                  {t("quote", "total", locale)}
                </span>
                <span className="text-2xl font-serif font-bold text-navy">{total}$</span>
              </div>
            </div>

            <button className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
              {t("quote", "submit", locale)}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
