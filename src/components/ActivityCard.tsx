"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarIcon, MapPinIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";
import type { Activity } from "@/lib/activities";

const serviceBadges: Record<string, { fr: string; en: string; icon: string }> = {
  photographer: { fr: "Photographe", en: "Photographer", icon: "📷" },
  picnic: { fr: "Pique-nique", en: "Picnic", icon: "🧺" },
  roomDecor: { fr: "Décoration", en: "Decor", icon: "🌹" },
  eventPlanner: { fr: "Événement", en: "Event", icon: "🎪" },
};

export default function ActivityCard({ activity, index = 0 }: { activity: Activity; index?: number }) {
  const { locale, t } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link
        href={`/activite/${activity.id}`}
        className="block bg-surface rounded-3xl shadow-sm hover:shadow-xl border border-black/5 overflow-hidden transition-shadow duration-300 h-full"
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={activity.image}
            alt={activity.title[locale]}
            fill
            className="object-cover saturate-[0.92] contrast-[1.05] group-hover:scale-[1.04] transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5 text-gold" />
            <span className="text-navy text-xs font-bold">{activity.rating.toFixed(1)}</span>
          </div>
          {activity.cta === "quote" && (
            <span className="absolute top-3 left-3 bg-navy/90 text-cream text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 py-1">
              B2B
            </span>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-serif text-xl font-bold text-navy mb-1 leading-snug">
            {activity.title[locale]}
          </h3>
          <div className="flex items-center gap-1 text-navy/45 text-xs mb-3">
            <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
          <p className="text-navy/60 text-sm leading-relaxed mb-4 line-clamp-2">
            {activity.description[locale]}
          </p>

          <div className="flex items-center gap-3 text-navy/50 text-xs mb-4">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" /> {activity.duration[locale]}
            </span>
            <span className="flex items-center gap-1">
              <UserGroupIcon className="w-3.5 h-3.5" /> {activity.groupSize[locale]}
            </span>
          </div>

          {activity.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activity.services.slice(0, 2).map((s) => {
                const badge = serviceBadges[s];
                if (!badge) return null;
                return (
                  <span
                    key={s}
                    className="text-[11px] bg-gold/10 text-[#9a7e34] border border-gold/25 rounded-full px-2.5 py-0.5 font-medium"
                  >
                    {badge.icon} {badge[locale]}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-navy font-bold text-sm">{activity.priceRange[locale]}</span>
            <span className="gradient-gold text-navy text-xs font-bold px-4 py-2 rounded-full">
              {t("common.viewMore")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
