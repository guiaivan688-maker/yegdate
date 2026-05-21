"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { StarIcon, MapPinIcon, ClockIcon, UserGroupIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";
import { getActivityBySlug, getSimilarActivities } from "@/lib/activities";
import ActivityCard from "./ActivityCard";
import QuoteForm from "./QuoteForm";
import LoveRooms from "./LoveRooms";

export default function ActivityDetail({ slug }: { slug: string }) {
  const { locale, t } = useLocale();
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const similar = getSimilarActivities(activity, 3);
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(activity.mapsQuery)}&output=embed`;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[380px] flex items-end overflow-hidden">
        <Image src={activity.image} alt={activity.title[locale]} fill priority className="object-cover saturate-[0.9] contrast-[1.08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <Link href={`/${activity.segment}`} className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream text-sm mb-4 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> {t(`nav.${activity.segment}`)}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-3 max-w-3xl">
            {activity.title[locale]}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 text-cream/80 text-sm">
            <span className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-gold" /> {activity.rating.toFixed(1)}</span>
            <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-gold" /> {activity.location}</span>
            <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4 text-gold" /> {activity.duration[locale]}</span>
            <span className="flex items-center gap-1"><UserGroupIcon className="w-4 h-4 text-gold" /> {activity.groupSize[locale]}</span>
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Left: description + gallery + map */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              {activity.longDescription[locale].split("\n\n").map((para, i) => (
                <p key={i} className="text-navy/75 leading-relaxed mb-4">{para}</p>
              ))}
            </div>

            {/* Gallery */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">{locale === "fr" ? "Galerie" : "Gallery"}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activity.gallery.map((img, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 sm:col-span-1 h-48" : "h-40"}`}>
                    <Image src={img} alt={`${activity.title[locale]} ${i + 1}`} fill className="object-cover saturate-[0.92] hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-2">{t("common.location")}</h2>
              <p className="text-navy/60 text-sm mb-4 flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-gold" /> {activity.address}
              </p>
              <div className="rounded-3xl overflow-hidden border border-black/5 shadow-sm">
                <iframe
                  title={activity.location}
                  src={mapsSrc}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right: sticky booking card */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-surface rounded-3xl border border-black/5 shadow-sm p-6">
                <p className="text-navy/50 text-xs uppercase tracking-wider mb-1">{t("common.from")}</p>
                <p className="font-serif text-3xl font-bold text-navy mb-1">{activity.priceRange[locale]}</p>

                <div className="grid grid-cols-2 gap-3 my-5 text-sm">
                  <div>
                    <p className="text-navy/45 text-xs">{t("common.duration")}</p>
                    <p className="text-navy font-medium">{activity.duration[locale]}</p>
                  </div>
                  <div>
                    <p className="text-navy/45 text-xs">{t("common.groupSize")}</p>
                    <p className="text-navy font-medium">{activity.groupSize[locale]}</p>
                  </div>
                  {activity.ageRange && (
                    <div>
                      <p className="text-navy/45 text-xs">{locale === "fr" ? "Âge" : "Age"}</p>
                      <p className="text-navy font-medium">{activity.ageRange[locale]}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-navy/45 text-xs">{t("common.season")}</p>
                    <p className="text-navy font-medium">{activity.season.map((s) => t(`seasons.${s}`)).join(", ")}</p>
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{t("common.includes")}</h3>
                <ul className="space-y-2 mb-2">
                  {activity.includes[locale].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-navy/70">
                      <CheckIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface rounded-3xl border border-black/5 shadow-sm p-6">
                <h3 className="font-serif text-lg font-bold text-navy mb-4">
                  {activity.cta === "quote" ? t("common.quote") : t("common.book")}
                </h3>
                <QuoteForm activity={activity.title[locale]} compact />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Love Rooms funnel on couples activities */}
      {activity.segment === "couples" && <LoveRooms />}

      {/* Similar */}
      {similar.length > 0 && (
        <section className="py-16 px-4 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-navy mb-8 text-center">{t("common.similar")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similar.map((a, i) => (
                <ActivityCard key={a.id} activity={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
