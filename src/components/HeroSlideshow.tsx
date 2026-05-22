"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import WeatherWidget from "./WeatherWidget";

const slides = [
  "https://images.unsplash.com/photo-1571816119607-57e48af1caa9?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80",
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80",
];

export default function HeroSlideshow() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index]}
            alt="Edmonton"
            fill
            priority={index === 0}
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
            href="/weekend-match"
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
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-gold" : "w-2 bg-cream/50 hover:bg-cream/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
