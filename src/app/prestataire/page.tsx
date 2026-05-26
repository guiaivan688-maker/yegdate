"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, MapPin, Plus, Inbox, LogOut, Mail, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useLocale } from "@/lib/locale-context";
import { allActivities } from "@/lib/activities";
import { supabase } from "@/lib/supabase";
import GoogleSignIn from "@/components/GoogleSignIn";
import EmailPasswordAuth from "@/components/EmailPasswordAuth";

interface Offer {
  id: string;
  source_activity_id: string | null;
  title_fr: string;
  location: string | null;
  price_from: number;
  image: string | null;
  status: string;
}

interface BookingRequest {
  id: string;
  guest_name: string | null;
  party_size: number | null;
  status: string;
  created_at: string;
}

const STATUS: Record<string, { fr: string; en: string; cls: string }> = {
  draft: { fr: "En attente de validation", en: "Pending review", cls: "bg-amber-500/15 text-amber-700" },
  published: { fr: "En ligne", en: "Live", cls: "bg-green-500/15 text-green-700" },
  suspended: { fr: "Suspendu", en: "Suspended", cls: "bg-red-500/15 text-red-700" },
};

export default function PrestatairePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const reload = useCallback(async (uid: string) => {
    const { data: o } = await supabase.from("offers").select("*").eq("owner", uid).order("created_at", { ascending: false });
    setOffers((o as Offer[]) ?? []);
    const { data: b } = await supabase.from("booking_requests").select("id,guest_name,party_size,status,created_at").order("created_at", { ascending: false }).limit(10);
    setRequests((b as BookingRequest[]) ?? []);
  }, []);

  useEffect(() => {
    if (user) reload(user.id);
    else { setOffers([]); setRequests([]); }
  }, [user, reload]);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/prestataire` } });
    setBusy(false);
    setEmailSent(true);
  }

  async function claim(activity: (typeof allActivities)[number]) {
    if (!user || busy) return;
    setBusy(true);
    await supabase.from("offers").insert({
      owner: user.id,
      source_activity_id: activity.id,
      title_fr: activity.title.fr,
      title_en: activity.title.en,
      location: activity.location,
      price_from: activity.priceFrom,
      image: activity.image,
      status: "draft",
    });
    await reload(user.id);
    setBusy(false);
  }

  function setLocalPrice(id: string, price: number) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, price_from: price } : o)));
  }
  async function persistPrice(id: string, price: number) {
    await supabase.from("offers").update({ price_from: price }).eq("id", id);
  }
  async function removeOffer(id: string) {
    await supabase.from("offers").delete().eq("id", id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  const claimedIds = new Set(offers.map((o) => o.source_activity_id).filter(Boolean) as string[]);
  const q = query.trim().toLowerCase();
  const claimable = allActivities.filter(
    (a) => !claimedIds.has(a.id) && (q === "" || a.title[locale].toLowerCase().includes(q) || a.location.toLowerCase().includes(q)),
  );

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-sm text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500" /> {fr ? "Connecté à la base réelle" : "Connected to live database"}
          </div>
          {user && (
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1.5 text-navy/50 hover:text-navy text-sm transition-colors">
              <LogOut className="w-4 h-4" strokeWidth={1.5} /> {user.email}
            </button>
          )}
        </div>

        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{fr ? "Espace prestataire" : "Provider space"}</h1>
        <p className="text-navy/60 text-lg mb-12 max-w-2xl">{fr ? "Réclame ta fiche existante et gère tes offres — pas besoin de repartir de zéro." : "Claim your existing listing and manage your offers — no need to start from scratch."}</p>

        {authLoading ? (
          <div className="flex items-center gap-2 text-navy/50"><Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} /> {fr ? "Chargement…" : "Loading…"}</div>
        ) : !user ? (
          <div className="max-w-md bg-surface border border-black/5 rounded-3xl p-8">
            <Mail className="w-8 h-8 text-gold mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-bold text-navy mb-2">{fr ? "Connecte-toi" : "Sign in"}</h2>
            <EmailPasswordAuth />
            <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-black/10" /></div>
            <GoogleSignIn redirectTo="/prestataire" label={fr ? "Continuer avec Google" : "Continue with Google"} />
            <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou par email" : "or by email"}<span className="h-px flex-1 bg-black/10" /></div>
            {emailSent ? (
              <p className="text-navy/65">{fr ? "Lien envoyé ! Vérifie ta boîte mail et clique sur le lien pour accéder à ton espace." : "Link sent! Check your inbox and click the link to access your space."}</p>
            ) : (
              <>
                <p className="text-navy/60 mb-5">{fr ? "Reçois un lien magique par email — pas de mot de passe." : "Get a magic link by email — no password."}</p>
                <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={fr ? "ton@email.com" : "you@email.com"}
                    className="w-full border border-black/10 rounded-full px-5 py-3 text-navy"
                  />
                  <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <Mail className="w-4 h-4" strokeWidth={2} />}
                    {fr ? "Recevoir mon lien" : "Send my link"}
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-bold text-navy mb-5">{fr ? "Mon espace" : "My space"}</h2>
              {offers.length === 0 ? (
                <p className="text-navy/50 bg-surface border border-black/5 rounded-2xl px-5 py-6">{fr ? "Tu n'as pas encore réclamé de fiche. Choisis ton établissement ci-dessous 👇" : "You haven't claimed a listing yet. Pick your business below 👇"}</p>
              ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {offers.map((o) => (
                      <div key={o.id} className="flex gap-4 bg-surface border border-black/5 rounded-2xl p-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-navy/5">
                          {o.image && <Image src={o.image} alt={o.title_fr} fill className="object-cover" sizes="80px" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy truncate">{o.title_fr}</h3>
                          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full my-1 ${STATUS[o.status]?.cls ?? "bg-navy/10 text-navy/60"}`}>{STATUS[o.status]?.[locale] ?? o.status}</span>
                          <p className="text-navy/45 text-xs flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {o.location}</p>
                          <label className="text-xs text-navy/60 flex items-center gap-1.5">
                            {fr ? "Prix dès" : "Price from"}
                            <span className="text-navy/50">$</span>
                            <input
                              type="number"
                              min={0}
                              value={o.price_from}
                              onChange={(e) => setLocalPrice(o.id, Number(e.target.value))}
                              onBlur={(e) => persistPrice(o.id, Number(e.target.value))}
                              className="w-20 border border-black/10 rounded-lg px-2 py-1 text-navy"
                            />
                          </label>
                        </div>
                        <button onClick={() => removeOffer(o.id)} className="text-navy/40 hover:text-red-500 text-xs self-start transition-colors">
                          {fr ? "Retirer" : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-navy rounded-2xl p-5 text-cream h-fit">
                    <p className="flex items-center gap-2 font-semibold mb-4"><Inbox className="w-4 h-4 text-gold" strokeWidth={1.75} /> {fr ? "Demandes reçues" : "Incoming requests"}</p>
                    {requests.length === 0 ? (
                      <p className="text-cream/50 text-sm">{fr ? "Aucune demande pour l'instant." : "No requests yet."}</p>
                    ) : (
                      <div className="space-y-3">
                        {requests.map((r) => (
                          <div key={r.id} className="flex items-center justify-between gap-2 border-b border-cream/10 pb-2 last:border-0">
                            <div>
                              <p className="text-sm text-cream">{r.guest_name || "—"}</p>
                              <p className="text-cream/50 text-xs">{r.party_size ?? 1} {fr ? "pers." : "guests"} · {r.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                        onClick={() => claim(a)}
                        disabled={busy}
                        className="mt-auto inline-flex items-center justify-center gap-1.5 gradient-gold text-navy font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        <Plus className="w-4 h-4" strokeWidth={2} /> {fr ? "C'est mon établissement" : "This is my business"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
