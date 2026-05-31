"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Heart } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

const stats = [
  { value: "40+", fr: "lieux référencés", en: "venues listed" },
  { value: "22+", fr: "plans Weekend Match", en: "Weekend Match plans" },
  { value: "4", fr: "segments", en: "segments" },
  { value: "100%", fr: "Edmonton", en: "Edmonton" },
];

const pillars = [
  { Icon: MapPin, titleFr: "100% Local", titleEn: "100% Local", fr: "Chaque lieu est vérifié par nous. Pas d'algorithme, pas de publicité. Que du vrai.", en: "Every venue is verified by us. No algorithm, no ads. Only the real deal." },
  { Icon: Clock, titleFr: "3 minutes, max", titleEn: "3 minutes, max", fr: "De la question à la réservation en moins de 3 minutes. C'est notre promesse.", en: "From question to booking in under 3 minutes. That's our promise." },
  { Icon: Heart, titleFr: "Pour tout le monde", titleEn: "For everyone", fr: "Couples, familles, amis, collègues. Edmonton a quelque chose pour chacun.", en: "Couples, families, friends, colleagues. Edmonton has something for everyone." },
];

export default function AboutPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
    <>
      <section className="grid lg:grid-cols-2">
        <div className="relative h-72 lg:h-auto min-h-[320px]">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" alt="Founders" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover saturate-[0.9]" priority />
        </div>
        <div className="gradient-navy text-cream p-10 sm:p-16 flex flex-col justify-center">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-6" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            {fr ? "Deux Edmontoniens qui en avaient marre de s'ennuyer." : "Two Edmontonians who were tired of being bored."}
          </h1>
          <p className="text-cream/80 leading-relaxed">
            {fr
              ? "On est Ivan et Karl. Comme 500 000 Edmontoniens, on s'est posé la question 100 fois : qu'est-ce qu'on fait ce week-end. Au lieu de continuer à scroller Reddit, on a construit Where To Go YEG — l'outil qu'on aurait voulu avoir."
              : "We're Ivan and Karl. Like 500,000 Edmontonians, we asked ourselves the same question 100 times: what do we do this weekend. Instead of scrolling Reddit, we built Where To Go YEG — the tool we wished we had."}
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-surface rounded-3xl border border-black/5 shadow-sm p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                <p.Icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-2">{fr ? p.titleFr : p.titleEn}</h3>
              <p className="text-navy/60 text-sm leading-relaxed">{fr ? p.fr : p.en}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-navy-dark text-cream rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-5">
            {fr ? "De Where To Go YEG à Private Haven" : "From Where To Go YEG to Private Haven"}
          </h2>
          <p className="text-cream/75 leading-relaxed max-w-2xl mx-auto">
            {fr
              ? "Where To Go YEG est la première étape d'une vision plus grande. Nous construisons aujourd'hui la plateforme d'activités la plus complète d'Edmonton. Demain, nous ouvrirons Private Haven — un hôtel-boutique romantique où chaque séjour est une expérience complète, planifiée et mémorable. Chaque client Where To Go YEG nous rapproche de ce rêve."
              : "Where To Go YEG is the first step of a bigger vision. Today we're building Edmonton's most complete activity platform. Tomorrow, we'll open Private Haven — a romantic boutique hotel where every stay is a complete, planned and memorable experience. Every Where To Go YEG client brings us closer to that dream."}
          </p>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-gold mb-1">{s.value}</p>
              <p className="text-navy/60 text-sm">{fr ? s.fr : s.en}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
