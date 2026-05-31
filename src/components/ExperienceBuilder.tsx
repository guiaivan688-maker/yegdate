"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Cake, Gem, PartyPopper, Briefcase, Sparkles,
  Coffee, Palette, Bike, Flower, UtensilsCrossed, Martini, Camera, Home, Car,
  Plus, X, CheckCircle2, type LucideIcon,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";

interface Block {
  id: string;
  fr: string;
  en: string;
  price: number;
  perPerson: boolean;
  Icon: LucideIcon;
}

const occasions: { id: string; fr: string; en: string; Icon: LucideIcon }[] = [
  { id: "date", fr: "Date Night", en: "Date Night", Icon: Heart },
  { id: "anniversaire", fr: "Anniversaire", en: "Birthday", Icon: Cake },
  { id: "demande", fr: "Demande en mariage", en: "Proposal", Icon: Gem },
  { id: "evjf", fr: "EVJF / EVG", en: "Bachelor/ette", Icon: PartyPopper },
  { id: "team", fr: "Team Building", en: "Team Building", Icon: Briefcase },
  { id: "autre", fr: "Autre", en: "Other", Icon: Sparkles },
];

// Vibes musicaux — sélecteur ajouté dans le recap pour les briefs où la musique compte
// (EVG/EVJF, Date Night, Birthday). Le client peut en cocher plusieurs ; on les envoie
// dans le message du devis pour qu'Ivan brief la bonne ambiance au partenaire.
const VIBES_MUSIQUE = ["Hip-Hop", "Top 40", "EDM", "House", "Afro", "Latino", "Indie", "Lounge", "Chill", "Live Music"];

const blocks: Block[] = [
  { id: "brunch", fr: "Brunch", en: "Brunch", price: 50, perPerson: true, Icon: Coffee },
  { id: "creative", fr: "Activité créative", en: "Creative activity", price: 60, perPerson: true, Icon: Palette },
  { id: "sport", fr: "Activité sportive", en: "Sport activity", price: 40, perPerson: true, Icon: Bike },
  { id: "spa", fr: "Spa / bien-être", en: "Spa / wellness", price: 80, perPerson: true, Icon: Flower },
  { id: "diner", fr: "Dîner gastronomique", en: "Fine dining", price: 100, perPerson: false, Icon: UtensilsCrossed },
  { id: "cocktails", fr: "Cocktails bar", en: "Cocktails bar", price: 30, perPerson: true, Icon: Martini },
  { id: "photo", fr: "Photographe", en: "Photographer", price: 150, perPerson: false, Icon: Camera },
  { id: "deco", fr: "Décoration chambre", en: "Room decoration", price: 149, perPerson: false, Icon: Home },
  { id: "transport", fr: "Transport privé", en: "Private transport", price: 120, perPerson: false, Icon: Car },
];

const startHour = 11;

export default function ExperienceBuilder() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [occasion, setOccasion] = useState<string>("");
  const [timeline, setTimeline] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [vibes, setVibes] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function addBlock(id: string) {
    setTimeline((tl) => [...tl, id]);
  }
  function removeBlock(idx: number) {
    setTimeline((tl) => tl.filter((_, i) => i !== idx));
  }

  function blockPrice(b: Block) {
    return b.perPerson ? b.price * guests : b.price;
  }
  const total = timeline.reduce((sum, id) => {
    const b = blocks.find((x) => x.id === id);
    return sum + (b ? blockPrice(b) : 0);
  }, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("sending");
    const planSummary = timeline.map((id) => blocks.find((b) => b.id === id)?.[locale]).join(" → ");
    try {
      await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          message: `[Sur-mesure: ${occasion}] ${planSummary} | ${date} | Vibes: ${vibes.join(", ") || "—"} | ${form.message}`,
          activity: occasions.find((o) => o.id === occasion)?.[locale],
          guests, total, locale,
        }),
      });
    } catch {}
    setStatus("done");
  }

  const inputCls = "w-full bg-surface border border-black/10 rounded-xl px-4 py-2.5 text-navy text-sm placeholder:text-navy/40 outline-none focus:ring-2 focus:ring-gold/40";

  return (
    <div className="bg-cream rounded-3xl border border-black/5 p-6 sm:p-10">
      {/* Step 1 — occasion */}
      <h2 className="font-serif text-2xl font-bold text-navy mb-1">{fr ? "1. Quelle occasion ?" : "1. What's the occasion?"}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-10">
        {occasions.map((o) => (
          <button
            key={o.id}
            onClick={() => setOccasion(o.id)}
            className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 transition-all ${
              occasion === o.id ? "border-gold bg-gold/10 scale-[1.03]" : "border-black/10 bg-surface hover:border-gold/40"
            }`}
          >
            <o.Icon className={`w-6 h-6 ${occasion === o.id ? "text-gold" : "text-navy/70"}`} strokeWidth={1.5} />
            <span className="text-[11px] font-medium text-navy text-center leading-tight">{fr ? o.fr : o.en}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {occasion && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid lg:grid-cols-[1fr_1.1fr_320px] gap-8">
            {/* Step 2a — palette */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">{fr ? "2. Composez" : "2. Build it"}</h2>
              <div className="space-y-2">
                {blocks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => addBlock(b.id)}
                    className="w-full flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-surface px-4 py-3 hover:border-gold hover:bg-gold/5 transition-colors text-left"
                  >
                    <span className="flex items-center gap-3">
                      <b.Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-navy">{fr ? b.fr : b.en}</span>
                    </span>
                    <span className="flex items-center gap-2 text-navy/50 text-xs">
                      ${b.price}{b.perPerson ? (fr ? "/pers" : "/pp") : ""}
                      <Plus className="w-4 h-4 text-gold" strokeWidth={2} />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2b — timeline */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">{fr ? "Votre journée" : "Your day"}</h2>
              {timeline.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-navy/20 p-8 text-center text-navy/40 text-sm">
                  {fr ? "Cliquez sur des blocs pour composer votre journée." : "Click blocks to compose your day."}
                </div>
              ) : (
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-2 border-l-2 border-dashed border-gold/40" />
                  <div className="space-y-3">
                    {timeline.map((id, idx) => {
                      const b = blocks.find((x) => x.id === id)!;
                      const time = `${String(startHour + idx * 2).padStart(2, "0")}:00`;
                      return (
                        <motion.div
                          key={`${id}-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative flex items-center justify-between gap-3 rounded-2xl bg-surface border border-black/5 shadow-sm px-4 py-3"
                        >
                          <span className="absolute -left-[1.45rem] w-3 h-3 rounded-full gradient-gold border-2 border-cream" />
                          <span className="flex items-center gap-3">
                            <span className="text-navy/40 text-xs font-mono">{time}</span>
                            <b.Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                            <span className="text-sm font-medium text-navy">{fr ? b.fr : b.en}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-navy/60 text-xs">${blockPrice(b)}</span>
                            <button onClick={() => removeBlock(idx)} aria-label="remove" className="text-navy/30 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 — recap (sticky) */}
            <div>
              <div className="lg:sticky lg:top-24 bg-navy text-cream rounded-3xl p-6">
                <h3 className="font-serif text-xl font-bold mb-5">{fr ? "3. Récapitulatif" : "3. Summary"}</h3>
                {status === "done" ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-cream/90 text-sm">{fr ? "Merci ! On revient vers vous sous 24h avec votre plan personnalisé." : "Thanks! We'll get back to you within 24h with your custom plan."}</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-3">
                    <div>
                      <label className="text-cream/60 text-xs">{fr ? "Personnes" : "Guests"}: {guests}</label>
                      <input type="range" min={1} max={20} value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className="w-full accent-gold" />
                    </div>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                    <div>
                      <label className="text-cream/60 text-xs block mb-2">{fr ? "Vibe musical (optionnel)" : "Music vibe (optional)"}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {VIBES_MUSIQUE.map((v) => {
                          const active = vibes.includes(v);
                          return (
                            <button
                              type="button"
                              key={v}
                              onClick={() => setVibes((prev) => active ? prev.filter((x) => x !== v) : [...prev, v])}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${active ? "bg-gold text-navy border-gold" : "bg-cream/5 text-cream/70 border-cream/25 hover:bg-cream/10"}`}
                            >
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-y border-cream/15">
                      <span className="text-cream/70 text-sm">{fr ? "Total estimé" : "Estimated total"}</span>
                      <span className="font-serif text-2xl font-bold text-gold">${total}</span>
                    </div>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={fr ? "Nom" : "Name"} className={inputCls} />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inputCls} />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={fr ? "Téléphone" : "Phone"} className={inputCls} />
                    <button type="submit" disabled={status === "sending" || timeline.length === 0} className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                      {status === "sending" ? (fr ? "Envoi…" : "Sending…") : (fr ? "Envoyer ma demande" : "Send my request")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
