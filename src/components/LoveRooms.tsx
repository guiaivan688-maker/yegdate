"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

export default function LoveRooms() {
  const { t } = useLocale();
  return (
    <section className="px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-navy px-8 py-12 sm:px-14 sm:py-16 text-center"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-gold/10 blur-2xl" />
          <span className="relative inline-block text-3xl mb-4">🥂</span>
          <h2 className="relative font-serif text-3xl sm:text-4xl font-bold text-cream mb-4">
            {t("loveRooms.title")}
          </h2>
          <p className="relative text-cream/75 text-lg max-w-2xl mx-auto mb-8">
            {t("loveRooms.text")}
          </p>
          <a
            href="#"
            className="relative inline-block gradient-gold text-navy font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity"
          >
            {t("loveRooms.cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
