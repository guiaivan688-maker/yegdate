"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import guides from "@/data/guides.json";

interface Guide {
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  image: string;
  dateLabel: Record<string, string>;
}

export default function GuidesPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const list = guides as Guide[];

  return (
    <section className="py-16 sm:py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-3">{fr ? "Guides Edmonton" : "Edmonton Guides"}</h1>
          <p className="text-navy/60 text-lg max-w-2xl mx-auto">
            {fr ? "Nos guides curés pour profiter d'Edmonton — par occasion, saison et budget." : "Our curated guides to make the most of Edmonton — by occasion, season and budget."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((g, i) => (
            <motion.div key={g.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}>
              <Link href={`/guides/${g.slug}`} className="block bg-surface rounded-3xl border border-black/5 shadow-sm hover:shadow-xl overflow-hidden h-full group">
                <div className="relative h-52 overflow-hidden">
                  <Image src={g.image} alt={g.title[locale]} fill className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 100vw, 33vw" />
                </div>
                <div className="p-6">
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">{g.dateLabel[locale]}</span>
                  <h2 className="font-serif text-xl font-bold text-navy mt-1 mb-2 leading-snug">{g.title[locale]}</h2>
                  <p className="text-navy/60 text-sm leading-relaxed mb-3 line-clamp-3">{g.excerpt[locale]}</p>
                  <span className="inline-flex items-center gap-1 text-gold font-semibold text-sm">{fr ? "Lire le guide" : "Read guide"} <ArrowRight className="w-4 h-4" strokeWidth={2} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
