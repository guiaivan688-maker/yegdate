"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Mail, ShieldCheck, CheckCircle2, PauseCircle, RotateCcw, LayoutDashboard, Store, Users, CalendarCheck } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import GoogleSignIn from "@/components/GoogleSignIn";
import EmailPasswordAuth from "@/components/EmailPasswordAuth";

interface Offer { id: string; title_fr: string; location: string | null; price_from: number; status: string; owner: string; created_at: string; }
interface Profile { id: string; role: string; display_name: string | null; created_at: string; }
interface Booking { id: string; offer_id: string; guest_name: string | null; party_size: number | null; status: string; created_at: string; }

const STATUS: Record<string, { fr: string; en: string; cls: string }> = {
  draft: { fr: "En attente", en: "Pending", cls: "bg-amber-500/15 text-amber-700" },
  published: { fr: "En ligne", en: "Live", cls: "bg-green-500/15 text-green-700" },
  suspended: { fr: "Suspendu", en: "Suspended", cls: "bg-red-500/15 text-red-700" },
};
const ROLE_CLS: Record<string, string> = { admin: "bg-gold/20 text-gold-dark", prestataire: "bg-navy/10 text-navy", client: "bg-black/5 text-navy/60" };

type Tab = "overview" | "offers" | "users" | "bookings";

export default function AdminPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (!data.session) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadAdmin = useCallback(async (uid: string) => {
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", uid).single();
    const r = (prof as { role?: string } | null)?.role ?? "client";
    setRole(r);
    if (r === "admin") {
      const [o, p, b] = await Promise.all([
        supabase.from("offers").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id,role,display_name,created_at").order("created_at", { ascending: false }),
        supabase.from("booking_requests").select("id,offer_id,guest_name,party_size,status,created_at").order("created_at", { ascending: false }),
      ]);
      setOffers((o.data as Offer[]) ?? []);
      setProfiles((p.data as Profile[]) ?? []);
      setBookings((b.data as Booking[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) { setLoading(true); loadAdmin(user.id); }
    else { setRole(null); }
  }, [user, loadAdmin]);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setEmailSent(true);
  }
  async function setStatus(id: string, status: string) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from("offers").update({ status }).eq("id", id);
  }

  const counts = {
    offersTotal: offers.length,
    published: offers.filter((o) => o.status === "published").length,
    pending: offers.filter((o) => o.status === "draft").length,
    users: profiles.length,
    bookings: bookings.length,
  };
  const offerName = (id: string) => offers.find((o) => o.id === id)?.title_fr ?? id.slice(0, 8);

  const tabs: { key: Tab; fr: string; en: string; Icon: typeof Store }[] = [
    { key: "overview", fr: "Vue d'ensemble", en: "Overview", Icon: LayoutDashboard },
    { key: "offers", fr: "Offres", en: "Offers", Icon: Store },
    { key: "users", fr: "Utilisateurs", en: "Users", Icon: Users },
    { key: "bookings", fr: "Réservations", en: "Bookings", Icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-3 py-1.5 text-sm mb-6">
          <ShieldCheck className="w-4 h-4 text-gold" strokeWidth={1.75} /> {fr ? "Console admin" : "Admin console"}
        </div>
        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-8">{fr ? "Tableau de bord" : "Dashboard"}</h1>

        {loading ? (
          <div className="flex items-center gap-2 text-navy/50"><Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} /> {fr ? "Chargement…" : "Loading…"}</div>
        ) : !user ? (
          <div className="max-w-md bg-surface border border-black/5 rounded-3xl p-8">
            <Mail className="w-8 h-8 text-gold mb-4" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-bold text-navy mb-2">{fr ? "Connexion admin" : "Admin sign in"}</h2>
            <EmailPasswordAuth />
            <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-black/10" /></div>
            <GoogleSignIn redirectTo="/admin" label={fr ? "Continuer avec Google" : "Continue with Google"} />
            <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou par email" : "or by email"}<span className="h-px flex-1 bg-black/10" /></div>
            {emailSent ? (
              <p className="text-navy/65">{fr ? "Lien envoyé ! Vérifie ta boîte mail." : "Link sent! Check your inbox."}</p>
            ) : (
              <form onSubmit={sendMagicLink} className="flex flex-col gap-3 mt-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={fr ? "ton@email.com" : "you@email.com"} className="w-full border border-black/10 rounded-full px-5 py-3 text-navy" />
                <button type="submit" className="inline-flex items-center justify-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                  <Mail className="w-4 h-4" strokeWidth={2} /> {fr ? "Recevoir mon lien" : "Send my link"}
                </button>
              </form>
            )}
          </div>
        ) : role !== "admin" ? (
          <div className="max-w-xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold text-navy mb-2">{fr ? "Accès réservé aux administrateurs" : "Admins only"}</h2>
            <p className="text-navy/65 text-sm mb-4">{fr ? "Ton compte n'a pas le rôle admin. Pour t'auto-promouvoir, exécute ceci dans Supabase → SQL Editor :" : "Your account isn't an admin. To promote yourself, run this in Supabase → SQL Editor:"}</p>
            <pre className="bg-navy text-cream text-xs rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{`update public.profiles set role='admin' where id='${user.id}';`}</pre>
            <p className="text-navy/45 text-xs mt-3">{fr ? "Puis recharge cette page." : "Then reload this page."}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8 border-b border-black/5">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t.key ? "border-gold text-navy" : "border-transparent text-navy/45 hover:text-navy"}`}>
                  <t.Icon className="w-4 h-4" strokeWidth={1.75} /> {fr ? t.fr : t.en}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: fr ? "Offres" : "Offers", value: counts.offersTotal },
                  { label: fr ? "En ligne" : "Live", value: counts.published },
                  { label: fr ? "En attente" : "Pending", value: counts.pending },
                  { label: fr ? "Utilisateurs" : "Users", value: counts.users },
                  { label: fr ? "Réservations" : "Bookings", value: counts.bookings },
                  { label: fr ? "Revenus" : "Revenue", value: "—" },
                ].map((s) => (
                  <div key={s.label} className="bg-surface border border-black/5 rounded-2xl p-5">
                    <p className="font-serif text-3xl font-bold text-navy">{s.value}</p>
                    <p className="text-navy/55 text-sm mt-1">{s.label}</p>
                  </div>
                ))}
                <p className="col-span-full text-navy/40 text-xs mt-2">{fr ? "Les revenus s'activeront avec les paiements (Phase 2 · Stripe)." : "Revenue activates with payments (Phase 2 · Stripe)."}</p>
              </div>
            )}

            {tab === "offers" && (
              offers.length === 0 ? <p className="text-navy/50">{fr ? "Aucune offre." : "No offers."}</p> : (
                <div className="space-y-3">
                  {offers.map((o) => (
                    <div key={o.id} className="flex items-center gap-4 bg-surface border border-black/5 rounded-2xl p-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-navy truncate">{o.title_fr}</h3>
                        <p className="text-navy/45 text-xs truncate">{o.location} · ${o.price_from}</p>
                      </div>
                      <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS[o.status]?.cls ?? "bg-navy/10 text-navy/60"}`}>{STATUS[o.status]?.[locale] ?? o.status}</span>
                      <div className="flex gap-2 shrink-0">
                        {o.status !== "published" && <button onClick={() => setStatus(o.id, "published")} className="inline-flex items-center gap-1 text-green-700 hover:bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Publier" : "Publish"}</button>}
                        {o.status === "published" && <button onClick={() => setStatus(o.id, "suspended")} className="inline-flex items-center gap-1 text-red-600 hover:bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><PauseCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Suspendre" : "Suspend"}</button>}
                        {o.status === "suspended" && <button onClick={() => setStatus(o.id, "draft")} className="inline-flex items-center gap-1 text-navy/60 hover:bg-navy/5 border border-black/10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "En attente" : "Pending"}</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "users" && (
              profiles.length === 0 ? <p className="text-navy/50">{fr ? "Aucun utilisateur." : "No users."}</p> : (
                <div className="space-y-2">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                      <span className="flex-1 min-w-0 truncate text-navy text-sm">{p.display_name || p.id.slice(0, 8)}</span>
                      <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${ROLE_CLS[p.role] ?? "bg-black/5 text-navy/60"}`}>{p.role}</span>
                    </div>
                  ))}
                  <p className="text-navy/40 text-xs mt-2">{fr ? "Changer un rôle = via Supabase pour l'instant (RLS protège les profils)." : "Role changes via Supabase for now (RLS protects profiles)."}</p>
                </div>
              )
            )}

            {tab === "bookings" && (
              bookings.length === 0 ? <p className="text-navy/50">{fr ? "Aucune réservation." : "No bookings."}</p> : (
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-navy text-sm truncate">{b.guest_name || "—"} · {b.party_size ?? 1} {fr ? "pers." : "guests"}</p>
                        <p className="text-navy/45 text-xs truncate">{offerName(b.offer_id)}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-navy/10 text-navy/70">{b.status}</span>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
