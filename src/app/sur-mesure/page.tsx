"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import ExperienceBuilder from "@/components/ExperienceBuilder";

export default function SurMesurePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
    <section className="py-16 sm:py-20 px-4 bg-warm-grey min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-3">
            {fr ? "Créez votre expérience sur-mesure" : "Build your custom experience"}
          </h1>
          <p className="text-navy/60 text-lg max-w-2xl mx-auto">
            {fr ? "Composez votre journée bloc par bloc et obtenez un devis instantané." : "Compose your day block by block and get an instant quote."}
          </p>
        </motion.div>
        <ExperienceBuilder />
      </div>
    </section>
  );
}
