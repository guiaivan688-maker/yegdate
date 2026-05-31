"use client";

import { ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export default function FamilleMoreLink() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  return (
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
                ? "Consulte le guide officiel d'Explore Edmonton pour les familles."
                : "Browse Explore Edmonton's official family guide."}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 gradient-gold text-navy font-bold px-5 py-2.5 rounded-full group-hover:opacity-90 transition-opacity">
            Explore Edmonton <ExternalLink className="w-4 h-4" strokeWidth={2} />
          </span>
        </a>
      </div>
    </section>
  );
}
