"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import guides from "@/data/guides.json";
import { getActivityBySlug } from "@/lib/activities";
import ActivityCard from "./ActivityCard";

interface Section { h: Record<string, string>; p: Record<string, string>; }
interface Guide {
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  image: string;
  dateLabel: Record<string, string>;
  intro: Record<string, string>;
  sections: Section[];
  related: string[];
}

export default function GuideArticle({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const guide = (guides as Guide[]).find((g) => g.slug === slug);
  if (!guide) notFound();

  const related = guide.related.map((s) => getActivityBySlug(s)).filter(Boolean);

  return (
    <>
      <section className="relative h-[52vh] min-h-[340px] flex items-end overflow-hidden">
        <Image src={guide.image} alt={guide.title[locale]} fill priority className="object-cover saturate-[0.9] contrast-[1.08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/10" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <Link href="/guides" className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> {fr ? "Tous les guides" : "All guides"}
          </Link>
          <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">{guide.dateLabel[locale]}</p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-3xl sm:text-5xl font-bold text-cream leading-tight">
            {guide.title[locale]}
          </motion.h1>
        </div>
      </section>

      <article className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-navy/80 text-lg leading-relaxed mb-10 font-serif italic">{guide.intro[locale]}</p>
          <div className="space-y-10">
            {guide.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-serif text-2xl font-bold text-navy mb-3">{s.h[locale]}</h2>
                <p className="text-navy/70 leading-relaxed">{s.p[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 px-4 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-navy mb-8 text-center">{fr ? "Réservez ces activités" : "Book these activities"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((a, i) => a && <ActivityCard key={a.id} activity={a} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
