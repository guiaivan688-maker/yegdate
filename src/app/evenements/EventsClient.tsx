"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Ticket } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import type { EventItem } from "@/lib/cityEvents";

const filters = [
  { key: "all", match: () => true },
  { key: "free", match: (e: EventItem) => /gratuit|free/i.test(e.price.fr) },
  { key: "festivals", match: (e: EventItem) => e.tags.includes("festival") },
  { key: "summer", match: (e: EventItem) => e.tags.includes("été") },
  { key: "winter", match: (e: EventItem) => e.tags.includes("hiver") },
] as const;

export default function EventsClient({ events }: { events: EventItem[] }) {
  const { locale, t } = useLocale();
  const [filter, setFilter] = useState<string>("all");

  const active = filters.find((f) => f.key === filter)!;
  const list = events.filter(active.match);

  return (
    <>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=80" alt="Events" fill className="object-cover saturate-[0.9] contrast-[1.08]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3">{t("events.title")}</h1>
            <p className="text-cream/80 text-lg max-w-xl">{t("events.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-cream/90 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.key ? "gradient-navy text-cream" : "bg-surface text-navy/70 hover:text-navy border border-black/5"
              }`}
            >
              {t(`events.${f.key}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((ev, i) => (
            <motion.div
              key={`${ev.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              whileHover={{ y: -6 }}
              className="bg-surface rounded-3xl border border-black/5 shadow-sm hover:shadow-xl overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={ev.image} alt={ev.name} fill className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 100vw, 33vw" />
                <span className="absolute top-3 left-3 bg-navy text-cream text-xs font-bold rounded-lg px-2.5 py-1.5 text-center">{ev.dateLabel[locale]}</span>
                <span className="absolute top-3 right-3 glass text-navy text-xs font-bold rounded-full px-2.5 py-1">{ev.price[locale]}</span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-navy mb-2 leading-snug">{ev.name}</h3>
                <div className="space-y-1.5 mb-4 text-xs text-navy/55">
                  <p className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 shrink-0 text-gold" strokeWidth={1.5} /> {ev.dates[locale]}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 text-gold" strokeWidth={1.5} /> {ev.location}</p>
                  <p className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 shrink-0 text-gold" strokeWidth={1.5} /> {t("events.tickets")} : {ev.price[locale]}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ev.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] bg-gold/10 text-[#9a7e34] border border-gold/25 rounded-full px-2 py-0.5 capitalize">{tag}</span>
                  ))}
                </div>
                <a
                  href={ev.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full gradient-gold text-navy text-sm font-bold py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  {t("events.book")}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
