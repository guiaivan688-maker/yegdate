"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import WeatherWidget from "@/components/WeatherWidget";
import PlanCard from "@/components/PlanCard";
import QuoteBuilder from "@/components/QuoteBuilder";
import plansData from "@/data/plans.json";

const categories = [
  {
    key: "couples",
    href: "/couples",
    image: "https://images.unsplash.com/photo-1522264373430-3c41337d38d0?w=800&q=80",
    icon: "💑",
  },
  {
    key: "famille",
    href: "/famille",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    key: "amis",
    href: "/amis",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    icon: "🎉",
  },
  {
    key: "business",
    href: "/business",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    icon: "💼",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
};

export default function Home() {
  const { locale } = useLocale();
  const featured = plansData.plans.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt="Edmonton skyline"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
        </div>

        <div className="absolute top-20 right-4 sm:right-8 z-10">
          <WeatherWidget />
        </div>

        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-gold/20 rounded-2xl hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-gold/10 rounded-full hidden lg:block"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {t("hero", "title", locale)}
            </h1>
            <p className="text-cream/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              {t("hero", "subtitle", locale)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/weekend-match"
                className="gradient-gold text-navy font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                {t("hero", "cta", locale)}
              </Link>
              <Link
                href="/services"
                className="border-2 border-cream/30 text-cream font-semibold px-8 py-3.5 rounded-full hover:bg-cream/10 transition-colors text-sm sm:text-base"
              >
                {t("hero", "ctaServices", locale)}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Bento */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-navy mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {t("categories", "title", locale)}
            </h2>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={cat.href} className="group block">
                  <div className="relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <Image
                      src={cat.image}
                      alt={t("categories", cat.key, locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-3xl mb-2 block">{cat.icon}</span>
                      <h3
                        className="text-cream text-xl font-bold"
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                      >
                        {t("categories", cat.key, locale)}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-navy mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {locale === "fr" ? "Activités Populaires" : "Popular Activities"}
            </h2>
            <div className="w-16 h-1 gradient-gold rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/decouvrir"
              className="inline-block border-2 border-navy text-navy font-semibold px-8 py-3 rounded-full hover:bg-navy hover:text-cream transition-colors"
            >
              {locale === "fr" ? "Voir toutes les activités" : "View all activities"}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-navy mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {t("services", "title", locale)}
            </h2>
            <p className="text-navy/60 text-lg max-w-2xl mx-auto">
              {t("services", "subtitle", locale)}
            </p>
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
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3
                    className="text-lg font-bold text-navy mb-2"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {service.title[locale]}
                  </h3>
                  <p className="text-navy/60 text-sm leading-relaxed mb-3 line-clamp-2">
                    {service.description[locale]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold">
                      {t("services", "from", locale)} {service.price}$
                    </span>
                    <Link
                      href="/services"
                      className="text-navy text-xs font-semibold hover:text-gold transition-colors"
                    >
                      {t("services", "bookNow", locale)} →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-navy mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {t("gallery", "title", locale)}
            </h2>
            <p className="text-navy/60 text-lg">
              {t("gallery", "subtitle", locale)}
            </p>
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
                className="mb-4 break-inside-avoid group relative overflow-hidden rounded-2xl"
              >
                <div
                  className={`relative ${
                    i % 3 === 0 ? "h-72" : i % 3 === 1 ? "h-56" : "h-64"
                  }`}
                >
                  <Image
                    src={place.image}
                    alt={place.name[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p
                      className="text-cream font-bold text-sm"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {place.name[locale]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Builder */}
      <QuoteBuilder />
    </>
  );
}
