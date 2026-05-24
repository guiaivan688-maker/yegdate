"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users, PartyPopper, User, Briefcase, MapPin, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import HeroSlideshow from "@/components/HeroSlideshow";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import SplitSection from "@/components/SplitSection";
import edmonton from "@/data/edmonton-data.json";

const howItWorks = [
  {
    eyebrow: { fr: "Étape 1", en: "Step 1" },
    title: { fr: "Dis-nous ce que tu veux", en: "Tell us what you want" },
    text: { fr: "Budget, humeur, groupe, saison. En 4 questions, on cerne exactement ton envie du moment.", en: "Budget, mood, group, season. In 4 questions, we pinpoint exactly what you're after." },
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
    reverse: false,
  },
  {
    eyebrow: { fr: "Étape 2", en: "Step 2" },
    title: { fr: "On te propose un plan", en: "We suggest a plan" },
    text: { fr: "Des plans complets avec horaires, adresses réelles et prix par étape. Que des lieux vérifiés à Edmonton.", en: "Complete plans with times, real addresses and price per step. Only verified Edmonton spots." },
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
    reverse: true,
  },
  {
    eyebrow: { fr: "Étape 3", en: "Step 3" },
    title: { fr: "Tu réserves en 1 clic", en: "You book in 1 click" },
    text: { fr: "Photographe, déco, transport — on s'occupe de toute la logistique du souvenir. Tu n'as qu'à profiter.", en: "Photographer, decor, transport — we handle all the logistics. You just enjoy." },
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=900&q=80",
    reverse: false,
  },
];

const quickAccess = [
  { key: "couples", href: "/couples", Icon: Heart },
  { key: "famille", href: "/famille", Icon: Users },
  { key: "amis", href: "/amis", Icon: PartyPopper },
  { key: "solo", href: "/compositeur", Icon: User },
  { key: "business", href: "/business", Icon: Briefcase },
];

interface EventItem {
  name: string;
  location: string;
  dateLabel: Record<string, string>;
  price: Record<string, string>;
  image: string;
}

const weekendEvents = (edmonton.events as EventItem[]).slice(0, 4);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
};

export default function Home() {
  const { locale, t } = useLocale();

  return (
    <>
      {/* SECTION 1 — Hero slideshow */}
      <HeroSlideshow />

      {/* SECTION 2 — Quick access bar */}
      <section className="px-4 -mt-10 relative z-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-4">
          {quickAccess.map((q, i) => (
            <motion.div key={q.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link
                href={q.href}
                className="group flex flex-col items-center gap-3 bg-surface hover:bg-navy rounded-3xl border border-black/5 shadow-sm hover:shadow-xl p-6 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                  <q.Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                </div>
                <span className="font-serif text-lg font-bold text-navy group-hover:text-cream transition-colors">{t(`nav.${q.key}`)}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — This weekend in Edmonton */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-2">{t("home.weekendTitle")}</h2>
              <p className="text-navy/60">{t("home.weekendSubtitle")}</p>
            </div>
            <Link href="/evenements" className="hidden sm:inline-flex items-center gap-1 text-gold font-semibold whitespace-nowrap hover:underline">
              {t("home.allEvents")}
            </Link>
          </motion.div>

          <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 snap-x">
            {weekendEvents.map((ev, i) => (
              <motion.div
                key={ev.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="snap-start shrink-0 w-[80vw] sm:w-auto bg-surface rounded-3xl border border-black/5 shadow-sm hover:shadow-xl overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image src={ev.image} alt={ev.name} fill className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 80vw, 25vw" />
                  <span className="absolute top-3 left-3 bg-navy text-cream text-xs font-bold rounded-lg px-2.5 py-1.5 leading-tight text-center">
                    {ev.dateLabel[locale]}
                  </span>
                  <span className="absolute top-3 right-3 glass text-navy text-xs font-bold rounded-full px-2.5 py-1">
                    {ev.price[locale]}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-navy mb-1 leading-snug">{ev.name}</h3>
                  <p className="text-navy/50 text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} /> {ev.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link href="/evenements" className="sm:hidden inline-flex items-center gap-1 text-gold font-semibold mt-4">
            {t("home.allEvents")}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">
              {locale === "fr" ? "Comment ça marche" : "How it works"}
            </h2>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto" />
          </motion.div>
          <div className="space-y-16">
            {howItWorks.map((s) => (
              <SplitSection
                key={s.title.en}
                eyebrow={s.eyebrow[locale]}
                title={s.title[locale]}
                text={s.text[locale]}
                imageSrc={s.image}
                imageAlt={s.title[locale]}
                reverse={s.reverse}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Custom experience teaser */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block w-14 h-1 gradient-gold rounded-full mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-4">{t("home.customTitle")}</h2>
            <p className="text-navy/60 text-lg mb-8 max-w-2xl mx-auto">{t("home.customText")}</p>
            <Link href="/sur-mesure" className="inline-flex items-center gap-2 gradient-gold text-navy font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity">
              {t("home.customCta")} <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — Testimonials */}
      <Testimonials />

      {/* SECTION 6 — Newsletter */}
      <Newsletter />
    </>
  );
}
