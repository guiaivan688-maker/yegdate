"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

type Bilingual = { fr: string; en: string };

// Reused from the vetted homepage hero set (loads reliably). Swap freely.
const BG = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80";

const chapters: { era: Bilingual; title: string | Bilingual; text: Bilingual }[] = [
  {
    era: { fr: "Depuis des millénaires", en: "For millennia" },
    title: "amiskwacîwâskahikan",
    text: {
      fr: "« La maison des collines aux castors » en cri. La région est le territoire ancestral des peuples Cri, Pieds-Noirs et Métis, bien avant la ville.",
      en: "\"Beaver Hills House\" in Cree. The region is the ancestral land of the Cree, Blackfoot and Métis peoples, long before the city.",
    },
  },
  {
    era: { fr: "1795", en: "1795" },
    title: { fr: "Fort Edmonton", en: "Fort Edmonton" },
    text: {
      fr: "Un poste de traite des fourrures s'installe sur les rives de la rivière North Saskatchewan. Edmonton naît du commerce et de la rivière.",
      en: "A fur-trading post rises on the banks of the North Saskatchewan River. Edmonton is born of trade and the river.",
    },
  },
  {
    era: { fr: "Aujourd'hui", en: "Today" },
    title: { fr: "La vallée fluviale", en: "The river valley" },
    text: {
      fr: "La ville abrite l'un des plus grands réseaux de parcs urbains d'Amérique du Nord — un ruban de verdure plusieurs fois plus vaste que Central Park.",
      en: "The city holds one of North America's largest stretches of urban parkland — a green ribbon several times the size of Central Park.",
    },
  },
  {
    era: { fr: "Toute l'année", en: "Year-round" },
    title: { fr: "La ville des festivals", en: "The festival city" },
    text: {
      fr: "Surnommée « Canada's Festival City », Edmonton vibre au rythme de dizaines de festivals — du Fringe au Folk Fest, été comme hiver.",
      en: "Nicknamed \"Canada's Festival City,\" Edmonton pulses with dozens of festivals — from the Fringe to the Folk Fest, summer and winter alike.",
    },
  },
];

export default function EdmontonStory() {
  const { locale } = useLocale();
  const tr = (v: string | Bilingual) => (typeof v === "string" ? v : v[locale]);

  return (
    <section className="relative bg-navy-dark text-cream py-20 sm:py-24 px-4 overflow-hidden">
      <Image src={BG} alt="" fill className="object-cover saturate-[0.9]" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/92 via-navy-dark/82 to-navy-dark/95" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            {locale === "fr" ? "Edmonton, une histoire qui se raconte" : "Edmonton, a story worth telling"}
          </h2>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            {locale === "fr"
              ? "Bien avant les festivals et les gratte-ciels, il y avait la rivière, les plaines et les peuples qui y vivaient. Voici, en quelques chapitres, l'âme de la ville."
              : "Long before the festivals and the skyline, there was the river, the plains and the peoples who lived here. Here, in a few chapters, is the soul of the city."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {chapters.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-serif text-gold text-sm font-bold tracking-wide whitespace-nowrap">{tr(c.era)}</span>
                <span className="h-px flex-1 bg-cream/15" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">{tr(c.title)}</h3>
              <p className="text-cream/70 text-sm leading-relaxed">{tr(c.text)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
