import type { Metadata } from "next";
import Link from "next/link";
import { ideaPages } from "@/lib/ideas";

export const metadata: Metadata = {
  title: "Idées de sorties à Edmonton | Where To Go YEG",
  description: "Toutes nos idées de sorties à Edmonton par occasion et par budget : couple, famille, amis, solo, affaires. Compose ensuite ta soirée sur mesure.",
  alternates: { canonical: "/idees" },
};

export default function IdeasIndexPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">Idées de sorties à Edmonton</h1>
        <p className="text-navy/60 text-lg mb-10 max-w-2xl">Par occasion et par budget — clique pour explorer, puis compose ta soirée sur mesure.</p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {ideaPages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/idees/${p.slug}`}
                className="block bg-surface rounded-2xl border border-black/5 px-5 py-4 text-navy font-medium hover:shadow-md hover:text-gold transition-all"
              >
                {p.h1.fr}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
