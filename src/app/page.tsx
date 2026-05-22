"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users, PartyPopper, Briefcase, MapPin, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import HeroSlideshow from "@/components/HeroSlideshow";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import edmonton from "@/data/edmonton-data.json";

const quickAccess = [
  { key: "couples", href: "/couples", Icon: Heart },
  { key: "famille", href: "/famille", Icon: Users },
  { key: "amis", href: "/amis", Icon: PartyPopper },
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
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Link href="/decouvrir" className="hidden sm:inline-flex items-center gap-1 text-gold font-semibold whitespace-nowrap hover:underline">
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
          <Link href="/decouvrir" className="sm:hidden inline-flex items-center gap-1 text-gold font-semibold mt-4">
            {t("home.allEvents")}
          </Link>
        </div>
      </section>

      {/* SECTION 4 — Custom experience teaser */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block w-14 h-1 gradient-gold rounded-full mb-6" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-4">{t("home.customTitle")}</h2>
            <p className="text-navy/60 text-lg mb-8 max-w-2xl mx-auto">{t("home.customText")}</p>
            <Link href="/services#devis" className="inline-flex items-center gap-2 gradient-gold text-navy font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity">
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
