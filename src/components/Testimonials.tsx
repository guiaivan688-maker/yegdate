"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";

const testimonials = [
  {
    name: "Sarah",
    tag: { fr: "Strathcona", en: "Strathcona" },
    text: {
      fr: "On ne savait jamais quoi faire le samedi. Weekend Match nous a redonné envie de sortir.",
      en: "We never knew what to do on Saturdays. Weekend Match made us want to go out again.",
    },
    initials: "S",
  },
  {
    name: "Marc & Julie",
    tag: { fr: "St. Albert", en: "St. Albert" },
    text: {
      fr: "Notre anniversaire de mariage organisé en 3 clics. Le Streetcar était magique.",
      en: "Our wedding anniversary planned in 3 clicks. The Streetcar was magical.",
    },
    initials: "MJ",
  },
  {
    name: "Fatima",
    tag: { fr: "Oliver", en: "Oliver" },
    text: {
      fr: "J'ai organisé l'EVJF de ma meilleure amie sans stress. Tout était parfait.",
      en: "I organized my best friend's bachelorette stress-free. Everything was perfect.",
    },
    initials: "F",
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
