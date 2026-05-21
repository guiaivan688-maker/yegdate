"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users, PartyPopper, Briefcase } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import WeatherWidget from "@/components/WeatherWidget";
import ActivityCard from "@/components/ActivityCard";
import QuoteBuilder from "@/components/QuoteBuilder";
import Testimonials from "@/components/Testimonials";
import plansData from "@/data/plans.json";
import { allActivities } from "@/lib/activities";

const categories = [
  { key: "couples", href: "/couples", image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80", Icon: Heart },
  { key: "famille", href: "/famille", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80", Icon: Users },
  { key: "amis", href: "/amis", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", Icon: PartyPopper },
  { key: "business", href: "/business", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", Icon: Briefcase },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
};

export default function Home() {
  const { locale, t } = useLocale();
  // Curated top picks: highest-rated across segments
  const featured = [...allActivities].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt="Edmonton River Valley"
            fill
            className="object-cover saturate-[0.9] contrast-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/20" />
        </div>

        <div className="absolute top-20 right-4 sm:right-8 z-10">
          <WeatherWidget />
        </div>

        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[22%] w-20 h-20 border border-gold/25 rounded-3xl hidden lg:block backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[28%] right-[32%] w-12 h-12 bg-gold/15 rounded-full hidden lg:block"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block w-14 h-1 gradient-gold rounded-full mb-6" />
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-cream leading-[1.05] mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-cream/80 text-lg sm:text-xl leading-relaxed mb-9 max-w-xl">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/weekend-match" className="gradient-gold text-navy font-bold px-8 py-4 rounded-full hover:opacity-90 transition-opacity text-sm sm:text-base">
                {t("hero.cta")}
              </Link>
              <Link href="/services" className="border-2 border-cream/30 text-cream font-semibold px-8 py-4 rounded-full hover:bg-cream/10 transition-colors text-sm sm:text-base">
                {t("hero.ctaServices")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{t("categories.title")}</h2>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={cat.href} className="group block">
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                    <Image
                      src={cat.image}
                      alt={t(`nav.${cat.key}`)}
                      fill
                      className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <cat.Icon className="w-8 h-8 text-gold mb-2" strokeWidth={1.5} />
                      <h3 className="font-serif text-cream text-2xl font-bold">{t(`nav.${cat.key}`)}</h3>
                      <p className="text-cream/70 text-sm mt-1">{t(`categories.${cat.key}Desc`)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured (curated) */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{t("sections.popular")}</h2>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/decouvrir" className="inline-block border-2 border-navy text-navy font-semibold px-8 py-3 rounded-full hover:bg-navy hover:text-cream transition-colors">
              {t("common.allActivities")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{t("sections.servicesTitle")}</h2>
            <p className="text-navy/60 text-lg max-w-2xl mx-auto">{t("sections.servicesSubtitle")}</p>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto mt-4" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plansData.services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-surface rounded-3xl shadow-sm hover:shadow-xl border border-black/5 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={(service.title as Record<string, string>)[locale]}
                    fill
                    className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-navy mb-2">
                    {(service.title as Record<string, string>)[locale]}
                  </h3>
                  <p className="text-navy/60 text-sm leading-relaxed mb-3 line-clamp-2">
                    {(service.description as Record<string, string>)[locale]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold">{t("common.from")} ${service.price}</span>
                    <Link href="/services" className="text-navy text-xs font-semibold hover:text-gold transition-colors">
                      {t("common.book")} →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{t("sections.galleryTitle")}</h2>
            <p className="text-navy/60 text-lg">{t("sections.gallerySubtitle")}</p>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto mt-4" />
          </motion.div>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {plansData.places.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="mb-4 break-inside-avoid group relative overflow-hidden rounded-3xl"
              >
                <div className={`relative ${i % 3 === 0 ? "h-72" : i % 3 === 1 ? "h-56" : "h-64"}`}>
                  <Image
                    src={place.image}
                    alt={(place.name as Record<string, string>)[locale]}
                    fill
                    className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-serif text-cream font-bold text-sm">{(place.name as Record<string, string>)[locale]}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <QuoteBuilder />
    </>
  );
}
