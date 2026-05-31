"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import WeatherWidget from "./WeatherWidget";

interface Slide {
  src: string;
  alt: { fr: string; en: string };
}

// Photos locales d'Edmonton — toutes prises ici, pas de stock générique.
const slides: Slide[] = [
  {
    src: "/images/edmonton/couples-walterdale-sunset.jpg",
    alt: { fr: "Couple au coucher de soleil devant le Walterdale Bridge, Edmonton", en: "Couple at sunset by the Walterdale Bridge, Edmonton" },
  },
  {
    src: "/images/edmonton/amis-picnic-walterdale.jpg",
    alt: { fr: "Amis en pique-nique avec la skyline d'Edmonton en arrière-plan", en: "Friends having a picnic with the Edmonton skyline behind" },
  },
  {
    src: "/images/edmonton/famille-hawrelak-aerial.jpg",
    alt: { fr: "Vue aérienne du parc Hawrelak et de la skyline d'Edmonton", en: "Aerial view of Hawrelak Park and Edmonton skyline" },
  },
  {
    src: "/images/edmonton/nightout-whyte-ave.jpg",
    alt: { fr: "Whyte Avenue illuminée la nuit, Edmonton", en: "Whyte Avenue lit up at night, Edmonton" },
  },
  {
    src: "/images/edmonton/lifestyle-walterdale-picnic.jpg",
    alt: { fr: "Pique-nique solo face au Walterdale Bridge, Edmonton", en: "Solo picnic facing the Walterdale Bridge, Edmonton" },
  },
];

export default function HeroSlideshow() {
  const { locale, t } = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative h-[100svh] min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt[locale]}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover saturate-[0.9] contrast-[1.05]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0" style={{ backgroundColor: "rgba(26,54,93,0.6)" }} />

      <div className="absolute top-20 right-4 sm:right-8 z-20">
        <WeatherWidget />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
          <span className="inline-block w-14 h-1 gradient-gold rounded-full mb-7" />
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream leading-[1.08] mb-6">
            {t("hero.bigTitle")}
          </h1>
          <p className="text-cream/85 text-lg sm:text-xl leading-relaxed mb-9 max-w-2xl mx-auto">
            {t("hero.bigSubtitle")}
          </p>
          <Link
            href="/compositeur"
            className="inline-block gradient-gold text-navy font-bold px-10 py-4 rounded-full hover:opacity-90 transition-opacity text-base"
          >
            {t("hero.bigCta")}
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`${locale === "fr" ? "Slide" : "Slide"} ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-gold" : "w-2 bg-cream/50 hover:bg-cream/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
