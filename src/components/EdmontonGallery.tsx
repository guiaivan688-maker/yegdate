"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

interface GalleryItem {
  src: string;
  title: { fr: string; en: string };
  caption: { fr: string; en: string };
  span?: "wide" | "tall";
}

// Vraies photos d'Edmonton — public art, parcs, lieux emblématiques.
const items: GalleryItem[] = [
  {
    src: "/images/edmonton/art-talus-dome.jpg",
    title: { fr: "Talus Dome", en: "Talus Dome" },
    caption: { fr: "L'œuvre d'art publique iconique de Whitemud Drive", en: "The iconic public artwork along Whitemud Drive" },
    span: "wide",
  },
  {
    src: "/images/edmonton/art-vaulted-willow.jpg",
    title: { fr: "Vaulted Willow", en: "Vaulted Willow" },
    caption: { fr: "L'arche multicolore du parc Borden", en: "The multicoloured arch at Borden Park" },
  },
  {
    src: "/images/edmonton/art-southgate-boots.jpg",
    title: { fr: "Big Boots", en: "Big Boots" },
    caption: { fr: "Les bottes géantes de Southgate", en: "The giant boots at Southgate" },
  },
  {
    src: "/images/edmonton/art-carbon-copy.jpg",
    title: { fr: "Carbon Copy", en: "Carbon Copy" },
    caption: { fr: "Voiture renversée — Brewery District", en: "Upside-down car — Brewery District" },
  },
  {
    src: "/images/edmonton/art-mosaic-park.jpg",
    title: { fr: "Mosaic Art", en: "Mosaic Art" },
    caption: { fr: "Sculpture mosaïque du centre-ville", en: "Downtown mosaic sculpture" },
    span: "tall",
  },
  {
    src: "/images/edmonton/famille-rundle-park.jpg",
    title: { fr: "Rundle Park", en: "Rundle Park" },
    caption: { fr: "Le grand parc nord-est d'Edmonton", en: "Edmonton's grand northeast park" },
  },
  {
    src: "/images/edmonton/events-freewill-shakespeare.jpg",
    title: { fr: "Freewill Shakespeare", en: "Freewill Shakespeare" },
    caption: { fr: "Festival d'été au parc Hawrelak", en: "Summer festival at Hawrelak Park" },
  },
  {
    src: "/images/edmonton/discover-pond-fall.jpg",
    title: { fr: "Automne edmontonien", en: "Edmonton autumn" },
    caption: { fr: "Couleurs flamboyantes en River Valley", en: "Fiery colours in the River Valley" },
  },
];

export default function EdmontonGallery() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
    <section className="py-16 sm:py-20 px-4 bg-warm-grey">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">
            {fr ? "Découvre Edmonton" : "Discover Edmonton"}
          </h2>
          <p className="text-navy/60 max-w-2xl mx-auto">
            {fr
              ? "Public art, parcs, festivals — les vraies pépites de la ville."
              : "Public art, parks, festivals — the city's real gems."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[200px]">
          {items.map((it, i) => (
            <motion.div
              key={it.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className={`relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow ${
                it.span === "wide" ? "sm:col-span-2" : it.span === "tall" ? "row-span-2" : ""
              }`}
            >
              <Image
                src={it.src}
                alt={it.title[locale]}
                fill
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                className="object-cover saturate-[0.95] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-cream">
                <h3 className="font-serif font-bold text-sm sm:text-base leading-tight">{it.title[locale]}</h3>
                <p className="text-cream/75 text-[10px] sm:text-xs leading-tight mt-0.5">{it.caption[locale]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
