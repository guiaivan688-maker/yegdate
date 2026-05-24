"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getIdeaPage, plansForIdea } from "@/lib/ideas";

export default function IdeasList({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const page = getIdeaPage(slug);
  if (!page) return null;
  const plans = plansForIdea(page);

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{page.h1[locale]}</h1>
        <p className="text-navy/60 text-lg mb-6 max-w-2xl">{page.description[locale]}</p>
        <Link
          href="/compositeur"
          className="inline-flex items-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mb-12"
        >
          {locale === "fr" ? "Compose ta soirée" : "Compose your night"} <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>

        {plans.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                href={`/compositeur?plan=${plan.id}`}
                className="group bg-surface rounded-3xl border border-black/5 shadow-sm hover:shadow-xl overflow-hidden transition-shadow"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image src={plan.image} alt={plan.title[locale]} fill className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 100vw, 33vw" />
                  <span className="absolute top-3 right-3 glass text-navy text-xs font-bold rounded-full px-2.5 py-1">${plan.total}</span>
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-lg font-bold text-navy mb-1 leading-snug">{plan.title[locale]}</h2>
                  <p className="text-navy/50 text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                    {plan.steps[0]?.place}{plan.steps.length > 1 ? ` +${plan.steps.length - 1}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-navy/50">{locale === "fr" ? "Bientôt des idées ici." : "Ideas coming soon."}</p>
        )}
      </div>
    </div>
  );
}
