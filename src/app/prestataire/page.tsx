"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Plus, Inbox } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { allActivities } from "@/lib/activities";

const CLAIMS_KEY = "yegdate-presta-claims";
const PRICES_KEY = "yegdate-presta-prices";

const demoRequests = [
  { id: "r1", who: "Marc L.", whenFr: "Ven. 20h · 2 pers.", whenEn: "Fri 8pm · 2 guests" },
  { id: "r2", who: "Sofia R.", whenFr: "Sam. 18h30 · 4 pers.", whenEn: "Sat 6:30pm · 4 guests" },
  { id: "r3", who: "Équipe Nexa", whenFr: "Jeu. 17h · 12 pers.", whenEn: "Thu 5pm · 12 guests" },
];

export default function PrestatairePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [claims, setClaims] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      setClaims(JSON.parse(localStorage.getItem(CLAIMS_KEY) || "[]") as string[]);
      setPrices(JSON.parse(localStorage.getItem(PRICES_KEY) || "{}") as Record<string, number>);
    } catch { /* no-op */ }
  }, []);

  function persistClaims(next: string[]) {
    setClaims(next);
    try { localStorage.setItem(CLAIMS_KEY, JSON.stringify(next)); } catch { /* no-op */ }
  }
  function persistPrices(next: Record<string, number>) {
    setPrices(next);
    try { localStorage.setItem(PRICES_KEY, JSON.stringify(next)); } catch { /* no-op */ }
  }

  const claimed = allActivities.filter((a) => claims.includes(a.id));
  const q = query.trim().toLowerCase();
  const claimable = allActivities.filter(
    (a) => !claims.includes(a.id) && (q === "" || a.title[locale].toLowerCase().includes(q) || a.location.toLowerCase().includes(q))
  );

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gold/10 border border-gold/30 rounded-2xl px-4 py-3 mb-8 text-sm text-navy/70">
          🧪 {fr
            ? "Prototype — espace prestataire (données locales sur cet appareil, sans compte ni paiement). La vraie version arrive avec le backend."
            : "Prototype — provider space (local data on this device, no account or payment yet). The real version ships with the backend."}
        </div>

        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{fr ? "Espace prestataire" : "Provider space"}</h1>
        <p className="text-navy/60 text-lg mb-12 max-w-2xl">{fr ? "Réclame ta fiche existante et gère tes offres — pas besoin de repartir de zéro." : "Claim your existing listing and manage your offers — no need to start from scratch."}</p>

        <section className="mb-14">
          <h2 className="font-serif text-2xl font-bold text-navy mb-5">{fr ? "Mon espace" : "My space"}</h2>
          {claimed.length === 0 ? (
            <p className="text-navy/50 bg-surface border border-black/5 rounded-2xl px-5 py-6">{fr ? "Tu n'as pas encore réclamé de fiche. Choisis ton établissement ci-dessous 👇" : "You haven't claimed a listing yet. Pick your business below 👇"}</p>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {claimed.map((a) => (
                  <div key={a.id} className="flex gap-4 bg-surface border border-black/5 rounded-2xl p-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image src={a.image} alt={a.title[locale]} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy truncate">{a.title[locale]}</h3>
                      <p className="text-navy/45 text-xs flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {a.location}</p>
                      <label className="text-xs text-navy/60 flex items-center gap-1.5">
                        {fr ? "Prix dès" : "Price from"}
                        <span className="text-navy/50">$</span>
                        <input
                          type="number"
                          min={0}
                          value={prices[a.id] ?? a.priceFrom}
                          onChange={(e) => persistPrices({ ...prices, [a.id]: Number(e.target.value) })}
                          className="w-20 border border-black/10 rounded-lg px-2 py-1 text-navy"
                        />
                      </label>
                    </div>
                    <button onClick={() => persistClaims(claims.filter((c) => c !== a.id))} className="text-navy/40 hover:text-red-500 text-xs self-start transition-colors">
                      {fr ? "Retirer" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-navy rounded-2xl p-5 text-cream h-fit">
                <p className="flex items-center gap-2 font-semibold mb-4"><Inbox className="w-4 h-4 text-gold" strokeWidth={1.75} /> {fr ? "Demandes reçues" : "Incoming requests"}</p>
                <div className="space-y-3">
                  {demoRequests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-2 border-b border-cream/10 pb-2 last:border-0">
                      <div>
                        <p className="text-sm text-cream">{r.who}</p>
                        <p className="text-cream/50 text-xs">{fr ? r.whenFr : r.whenEn}</p>
                      </div>
                      <span className="text-gold text-xs font-semibold">{fr ? "Confirmer" : "Confirm"}</span>
                    </div>
                  ))}
                </div>
                <p className="text-cream/40 text-[11px] mt-4">{fr ? "Exemples — connectés au backend en v3.1" : "Examples — wired to the backend in v3.1"}</p>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-navy mb-2">{fr ? "Réclame ta fiche" : "Claim your listing"}</h2>
          <p className="text-navy/55 mb-5">{fr ? "Ces établissements sont déjà sur YEG Date. Trouve le tien et réclame-le." : "These businesses are already on YEG Date. Find yours and claim it."}</p>
          <div className="relative mb-6 max-w-md">
            <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={fr ? "Cherche ton établissement…" : "Search your business…"}
              className="w-full border border-black/10 rounded-full pl-10 pr-4 py-2.5 text-navy"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {claimable.slice(0, 12).map((a) => (
              <div key={a.id} className="bg-surface border border-black/5 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative h-32">
                  <Image src={a.image} alt={a.title[locale]} fill className="object-cover saturate-[0.92]" sizes="(max-width:640px) 100vw, 33vw" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-navy text-sm leading-snug mb-1">{a.title[locale]}</h3>
                  <p className="text-navy/45 text-xs flex items-center gap-1 mb-4"><MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {a.location}</p>
                  <button
                    onClick={() => { if (!claims.includes(a.id)) persistClaims([...claims, a.id]); }}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 gradient-gold text-navy font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2} /> {fr ? "C'est mon établissement" : "This is my business"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {claimable.length === 0 && <p className="text-navy/50">{fr ? "Aucun résultat." : "No results."}</p>}
        </section>
      </div>
    </div>
  );
}
