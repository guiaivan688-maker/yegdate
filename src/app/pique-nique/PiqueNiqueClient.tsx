"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, PartyPopper, Briefcase, MapPin, Check, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import parks from "@/data/picnic-parks.json";
import options from "@/data/picnic-options.json";

type Occasion = "couple" | "famille" | "groupe" | "event";

interface Park {
  id: string;
  name: string;
  neighbourhood: string;
  address: string;
  image: string;
  description: { fr: string; en: string };
  capacity: string;
  amenities: string[];
  reservation_required: boolean | string;
  reservation_note?: { fr: string; en: string };
  best_for: string[];
  best_spot: { fr: string; en: string };
  scenic_skyline: boolean | string;
  sunset_view: boolean | string;
  watchout?: { fr: string; en: string };
  bbq_allowed: string;
  dog_friendly: string;
}

interface Option {
  id: string;
  category: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  price: number;
  perPerson: boolean;
  occasions: string[];
  icon: string;
}

const OCCASIONS: { id: Occasion; fr: string; en: string; Icon: typeof Heart; map_seg: string }[] = [
  { id: "couple",  fr: "En couple",   en: "As a couple",   Icon: Heart,        map_seg: "couple" },
  { id: "famille", fr: "En famille",  en: "As a family",   Icon: Users,        map_seg: "famille" },
  { id: "groupe",  fr: "Entre amis",  en: "With friends",  Icon: PartyPopper,  map_seg: "groupe" },
  { id: "event",   fr: "Évènement",   en: "Special event", Icon: Briefcase,    map_seg: "event" },
];

const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  decoration: { fr: "Décoration", en: "Decoration" },
  catering:   { fr: "Restauration", en: "Catering" },
  photo:      { fr: "Photo & souvenirs", en: "Photo & memories" },
  transport:  { fr: "Transport", en: "Transport" },
  activity:   { fr: "Activités", en: "Activities" },
  logistique: { fr: "Logistique", en: "Logistics" },
};

const AMENITY_ICONS: Record<string, string> = {
  parking: "🅿️",
  washrooms: "🚻",
  playground: "🛝",
  shelter: "⛱️",
  lake: "🌊",
  shaded: "🌳",
  river_access: "🏞️",
  scenic: "🏔️",
  off_leash_dog: "🐕",
  historic: "🏛️",
  public_art: "🎨",
  reflecting_pool: "💧",
  chinese_garden: "🏯",
  mini_golf: "⛳",
  disc_golf: "🥏",
  golf: "⛳",
  skating_winter: "⛸️",
  sports_fields: "⚽",
  trail: "🚶",
  creek: "🪶",
};

export default function PiqueNiqueClient() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  const [occasion, setOccasion] = useState<Occasion>("couple");
  const [parkId, setParkId] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const allParks = parks as Park[];
  const allOptions = options as Option[];

  // Filter parks for the chosen occasion
  const visibleParks = useMemo(() => {
    return allParks.filter((p) => p.best_for.includes(occasion));
  }, [allParks, occasion]);

  // Filter options for chosen occasion
  const visibleOptions = useMemo(() => {
    return allOptions.filter((o) => o.occasions.includes(occasion));
  }, [allOptions, occasion]);

  // Group options by category
  const optionsByCategory = useMemo(() => {
    const acc: Record<string, Option[]> = {};
    for (const opt of visibleOptions) {
      (acc[opt.category] ||= []).push(opt);
    }
    return acc;
  }, [visibleOptions]);

  const selectedPark = parkId ? allParks.find((p) => p.id === parkId) : null;

  // Base price by occasion
  const basePrice = occasion === "event" ? 149 : occasion === "couple" ? 89 : 119;

  // Calculate total
  const total = useMemo(() => {
    const optTotal = selectedOptions.reduce((sum, id) => {
      const opt = allOptions.find((o) => o.id === id);
      if (!opt) return sum;
      return sum + (opt.perPerson ? opt.price * guests : opt.price);
    }, 0);
    return basePrice + optTotal;
  }, [selectedOptions, allOptions, guests, basePrice]);

  function toggleOption(id: string) {
    setSelectedOptions((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !selectedPark) return;
    setStatus("sending");
    const selectedOptsLabels = selectedOptions
      .map((id) => allOptions.find((o) => o.id === id)?.name[locale])
      .filter(Boolean)
      .join(", ");
    try {
      await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          message: `[Pique-nique sur-mesure] Parc: ${selectedPark.name} | Occasion: ${occasion} | Date: ${date || "à définir"} | Options: ${selectedOptsLabels || "aucune"} | ${form.message}`,
          activity: `Pique-nique ${selectedPark.name}`,
          guests, total, locale,
        }),
      });
    } catch {}
    setStatus("done");
  }

  const inputCls = "w-full bg-surface border border-black/10 rounded-xl px-4 py-2.5 text-navy text-sm placeholder:text-navy/40 outline-none focus:ring-2 focus:ring-gold/40";

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[360px] flex items-end overflow-hidden">
        <Image
          src="/images/edmonton/lifestyle-walterdale-picnic.jpg"
          alt={fr ? "Pique-nique face au Walterdale Bridge, Edmonton" : "Picnic facing Walterdale Bridge, Edmonton"}
          fill
          sizes="100vw"
          priority
          className="object-cover saturate-[0.92] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream mb-3 leading-tight">
              {fr ? "Pique-nique Edmonton" : "Edmonton Picnic"}
            </h1>
            <p className="text-cream/85 text-lg max-w-2xl">
              {fr
                ? "Choisis ton parc, ton occasion, tes options — on s'occupe du setup, du panier et du nettoyage. Toi tu profites."
                : "Pick your park, occasion and options — we handle setup, basket and cleanup. You enjoy."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky steps bar */}
      <section className="sticky top-16 z-30 bg-cream/95 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2 overflow-x-auto">
          <span className="text-navy/60 text-[10px] uppercase tracking-widest font-bold mr-1">
            {fr ? "1. Occasion" : "1. Occasion"}
          </span>
          {OCCASIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => { setOccasion(o.id); setParkId(null); setSelectedOptions([]); }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                occasion === o.id ? "gradient-gold text-navy shadow-md" : "bg-surface text-navy/70 border border-black/10 hover:text-navy"
              }`}
            >
              <o.Icon className="w-3.5 h-3.5" strokeWidth={1.5} /> {fr ? o.fr : o.en}
            </button>
          ))}
          <div className="flex items-center gap-2 bg-surface rounded-full border border-black/10 px-3 py-1 ml-auto">
            <Users className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
            <span className="text-navy/60 text-[11px] whitespace-nowrap">{fr ? "Nb pers" : "Guests"}</span>
            <button onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="-" className="w-5 h-5 rounded-full bg-navy/10 text-navy text-xs font-bold">−</button>
            <span className="text-navy font-bold text-sm w-5 text-center tabular-nums">{guests}</span>
            <button onClick={() => setGuests(Math.min(60, guests + 1))} aria-label="+" className="w-5 h-5 rounded-full bg-navy/10 text-navy text-xs font-bold">+</button>
          </div>
        </div>
      </section>

      {/* Step 2 — Park picker */}
      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy mb-1">
            {fr ? "2. Choisis ton parc" : "2. Pick your park"}
          </h2>
          <p className="text-navy/60 text-sm mb-6">
            {visibleParks.length}{" "}
            {fr
              ? `parc${visibleParks.length > 1 ? "s" : ""} d'Edmonton recommandé${visibleParks.length > 1 ? "s" : ""} pour cette occasion`
              : `Edmonton park${visibleParks.length > 1 ? "s" : ""} recommended for this occasion`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleParks.map((p, i) => {
              const selected = parkId === p.id;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => setParkId(p.id)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className={`text-left bg-surface rounded-3xl border-2 overflow-hidden transition-all ${
                    selected ? "border-gold shadow-xl scale-[1.01]" : "border-black/5 hover:border-gold/40 hover:shadow-lg"
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover saturate-[0.93] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                    {selected && (
                      <span className="absolute top-3 right-3 w-9 h-9 rounded-full gradient-gold text-navy flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </span>
                    )}
                    {(p.sunset_view === true) && (
                      <span className="absolute bottom-3 right-3 bg-gold/95 text-navy text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1">
                        🌅 {fr ? "Coucher de soleil" : "Sunset"}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-navy mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-navy/50 text-xs mb-3">
                      <MapPin className="w-3 h-3" strokeWidth={1.5} /> {p.neighbourhood}
                    </div>
                    <p className="text-navy/65 text-sm leading-snug mb-3 line-clamp-3">{p.description[locale]}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.amenities.slice(0, 5).map((a) => (
                        <span key={a} className="text-[10px] bg-gold/10 text-[#9a7e34] border border-gold/25 rounded-full px-2 py-0.5">
                          {AMENITY_ICONS[a] || ""} {a.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                    {p.watchout && (
                      <div className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 mt-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={2} />
                        <span>{p.watchout[locale]}</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step 3 — Options + Recap */}
      <AnimatePresence>
        {selectedPark && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 sm:py-14 px-4 bg-warm-grey"
          >
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left: options */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy mb-1">
                  {fr ? "3. Tes options" : "3. Your options"}
                </h2>
                <p className="text-navy/60 text-sm mb-6">
                  {fr
                    ? "Personnalise ton pique-nique — décoration, restauration, photo, logistique."
                    : "Personalize your picnic — decoration, catering, photo, logistics."}
                </p>

                {Object.entries(optionsByCategory).map(([cat, opts]) => (
                  <div key={cat} className="mb-6">
                    <h3 className="font-serif text-base font-bold text-navy/85 mb-3 uppercase tracking-wider text-xs">
                      {CATEGORY_LABELS[cat]?.[locale] || cat}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {opts.map((o) => {
                        const sel = selectedOptions.includes(o.id);
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => toggleOption(o.id)}
                            className={`text-left rounded-2xl border-2 p-4 transition-all ${
                              sel ? "border-gold bg-gold/5" : "border-black/10 bg-surface hover:border-gold/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="flex items-center gap-2">
                                <span className="text-xl">{o.icon}</span>
                                <span className="font-semibold text-navy text-sm leading-tight">{o.name[locale]}</span>
                              </span>
                              <span className="shrink-0 text-navy/70 text-xs whitespace-nowrap">
                                {o.price === 0 ? (fr ? "Inclus" : "Included") : `$${o.price}${o.perPerson ? (fr ? "/pp" : "/pp") : ""}`}
                              </span>
                            </div>
                            <p className="text-navy/55 text-xs leading-snug">{o.description[locale]}</p>
                            {sel && (
                              <span className="inline-flex items-center gap-1 text-gold text-[10px] font-bold uppercase tracking-wider mt-2">
                                <Check className="w-3 h-3" strokeWidth={3} /> {fr ? "Ajouté" : "Added"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: sticky recap + form */}
              <div>
                <div className="lg:sticky lg:top-32 bg-navy text-cream rounded-3xl p-6">
                  <h3 className="font-serif text-xl font-bold mb-4">
                    {fr ? "Récapitulatif" : "Summary"}
                  </h3>

                  {status === "done" ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-cream/90 text-sm">
                        {fr ? "Merci ! On revient vers toi sous 24 h avec ton devis." : "Thanks! We'll get back to you within 24h with your quote."}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={submit} className="space-y-3 text-sm">
                      <div className="bg-cream/5 rounded-2xl p-4 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-cream/60">{fr ? "Parc" : "Park"}</span>
                          <span className="font-semibold text-right max-w-[200px] truncate">{selectedPark.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/60">{fr ? "Occasion" : "Occasion"}</span>
                          <span className="font-semibold">{OCCASIONS.find((o) => o.id === occasion)?.[locale === "fr" ? "fr" : "en"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/60">{fr ? "Nb personnes" : "Guests"}</span>
                          <span className="font-semibold">{guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/60">{fr ? "Options" : "Add-ons"}</span>
                          <span className="font-semibold">{selectedOptions.length}</span>
                        </div>
                      </div>

                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className={inputCls}
                      />

                      <div className="flex justify-between items-center py-3 border-y border-cream/15">
                        <span className="text-cream/70">{fr ? "Total estimé" : "Estimated total"}</span>
                        <span className="font-serif text-2xl font-bold text-gold">${total}</span>
                      </div>

                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={fr ? "Ton nom" : "Your name"} className={inputCls} />
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={fr ? "Ton courriel" : "Your email"} className={inputCls} />
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={fr ? "Téléphone (optionnel)" : "Phone (optional)"} className={inputCls} />
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={fr ? "Message — allergies, brief spécial, etc." : "Message — allergies, special brief, etc."}
                        rows={2}
                        className={inputCls + " resize-none"}
                      />

                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {status === "sending" ? (fr ? "Envoi…" : "Sending…") : (fr ? "Recevoir mon devis (24 h)" : "Get my quote (24h)")}
                      </button>
                      <p className="text-cream/40 text-[10px] text-center">
                        {fr ? "Aucun paiement maintenant. On valide les détails avec toi avant." : "No payment now. We confirm details with you first."}
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Why us section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy text-center mb-3">
            {fr ? "Ce qu'on gère pour toi" : "What we handle for you"}
          </h2>
          <div className="w-16 h-1 gradient-gold rounded-full mx-auto mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "📋", fr: "Réservation officielle du site Ville d'Edmonton", en: "Official City of Edmonton site reservation" },
              { icon: "📜", fr: "Permis alcool (Alberta)", en: "Alcohol permit (Alberta)" },
              { icon: "☔", fr: "Plan B météo + gazebo backup", en: "Weather backup + gazebo plan B" },
              { icon: "🧹", fr: "Nettoyage complet leave-no-trace", en: "Full leave-no-trace cleanup" },
              { icon: "🌱", fr: "Adaptation diététique (végé, vegan, halal, sans gluten…)", en: "Dietary adaptation (veg, vegan, halal, gluten-free…)" },
              { icon: "♿", fr: "Accessibilité fauteuil roulant disponible", en: "Wheelchair accessibility available" },
              { icon: "🦟", fr: "Pack anti-moustique pour les ravines", en: "Mosquito kit for ravines" },
              { icon: "📍", fr: "SMS pin GPS + photo parking 2 h avant", en: "SMS GPS pin + parking photo 2h before" },
            ].map((f) => (
              <div key={f.fr} className="bg-surface rounded-2xl border border-black/5 p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-navy/75 text-xs leading-snug">{fr ? f.fr : f.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
