"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import plansData from "@/data/plans.json";

const addonDefs = [
  { id: "photographer", price: 150 },
  { id: "picnic", price: 99 },
  { id: "roomDecor", price: 149 },
  { id: "chef", price: 299 },
];

import QuoteForm from "./QuoteForm";

export default function QuoteBuilder() {
  const { locale, t } = useLocale();
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);

  const services = plansData.services;
  const activityPrice = selectedActivity
    ? services.find((s) => s.id === selectedActivity)?.price ?? 0
    : 0;
  const addonsTotal = addonDefs
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const total = activityPrice + addonsTotal;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  const activityLabel = selectedActivity
    ? (services.find((s) => s.id === selectedActivity)?.title as Record<string, string>)?.[locale]
    : undefined;

  return (
    <section className="py-20 px-4" id="devis">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy text-center mb-3">
            {t("quote.title")}
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
              <label className="block text-navy font-semibold text-sm mb-2">{t("quote.activity")}</label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full bg-surface border border-black/10 rounded-xl px-4 py-3 text-navy text-sm focus:ring-2 focus:ring-gold/40 outline-none"
              >
                <option value="">--</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {(s.title as Record<string, string>)[locale]} — ${s.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-navy font-semibold text-sm mb-2">{t("quote.guests")}</label>
              <input
                type="range"
                min={1}
                max={30}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full accent-gold"
              />
              <p className="text-navy/60 text-sm mt-1">
                {guests} {locale === "fr" ? "personnes" : "people"}
              </p>
            </div>

            <div>
              <label className="block text-navy font-semibold text-sm mb-3">{t("quote.addons")}</label>
              <div className="space-y-2">
                {addonDefs.map((addon) => {
                  const service = services.find((s) => s.id === addon.id);
                  if (!service) return null;
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedAddons.includes(addon.id)
                          ? "border-gold bg-gold/5"
                          : "border-black/10 bg-surface hover:border-gold/40"
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
                          {(service.title as Record<string, string>)[locale]}
                        </span>
                      </div>
                      <span className="text-navy/60 text-sm">${addon.price}</span>
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
            className="bg-surface rounded-3xl border border-black/5 shadow-sm p-6 h-fit"
          >
            <h3 className="font-serif text-xl font-bold text-navy mb-5">{t("quote.summary")}</h3>
            <div className="flex justify-between items-center mb-5 pb-5 border-b border-black/5">
              <span className="text-navy/70 text-sm">{t("quote.total")}</span>
              <span className="text-3xl font-serif font-bold text-navy">${total}</span>
            </div>
            <QuoteForm
              activity={activityLabel}
              addons={selectedAddons}
              guests={guests}
              total={total}
              compact
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
