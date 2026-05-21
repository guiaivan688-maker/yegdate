"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import PlanCard from "@/components/PlanCard";
import plansData from "@/data/plans.json";

interface SegmentPageProps {
  segment: string;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  heroImage: string;
}

export default function SegmentPage({ segment, title, subtitle, heroImage }: SegmentPageProps) {
  const { locale } = useLocale();
  const plans = plansData.plans.filter((p) => p.segments.includes(segment));

  return (
    <>
      <section className="relative h-[50vh] min-h-[300px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={title[locale]} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1
              className="text-4xl sm:text-5xl font-bold text-cream mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {title[locale]}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl">{subtitle[locale]}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
          {plans.length === 0 && (
            <p className="text-center text-navy/60 py-16 text-lg">
              {locale === "fr" ? "Aucune activité trouvée pour cette catégorie." : "No activities found for this category."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
