"use client";

import { ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import SegmentPage from "@/components/SegmentPage";

export default function FamillePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
    <>
      <SegmentPage
        segment="famille"
        title={{ fr: "Sorties en Famille", en: "Family Outings" }}
        subtitle={{
          fr: "Les vraies institutions familiales d'Edmonton, pour petits et grands",
          en: "Edmonton's real family institutions, for kids and grown-ups",
        }}
        heroImage="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
      />

      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <a
            href="https://exploreedmonton.com/things-to-do/family"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 bg-surface border border-black/5 shadow-sm rounded-3xl px-6 py-5 hover:shadow-md hover:border-gold/30 transition-all group"
          >
            <div>
              <p className="font-serif text-lg font-bold text-navy">
                {fr ? "Encore plus d'idées famille" : "Even more family ideas"}
              </p>
              <p className="text-navy/60 text-sm">
                {fr
                  ? "Consultez le guide officiel d'Explore Edmonton pour les familles."
                  : "Browse Explore Edmonton's official family guide."}
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 gradient-gold text-navy font-bold px-5 py-2.5 rounded-full group-hover:opacity-90 transition-opacity">
              Explore Edmonton <ExternalLink className="w-4 h-4" strokeWidth={2} />
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
