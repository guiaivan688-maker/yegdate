"use client";

import { useState, useMemo } from "react";
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
  { id: "afro-vibes-night", category: "clubs", price: "$140", priceUnit: "pers", groupSize: "4-12 pers", image: "https://images.unsplash.com/photo-1571266028243-d220c6a04d8a?w=900&q=80",
    title: { fr: "Afro Vibes Night", en: "Afro Vibes Night" },
    vibes: ["Afro", "Afrobeats", "Latino"],
    includes: { fr: ["Soirée afro/afrobeats à Edmonton", "Table réservée + coupe-file", "Hôte qui connaît les soirées afro de la ville", "Playlist sur demande"], en: ["Afro/afrobeats night in Edmonton", "Reserved table + skip-the-line", "Host who knows the city's afro scene", "Playlist on request"] } },
  { id: "latino-night", category: "clubs", price: "$130", priceUnit: "pers", groupSize: "4-12 pers", image: "https://images.unsplash.com/photo-1574391884720-bbc049ec09ad?w=900&q=80",
    title: { fr: "Latino Night — Salsa & Reggaeton", en: "Latino Night — Salsa & Reggaeton" },
    vibes: ["Latino", "Reggaeton", "Salsa"],
    includes: { fr: ["Soirée salsa/reggaeton confirmée à Edmonton", "Table réservée", "Cours de salsa débutant (30 min, option)", "Coupe-file"], en: ["Confirmed salsa/reggaeton night in Edmonton", "Reserved table", "Beginner salsa lesson (30 min, optional)", "Skip-the-line"] } },
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
    title: { fr: "EVG / EVJF Night", en: "Bachelor / Bachelorette Night" },
    vibes: ["Afro", "Latino", "Hip-Hop"],
    includes: { fr: ["Parcours bars + club organisé", "Coupe-file & table", "Jeux et surprises", "Transport entre les lieux"], en: ["Organized bar + club route", "Skip-the-line & table", "Games and surprises", "Transport between venues"] } },
  { id: "princess-theatre-whyte", category: "bars", price: "$85", priceUnit: "pers", groupSize: "2-8 pers", image: "/images/edmonton/nightout-princess-theatre.jpg",
    title: { fr: "Princess Theatre — Live Music Whyte Ave", en: "Princess Theatre — Whyte Ave Live Music" },
    vibes: ["Live Music", "Indie", "Local"],
    includes: { fr: ["Billet pour le show au Princess Theatre", "2 bars partenaires sur Whyte Ave avant/après", "Cocktail signature offert", "Guide local Whyte Ave"], en: ["Princess Theatre show ticket", "2 partner bars on Whyte Ave before/after", "Signature cocktail on us", "Local Whyte Ave guide"] } },
  { id: "whyte-ave-illuminated", category: "bars", price: "$95", priceUnit: "pers", groupSize: "2-6 pers", image: "/images/edmonton/nightout-whyte-ave.jpg",
    title: { fr: "Whyte Ave Illuminée — Tour Nocturne", en: "Whyte Ave Lit Up — Night Tour" },
    vibes: ["Local", "Lounge", "Chill"],
    includes: { fr: ["Visite guidée Whyte Avenue éclairée (les arbres en lumières)", "3 arrêts dans des bars/lounges", "1 cocktail par arrêt", "Spots photos garantis"], en: ["Guided tour of lit-up Whyte Avenue (the light-trees)", "3 bar/lounge stops", "1 cocktail per stop", "Guaranteed photo spots"] } },
];

// Vibe palette — emoji-tagged, dérivée des packages
const VIBE_META: Record<string, { emoji: string; bias?: number }> = {
  "Afro": { emoji: "🌍", bias: 1 },
  "Afrobeats": { emoji: "🥁" },
  "Latino": { emoji: "💃", bias: 1 },
  "Reggaeton": { emoji: "🔥" },
  "Salsa": { emoji: "🕺" },
  "Hip-Hop": { emoji: "🎤", bias: 1 },
  "Top 40": { emoji: "🎶" },
  "EDM": { emoji: "🎧" },
  "House": { emoji: "🏠" },
  "Indie": { emoji: "🎸" },
  "Local": { emoji: "📍" },
  "Lounge": { emoji: "🍸" },
  "Chill": { emoji: "✨" },
  "Post-club": { emoji: "🍕" },
  "Late-night": { emoji: "🌙" },
  "Groupes": { emoji: "👥" },
  "Anniversaire": { emoji: "🎂" },
  "Premium": { emoji: "👑" },
};

const steps = [
  { Icon: Flame,  fr: ["Choisis ton vibe", "Afro, Latino, Hip-Hop, Lounge — sélectionne ton ambiance."], en: ["Pick your vibe", "Afro, Latino, Hip-Hop, Lounge — pick your sound."] },
  { Icon: Ticket, fr: ["Reçois tes accès VIP", "Coupe-file, tables et consos confirmés instantanément."],          en: ["Get your VIP access", "Skip-the-line, tables and drinks confirmed instantly."] },
  { Icon: Music,  fr: ["Profite sans faire la queue", "On gère la logistique — tu profites de la nuit à Edmonton."], en: ["Enjoy, no queues", "We handle the logistics — you enjoy the Edmonton night."] },
];

export default function NightOutPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [cat, setCat] = useState<string>("all");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  // Liste des vibes uniques (ordonnée : Afro/Latino/Hip-Hop d'abord car "bias")
  const allVibes = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((p) => p.vibes.forEach((v) => set.add(v)));
    return Array.from(set).sort((a, b) => (VIBE_META[b]?.bias ?? 0) - (VIBE_META[a]?.bias ?? 0));
  }, []);

  function toggleVibe(v: string) {
    setSelectedVibes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
  }

  const list = packages.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (selectedVibes.length > 0 && !p.vibes.some((v) => selectedVibes.includes(v))) return false;
    return true;
  });

  return (
    <div className="bg-navy-dark text-cream">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image src="/images/edmonton/nightout-whyte-ave.jpg" alt={fr ? "Whyte Avenue illuminée la nuit, Edmonton" : "Whyte Avenue lit up at night, Edmonton"} fill priority sizes="100vw" className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/30 via-navy-dark/40 to-navy-dark" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-gold/30 text-gold text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur">Night Out · Edmonton</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-5 leading-tight drop-shadow-lg">
              {fr ? "Choisis ta vibe. On compose ta soirée." : "Pick your vibe. We build your night."}
            </h1>
            <p className="text-cream/85 text-lg sm:text-xl max-w-xl mx-auto mb-8 font-medium leading-snug drop-shadow-lg">
              {fr
                ? "Soirées clé en main à Edmonton — Afro, Latino, Hip-Hop, Lounge. Coupe-file, table réservée, du club au food de nuit."
                : "Turnkey Edmonton nights — Afro, Latino, Hip-Hop, Lounge. Skip the line, reserved table, club to late-night eats."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#vibes" className="inline-flex items-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                {fr ? "Choisir ma vibe" : "Pick my vibe"} <ArrowDown className="w-4 h-4" strokeWidth={2} />
              </a>
              <a href="/sur-mesure" className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur border border-cream/30 text-cream font-semibold px-6 py-3 rounded-full hover:bg-cream/25 transition-colors">
                {fr ? "Soirée 100% sur-mesure" : "Fully custom night"}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sélecteur de VIBE — primaire, en haut */}
      <section id="vibes" className="sticky top-16 z-30 bg-navy-dark/95 backdrop-blur border-b border-cream/15 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-cream/60 text-[11px] uppercase tracking-widest font-bold whitespace-nowrap">
              {fr ? "Ta vibe" : "Your vibe"}
            </span>
            {selectedVibes.length > 0 && (
              <button
                onClick={() => setSelectedVibes([])}
                className="text-cream/60 hover:text-gold text-xs underline underline-offset-2"
              >
                {fr ? `Réinitialiser (${selectedVibes.length})` : `Reset (${selectedVibes.length})`}
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {allVibes.map((v) => {
              const meta = VIBE_META[v] || { emoji: "🎵" };
              const active = selectedVibes.includes(v);
              return (
                <button
                  key={v}
                  onClick={() => toggleVibe(v)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    active
                      ? "gradient-gold text-navy shadow-md scale-[1.02]"
                      : "bg-cream/8 text-cream/85 border border-cream/25 hover:bg-cream/15 hover:border-gold/40"
                  }`}
                >
                  <span aria-hidden>{meta.emoji}</span> {v}
                </button>
              );
            })}
          </div>

          {/* Categories — secondaires */}
          <div className="flex gap-1.5 overflow-x-auto pt-1 border-t border-cream/10 pt-2.5">
            <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap self-center mr-1">
              {fr ? "Type" : "Type"}
            </span>
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  cat === c.key ? "bg-cream text-navy" : "bg-cream/5 text-cream/70 hover:bg-cream/15 border border-cream/20"
                }`}
              >
                <c.Icon className="w-3.5 h-3.5" strokeWidth={1.5} /> {catLabels[c.key][locale]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-10 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-cream/55 text-xs sm:text-sm mb-6">
            {list.length > 0
              ? fr
                ? `${list.length} soirée${list.length > 1 ? "s" : ""}${selectedVibes.length ? ` pour ${selectedVibes.join(", ")}` : ""}`
                : `${list.length} ${list.length > 1 ? "nights" : "night"}${selectedVibes.length ? ` for ${selectedVibes.join(", ")}` : ""}`
              : ""}
          </p>
          {list.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cream/70 text-base mb-4">
                {fr ? "Aucune soirée prête pour cette vibe." : "No ready-made nights for this vibe."}
              </p>
              <a href="/sur-mesure" className="inline-flex items-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                {fr ? "Compose ta soirée sur-mesure" : "Build your custom night"}
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="rounded-3xl overflow-hidden bg-cream/5 border border-cream/15 hover:border-gold/40 transition-colors group flex flex-col">
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
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cream/85 bg-cream/10 border border-cream/25 rounded-full px-2 py-0.5">
                        <Users className="w-3 h-3" strokeWidth={2} /> {p.groupSize}
                      </span>
                      {p.vibes.map((v) => {
                        const active = selectedVibes.includes(v);
                        return (
                          <span
                            key={v}
                            className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${
                              active
                                ? "bg-gold/30 text-gold border-gold/60"
                                : "text-gold/90 bg-gold/10 border-gold/25"
                            }`}
                          >
                            {VIBE_META[v]?.emoji || "🎵"} {v}
                          </span>
                        );
                      })}
                    </div>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {p.includes[locale].map((it, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-cream/75"><span className="text-gold mt-0.5">▸</span> {it}</li>
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
          <h2 className="font-serif text-3xl font-bold text-center mb-12">{fr ? "Une soirée sans accrocs, du premier verre au dernier shot" : "A seamless night out, from first drink to last shot"}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4 text-gold font-bold relative">
                  <s.Icon className="w-6 h-6" strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-gold text-navy text-xs flex items-center justify-center font-bold">{i + 1}</span>
                </div>
                <h3 className="font-bold mb-1">{(fr ? s.fr : s.en)[0]}</h3>
                <p className="text-cream/60 text-sm">{(fr ? s.fr : s.en)[1]}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-14">
            <p className="text-cream/60 text-sm mb-3">
              {fr ? "Aucun package ne te ressemble ? Brief-nous ce que tu veux exactement." : "None of these match? Brief us with exactly what you want."}
            </p>
            <a href="/sur-mesure" className="inline-flex items-center gap-2 bg-cream/10 hover:bg-cream/15 border border-cream/30 text-cream font-semibold px-6 py-2.5 rounded-full transition-colors">
              {fr ? "Composer une soirée sur-mesure" : "Build a custom night"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
