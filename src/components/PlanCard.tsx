"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { StarIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface Plan {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  image: string;
  location: string;
  price: { fr: string; en: string };
  services: string[];
  rating: number;
}

const serviceLabels: Record<string, { fr: string; en: string; icon: string }> = {
  photographer: { fr: "Photographe", en: "Photographer", icon: "📷" },
  picnic: { fr: "Pique-nique", en: "Picnic", icon: "🧺" },
  roomDecor: { fr: "Décoration", en: "Decoration", icon: "🌹" },
  eventPlanner: { fr: "Événement", en: "Event", icon: "🎪" },
};

export default function PlanCard({ plan, index = 0 }: { plan: Plan; index?: number }) {
  const { locale } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-shadow duration-300 group"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={plan.image}
          alt={plan.title[locale]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1">
          <StarIcon className="w-3.5 h-3.5 text-gold" />
          <span className="text-navy text-xs font-bold">{plan.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-bold text-navy mb-1">
          {plan.title[locale]}
        </h3>
        <div className="flex items-center gap-1 text-navy/50 text-xs mb-3">
          <MapPinIcon className="w-3.5 h-3.5" />
          <span>{plan.location}</span>
        </div>
        <p className="text-navy/60 text-sm leading-relaxed mb-4 line-clamp-2">
          {plan.description[locale]}
        </p>

        {plan.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {plan.services.map((s) => {
              const label = serviceLabels[s];
              if (!label) return null;
              return (
                <span
                  key={s}
                  className="text-xs bg-gold/10 text-gold-light border border-gold/20 rounded-full px-2.5 py-0.5 font-medium"
                >
                  {label.icon} {label[locale]}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-navy font-bold text-sm">{plan.price[locale]}</span>
          <button className="gradient-gold text-navy text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
            {locale === "fr" ? "Voir plus" : "View more"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
