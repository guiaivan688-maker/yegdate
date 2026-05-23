"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { allActivities } from "@/lib/activities";
import edmonton from "@/data/edmonton-data.json";

interface Result {
  kind: "activity" | "event" | "buffet";
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  tags: string[];
}

export default function RecherchePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [q, setQ] = useState("");

  const index: Result[] = useMemo(() => {
    const acts: Result[] = allActivities.map((a) => ({
      kind: "activity",
      title: a.title[locale],
      subtitle: a.location,
      href: `/activite/${a.slug}`,
      image: a.image,
      tags: [...a.tags, a.segment],
    }));
    const evs: Result[] = (edmonton.events as { name: string; location: string; tags: string[] }[]).map((e) => ({
      kind: "event",
      title: e.name,
      subtitle: e.location,
      href: "/evenements",
      tags: e.tags,
    }));
    const bufs: Result[] = (edmonton.restaurants as { name: string; location: string; tags: string[] }[]).map((r) => ({
      kind: "buffet",
      title: r.name,
      subtitle: r.location,
      href: "/buffets",
      tags: r.tags,
    }));
    return [...acts, ...evs, ...bufs];
  }, [locale]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index.filter((r) =>
      r.title.toLowerCase().includes(term) ||
      r.subtitle.toLowerCase().includes(term) ||
      r.tags.some((tg) => tg.toLowerCase().includes(term))
    );
  }, [q, index]);

  const kindLabel: Record<string, string> = {
    activity: fr ? "Activité" : "Activity",
    event: fr ? "Événement" : "Event",
    buffet: fr ? "Buffet" : "Buffet",
  };

  return (
    <section className="py-16 sm:py-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-6 text-center">
          {fr ? "Rechercher" : "Search"}
        </h1>
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" strokeWidth={1.5} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={fr ? "Activité, événement, lieu, tag…" : "Activity, event, place, tag…"}
            className="w-full bg-surface border border-black/10 rounded-2xl pl-12 pr-4 py-4 text-navy outline-none focus:ring-2 focus:ring-gold/40 shadow-sm"
          />
        </div>

        {q.trim() && (
          <p className="text-navy/50 text-sm mb-4">
            {results.length} {fr ? "résultat(s)" : "result(s)"}
          </p>
        )}

        <div className="space-y-3">
          {results.map((r, i) => (
            <Link
              key={`${r.kind}-${i}`}
              href={r.href}
              className="flex items-center gap-4 bg-surface border border-black/5 rounded-2xl p-3 hover:shadow-md hover:border-gold/30 transition-all"
            >
              {r.image ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image src={r.image} alt={r.title} fill className="object-cover" sizes="64px" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 text-gold text-xs font-bold">
                  {kindLabel[r.kind].slice(0, 3)}
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">{kindLabel[r.kind]}</span>
                <p className="font-serif font-bold text-navy truncate">{r.title}</p>
                <p className="text-navy/50 text-xs flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {r.subtitle}
                </p>
              </div>
            </Link>
          ))}
          {q.trim() && results.length === 0 && (
            <p className="text-center text-navy/50 py-10">{fr ? "Aucun résultat." : "No results."}</p>
          )}
          {!q.trim() && (
            <p className="text-center text-navy/40 py-10">
              {fr ? "Tapez pour rechercher parmi 40 activités, 35 événements et nos buffets." : "Type to search 40 activities, 35 events and our buffets."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
