"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";

const testimonials = [
  {
    name: "Sarah & Marc",
    tag: { fr: "Couple · Anniversaire", en: "Couple · Anniversary" },
    text: {
      fr: "Le pique-nique chic à Louise McKinney était magique. Tout était prêt, on n'a eu qu'à profiter. Les photos sont superbes !",
      en: "The luxury picnic at Louise McKinney was magical. Everything was ready, we just had to enjoy. The photos are gorgeous!",
    },
    initials: "SM",
  },
  {
    name: "Jessica L.",
    tag: { fr: "EVJF · 12 amies", en: "Bachelorette · 12 friends" },
    text: {
      fr: "Lancer de hache + tufting pour mon EVJF, organisé en un message. Le groupe a adoré, zéro stress côté logistique.",
      en: "Axe throwing + tufting for my bachelorette, booked in one message. The group loved it, zero logistics stress.",
    },
    initials: "JL",
  },
  {
    name: "Northgate Tech Inc.",
    tag: { fr: "Affaires · Team-building", en: "Business · Team-building" },
    text: {
      fr: "Soirée corporate au TELUS World of Science pour 80 employés. Coordination impeccable, nos équipes en parlent encore.",
      en: "Corporate evening at TELUS World of Science for 80 staff. Flawless coordination — our teams still talk about it.",
    },
    initials: "NT",
  },
];

export default function Testimonials() {
  const { locale, t } = useLocale();

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">
            {t("sections.testimonialsTitle")}
          </h2>
          <p className="text-navy/60 text-lg">{t("sections.testimonialsSubtitle")}</p>
          <div className="w-16 h-1 gradient-gold rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface rounded-3xl border border-black/5 shadow-sm p-7"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} className="w-4 h-4 text-gold" />
                ))}
              </div>
              <p className="text-navy/75 text-sm leading-relaxed mb-6 italic">
                &ldquo;{item.text[locale]}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-navy flex items-center justify-center text-gold font-serif font-bold text-sm">
                  {item.initials}
                </div>
                <div>
                  <p className="text-navy font-semibold text-sm">{item.name}</p>
                  <p className="text-navy/50 text-xs">{item.tag[locale]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
