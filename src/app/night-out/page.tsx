"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music, Wine, Pizza, PartyPopper, Ticket, Flame, Sparkles, ArrowDown, Users } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

type PriceUnit = "pers" | "groupe";

interface NightPackage {
  id: string;
  category: "clubs" | "bars" | "snacks" | "events";
  title: Record<string, string>;
  price: string;
  priceUnit: PriceUnit;
  groupSize: string;
  image: string;
  vibes: string[];
  includes: Record<string, string[]>;
}

const categories = [
  { key: "all", Icon: Sparkles },
  { key: "clubs", Icon: Music },
  { key: "bars", Icon: Wine },
  { key: "snacks", Icon: Pizza },
  { key: "events", Icon: PartyPopper },
] as const;

const catLabels: Record<string, Record<string, string>> = {
  all: { fr: "Toutes les soirées", en: "All nights" },
  clubs: { fr: "Boîtes / Clubs", en: "Clubs" },
  bars: { fr: "Bars & Lounges", en: "Bars & Lounges" },
  snacks: { fr: "Food de nuit", en: "Late-night food" },
  events: { fr: "Fêtes privées", en: "Private parties" },
};

const priceUnitLabel: Record<PriceUnit, Record<string, string>> = {
  pers:   { fr: "/ pers",   en: "/ pers" },
  groupe: { fr: "/ groupe", en: "/ group" },
};

const packages: NightPackage[] = [
  { id: "vip-club-hopping", category: "clubs", price: "$120", priceUnit: "pers", groupSize: "4-8 pers", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&q=80",
    title: { fr: "VIP Club Hopping", en: "VIP Club Hopping" },
    vibes: ["Hip-Hop", "Top 40"],
    includes: { fr: ["Coupe-file 3 clubs du Ice District", "Table réservée", "1 consommation par arrêt", "Hôte de soirée"], en: ["Skip-the-line at 3 Ice District clubs", "Reserved table", "1 drink per stop", "Night host"] } },
  { id: "ice-district-bottle", category: "clubs", price: "$300", priceUnit: "groupe", groupSize: "6-10 pers", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
    title: { fr: "Soirée Bottle Service", en: "Bottle Service Night" },
    vibes: ["EDM", "House"],
    includes: { fr: ["Table VIP au club", "Bouteille premium incluse", "Coupe-file garanti", "Espace réservé pour le groupe"], en: ["VIP club table", "Premium bottle included", "Guaranteed skip-the-line", "Reserved group area"] } },
  { id: "whyte-ave-crawl", category: "bars", price: "$75", priceUnit: "pers", groupSize: "4-12 pers", image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=900&q=80",
    title: { fr: "Whyte Ave Bar Crawl", en: "Whyte Ave Bar Crawl" },
    vibes: ["Indie", "Local"],
    includes: { fr: ["4 bars branchés de Whyte Avenue", "Cocktail de bienvenue", "Guide local", "Bracelet de groupe"], en: ["4 trendy Whyte Avenue bars", "Welcome cocktail", "Local guide", "Group wristband"] } },
  { id: "rooftop-cocktails", category: "bars", price: "$90", priceUnit: "groupe", groupSize: "2-6 pers", image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900&q=80",
    title: { fr: "Cocktails Rooftop", en: "Rooftop Cocktails" },
    vibes: ["Lounge", "Chill"],
    includes: { fr: ["Table sur un rooftop du centre-ville", "2 cocktails signature", "Planche à partager", "Vue sur la skyline"], en: ["Downtown rooftop table", "2 signature cocktails", "Sharing board", "Skyline view"] } },
  { id: "midnight-munchies", category: "snacks", price: "$45", priceUnit: "pers", groupSize: "2-4 pers", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80",
    title: { fr: "Midnight Munchies", en: "Midnight Munchies" },
    vibes: ["Post-club", "Late-night"],
    includes: { fr: ["Crédit dans 2 spots de food de nuit", "Pizza ou poutine au choix", "Livraison au bar", "Parfait après le club"], en: ["Credit at 2 late-night food spots", "Pizza or poutine of choice", "Delivery to your bar", "Perfect post-club"] } },
  { id: "late-night-eats-tour", category: "snacks", price: "$60", priceUnit: "pers", groupSize: "6-12 pers", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80",
    title: { fr: "Tour Food de Nuit", en: "Late-Night Food Tour" },
    vibes: ["Groupes", "Local"],
    includes: { fr: ["3 arrêts gourmands après minuit", "Spécialités locales", "Guide food de nuit", "Idéal grand groupe"], en: ["3 after-midnight food stops", "Local specialties", "Late-night food guide", "Great for big groups"] } },
  { id: "ultimate-birthday", category: "events", price: "$349", priceUnit: "groupe", groupSize: "6-15 pers", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80",
    title: { fr: "The Ultimate Birthday Bash", en: "The Ultimate Birthday Bash" },
    vibes: ["Anniversaire", "Premium"],
    includes: { fr: ["Section réservée en club ou bar", "Bouteille + étincelles", "Coupe-file pour le groupe", "Décoration & photographe option"], en: ["Reserved club or bar section", "Bottle + sparklers", "Group skip-the-line", "Decor & photographer option"] } },
  { id: "bachelor-bachelorette", category: "events", price: "$199", priceUnit: "groupe", groupSize: "6-12 pers", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",
    title: { fr: "EVG / EVJF Night", en: "Stag / Bachelorette Night" },
    vibes: ["Afro", "Latino", "Hip-Hop"],
    includes: { fr: ["Parcours bars + club organisé", "Coupe-file & table", "Jeux et surprises", "Transport entre les lieux"], en: ["Organized bar + club route", "Skip-the-line & table", "Games and surprises", "Transport between venues"] } },
];

const steps = [
  { Icon: Flame,  fr: ["Choisis ton vibe", "Club, bar, food de nuit ou fête privée — sélectionne ton package."], en: ["Pick your vibe", "Club, bar, late-night food or private party — pick your package."] },
  { Icon: Ticket, fr: ["Reçois tes accès VIP", "Coupe-file, tables et consos confirmés instantanément."],          en: ["Get your VIP access", "Skip-the-line, tables and drinks confirmed instantly."] },
  { Icon: Music,  fr: ["Profite sans faire la queue", "On gère la logistique — tu profites de la nuit à Edmonton."], en: ["Enjoy, no queues", "We handle the logistics — you enjoy the Edmonton night."] },
];

export default function NightOutPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [cat, setCat] = useState<string>("all");
  const list = cat === "all" ? packages : packages.filter((p) => p.category === cat);

  const HOW_STEPS: { n: string; fr: string; en: string }[] = [
    { n: "1", fr: "Choisis le type de soirée qui te va",               en: "Pick the night type that suits you" },
    { n: "2", fr: "On réserve coupe-file, tables et consos pour toi",   en: "We book skip-the-line, tables and drinks for you" },
    { n: "3", fr: "Tu profites sans faire la queue (on gère le reste)", en: "You enjoy — no queues, we handle everything" },
  ];

  return (
    <div className="bg-navy-dark text-cream">
      {/* Hero — l'image club domine, pas de titre, juste la promesse + 2 CTAs. */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80" alt="" fill priority className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/30 via-navy-dark/40 to-navy-dark" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-gold/30 text-gold text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur">Night Out · Edmonton</span>
            <p className="text-cream text-xl sm:text-2xl max-w-xl mx-auto mb-8 font-medium leading-tight drop-shadow-lg">
              {fr
                ? "Pas un événement ponctuel — des soirées clé en main qu'on monte pour toi : clubs, bars, food de nuit ou fêtes privées, sans faire la queue."
                : "Not a one-off event — turnkey nights we set up for you: clubs, bars, late-night food or private parties, no queues."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#packages" className="inline-flex items-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                {fr ? "Voir les soirées" : "See the nights"} <ArrowDown className="w-4 h-4" strokeWidth={2} />
              </a>
              <a href="/sur-mesure" className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur border border-cream/30 text-cream font-semibold px-6 py-3 rounded-full hover:bg-cream/25 transition-colors">
                {fr ? "Soirée sur-mesure" : "Custom night"}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtres — juste les Catégories (les vibes musicaux sont maintenant dans /sur-mesure pour les briefs sur-mesure). */}
      <section className="sticky top-16 z-30 bg-navy-dark/90 backdrop-blur border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat === c.key ? "gradient-gold text-navy" : "bg-cream/5 text-cream/70 hover:bg-cream/10 border border-cream/12"}`}>
              <c.Icon className="w-4 h-4" strokeWidth={1.5} /> {catLabels[c.key][locale]}
            </button>
          ))}
        </div>
      </section>

      {/* « Comment ça marche » — 3 étapes pour que le visiteur capte le flow en 2 secondes */}
      <section className="px-4 pt-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HOW_STEPS.map((s) => (
            <div key={s.n} className="bg-cream/5 border border-cream/12 rounded-2xl p-4 text-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold/20 text-gold font-bold text-xs mb-2">{s.n}</span>
              <p className="text-cream/80 text-sm leading-snug">{fr ? s.fr : s.en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-10 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          {list.length === 0 ? (
            <p className="text-center text-cream/55 text-sm py-12">
              {fr ? "Aucune soirée dans cette catégorie. Va voir « Sur-mesure » pour un brief personnalisé." : "No nights in this category. See \"Custom night\" for a tailored brief."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="rounded-3xl overflow-hidden bg-cream/5 border border-cream/12 hover:border-gold/40 transition-colors group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={p.image} alt={p.title[locale]} fill className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" sizes="(max-width:640px) 100vw, 33vw" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-gold/95 text-navy text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1">{catLabels[p.category][locale]}</span>
                    <span className="absolute top-3 right-3 bg-navy/70 backdrop-blur text-cream text-sm font-bold rounded-full px-3 py-1">
                      {p.price}<span className="text-cream/60 font-medium text-[11px] ml-1">{priceUnitLabel[p.priceUnit][locale]}</span>
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-bold mb-2">{p.title[locale]}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cream/75 bg-cream/10 border border-cream/20 rounded-full px-2 py-0.5">
                        <Users className="w-3 h-3" strokeWidth={2} /> {p.groupSize}
                      </span>
                      {p.vibes.map((v) => (
                        <span key={v} className="text-[10px] font-semibold text-gold/90 bg-gold/10 border border-gold/25 rounded-full px-2 py-0.5">{v}</span>
                      ))}
                    </div>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {p.includes[locale].map((it, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-cream/70"><span className="text-gold mt-0.5">▸</span> {it}</li>
                      ))}
                    </ul>
                    <a href={`/contact?plan=${encodeURIComponent(p.title[locale])}`} className="block text-center w-full gradient-gold text-navy font-bold py-3 rounded-full hover:opacity-90 transition-opacity">
                      {fr ? "Réserver la soirée" : "Book the night"}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seamless night stepper */}
      <section className="py-16 px-4 border-t border-cream/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">{fr ? "Un parcours festif sans couture" : "A seamless night out"}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4 text-gold font-bold relative">
                  <s.Icon className="w-6 h-6" strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-gold text-navy text-xs flex items-center justify-center font-bold">{i + 1}</span>
                </div>
                <h3 className="font-bold mb-1">{(fr ? s.fr : s.en)[0]}</h3>
                <p className="text-cream/55 text-sm">{(fr ? s.fr : s.en)[1]}</p>
              </motion.div>
            ))}
          </div>
          {/* Pont vers /sur-mesure si rien ne convient parmi les packages standards */}
          <div className="text-center mt-14">
            <p className="text-cream/55 text-sm mb-3">
              {fr ? "Aucun package ne te ressemble ? Brief-nous ce que tu veux exactement." : "None of these match? Brief us with exactly what you want."}
            </p>
            <a href="/sur-mesure" className="inline-flex items-center gap-2 bg-cream/10 hover:bg-cream/15 border border-cream/25 text-cream font-semibold px-6 py-2.5 rounded-full transition-colors">
              {fr ? "Composer une soirée sur-mesure" : "Build a custom night"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
