"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2, Mail, ShieldCheck, CheckCircle2, PauseCircle, RotateCcw,
  LayoutDashboard, Store, Users, CalendarCheck, BarChart3, Search, XCircle, MapPin,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import GoogleSignIn from "@/components/GoogleSignIn";
import EmailPasswordAuth from "@/components/EmailPasswordAuth";

interface Offer { id: string; title_fr: string; location: string | null; price_from: number; status: string; owner: string; created_at: string; }
interface Profile { id: string; role: string; display_name: string | null; created_at: string; }
interface Booking { id: string; offer_id: string; guest_name: string | null; party_size: number | null; status: string; created_at: string; requested_for: string | null; }
interface Run { budget: number; context: string; created_at: string; }

const OSTATUS: Record<string, { fr: string; en: string; cls: string }> = {
  draft: { fr: "En attente", en: "Pending", cls: "bg-amber-500/15 text-amber-700" },
  published: { fr: "En ligne", en: "Live", cls: "bg-green-500/15 text-green-700" },
  suspended: { fr: "Suspendu", en: "Suspended", cls: "bg-red-500/15 text-red-700" },
};
const BSTATUS: Record<string, { fr: string; en: string; cls: string }> = {
  pending: { fr: "En attente", en: "Pending", cls: "bg-amber-500/15 text-amber-700" },
  confirmed: { fr: "Confirmée", en: "Confirmed", cls: "bg-green-500/15 text-green-700" },
  declined: { fr: "Refusée", en: "Declined", cls: "bg-red-500/15 text-red-700" },
};
const ROLE_CLS: Record<string, string> = { admin: "bg-gold/20 text-[#9a7e34]", prestataire: "bg-navy/10 text-navy", client: "bg-black/5 text-navy/60" };
const ROLES = ["client", "prestataire", "admin"];
const CTX: Record<string, string> = { couples: "Couples", famille: "Famille", amis: "Amis", solo: "Solo" };

type Tab = "overview" | "moderation" | "users" | "bookings" | "analytics";

function BarRow({ label, n, max, color = "gradient-gold" }: { label: string; n: number; max: number; color?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 text-navy/65 truncate">{label}</span>
      <div className="flex-1 bg-black/5 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${max ? (n / max) * 100 : 0}%` }} />
      </div>
      <span className="w-8 text-right text-navy font-semibold">{n}</span>
    </div>
  );
}

function Panel({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-surface border border-black/5 rounded-2xl p-5">
      {title && <h3 className="font-semibold text-navy mb-4 text-sm">{title}</h3>}
      {children}
    </div>
  );
}

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
  const [runs, setRuns] = useState<Run[]>([]);
  const [offerStatus, setOfferStatus] = useState("all");
  const [offerQuery, setOfferQuery] = useState("");
  const [userRoleF, setUserRoleF] = useState("all");
  const [userQuery, setUserQuery] = useState("");
  const [bookingF, setBookingF] = useState("all");

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
      const [o, p, b, c] = await Promise.all([
        supabase.from("offers").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id,role,display_name,created_at").order("created_at", { ascending: false }),
        supabase.from("booking_requests").select("id,offer_id,guest_name,party_size,status,created_at,requested_for").order("created_at", { ascending: false }),
        supabase.from("composer_runs").select("budget,context,created_at").order("created_at", { ascending: false }).limit(2000),
      ]);
      setOffers((o.data as Offer[]) ?? []);
      setProfiles((p.data as Profile[]) ?? []);
      setBookings((b.data as Booking[]) ?? []);
      setRuns((c.data as Run[]) ?? []);
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
  async function setOfferStatusFn(id: string, status: string) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from("offers").update({ status }).eq("id", id);
  }
  async function setUserRoleFn(id: string, newRole: string) {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role: newRole } : p)));
    await supabase.from("profiles").update({ role: newRole }).eq("id", id);
  }
  async function setBookingStatusFn(id: string, status: string) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await supabase.from("booking_requests").update({ status }).eq("id", id);
  }

  const offerById = useMemo(() => Object.fromEntries(offers.map((o) => [o.id, o])) as Record<string, Offer>, [offers]);
  const counts = useMemo(() => ({
    clients: profiles.filter((p) => p.role === "client").length,
    prestataires: profiles.filter((p) => p.role === "prestataire").length,
    offersTotal: offers.length,
    published: offers.filter((o) => o.status === "published").length,
    pending: offers.filter((o) => o.status === "draft").length,
    suspended: offers.filter((o) => o.status === "suspended").length,
    bookingsTotal: bookings.length,
    bookingsPending: bookings.filter((b) => b.status === "pending").length,
  }), [profiles, offers, bookings]);
  const estValue = useMemo(() => bookings.reduce((s, b) => s + ((offerById[b.offer_id]?.price_from ?? 0) * (b.party_size ?? 1)), 0), [bookings, offerById]);

  const last14 = useMemo(() => {
    const days: { day: string; label: string; n: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const day = d.toISOString().slice(0, 10);
      days.push({ day, label: String(d.getDate()), n: bookings.filter((b) => b.created_at?.slice(0, 10) === day).length });
    }
    return days;
  }, [bookings]);
  const maxDay = Math.max(1, ...last14.map((d) => d.n));

  const topOffers = useMemo(() => offers.map((o) => ({ o, n: bookings.filter((b) => b.offer_id === o.id).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 5), [offers, bookings]);
  const avgBudget = runs.length ? Math.round(runs.reduce((s, r) => s + r.budget, 0) / runs.length) : 0;
  const budgetBuckets = useMemo(() => {
    const defs: [number, number, string][] = [[0, 60, "≤ 60 $"], [60, 120, "60–120 $"], [120, 200, "120–200 $"], [200, 300, "200–300 $"], [300, 1e9, "300 $ +"]];
    return defs.map(([lo, hi, label]) => ({ label, n: runs.filter((r) => r.budget >= lo && r.budget < hi).length }));
  }, [runs]);
  const ctxCounts = useMemo(() => Object.keys(CTX).map((k) => ({ k, n: runs.filter((r) => r.context === k).length })), [runs]);

  const fOffers = offers.filter((o) => (offerStatus === "all" || o.status === offerStatus) && (offerQuery === "" || o.title_fr.toLowerCase().includes(offerQuery.toLowerCase()) || (o.location ?? "").toLowerCase().includes(offerQuery.toLowerCase())));
  const fProfiles = profiles.filter((p) => (userRoleF === "all" || p.role === userRoleF) && (userQuery === "" || (p.display_name ?? "").toLowerCase().includes(userQuery.toLowerCase()) || p.id.includes(userQuery)));
  const fBookings = bookings.filter((b) => bookingF === "all" || b.status === bookingF);
  const offerName = (id: string) => offerById[id]?.title_fr ?? id.slice(0, 8);

  const pill = (active: boolean) => `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${active ? "gradient-navy text-cream" : "bg-surface text-navy/60 hover:text-navy border border-black/5"}`;

  const tabs: { key: Tab; fr: string; en: string; Icon: typeof Store; badge?: number }[] = [
    { key: "overview", fr: "Vue d'ensemble", en: "Overview", Icon: LayoutDashboard },
    { key: "moderation", fr: "Modération", en: "Moderation", Icon: Store, badge: counts.pending },
    { key: "users", fr: "Utilisateurs", en: "Users", Icon: Users },
    { key: "bookings", fr: "Réservations", en: "Bookings", Icon: CalendarCheck, badge: counts.bookingsPending },
    { key: "analytics", fr: "Analyses", en: "Analytics", Icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
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
            <p className="text-navy/65 text-sm">{fr ? "Ton compte n'a pas le rôle admin." : "Your account isn't an admin."}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1 mb-8 border-b border-black/5">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t.key ? "border-gold text-navy" : "border-transparent text-navy/45 hover:text-navy"}`}>
                  <t.Icon className="w-4 h-4" strokeWidth={1.75} /> {fr ? t.fr : t.en}
                  {t.badge ? <span className="bg-gold text-navy text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">{t.badge}</span> : null}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: fr ? "Utilisateurs" : "Users", value: profiles.length, sub: `${counts.clients} ${fr ? "clients" : "clients"} · ${counts.prestataires} ${fr ? "prest." : "providers"}` },
                    { label: fr ? "Offres en ligne" : "Live offers", value: counts.published, sub: `${counts.pending} ${fr ? "en attente" : "pending"}` },
                    { label: fr ? "Réservations" : "Bookings", value: counts.bookingsTotal, sub: `${counts.bookingsPending} ${fr ? "en attente" : "pending"}` },
                    { label: fr ? "Valeur estimée" : "Est. value", value: `$${estValue}`, sub: fr ? "des réservations" : "of bookings" },
                  ].map((s) => (
                    <div key={s.label} className="bg-surface border border-black/5 rounded-2xl p-5">
                      <p className="font-serif text-3xl font-bold text-navy">{s.value}</p>
                      <p className="text-navy/55 text-sm mt-1">{s.label}</p>
                      <p className="text-navy/40 text-xs mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Panel title={fr ? "Réservations · 14 derniers jours" : "Bookings · last 14 days"}>
                    <div className="flex items-end gap-1 h-28">
                      {last14.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-1" title={`${d.day}: ${d.n}`}>
                          <div className="w-full gradient-gold rounded-t" style={{ height: `${(d.n / maxDay) * 100}%`, minHeight: 2, opacity: d.n > 0 ? 1 : 0.2 }} />
                          <span className="text-[9px] text-navy/40">{d.label}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                  <Panel title={fr ? "Offres par statut" : "Offers by status"}>
                    <div className="space-y-2.5">
                      <BarRow label={fr ? "En ligne" : "Live"} n={counts.published} max={counts.offersTotal} color="bg-green-500/70" />
                      <BarRow label={fr ? "En attente" : "Pending"} n={counts.pending} max={counts.offersTotal} color="bg-amber-500/70" />
                      <BarRow label={fr ? "Suspendu" : "Suspended"} n={counts.suspended} max={counts.offersTotal} color="bg-red-500/60" />
                    </div>
                  </Panel>
                  <Panel title={fr ? "Top offres (réservations)" : "Top offers (bookings)"}>
                    {topOffers.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de réservations." : "No bookings yet."}</p> : (
                      <div className="space-y-2.5">{topOffers.map(({ o, n }) => <BarRow key={o.id} label={o.title_fr} n={n} max={topOffers[0].n} />)}</div>
                    )}
                  </Panel>
                  <Panel title={fr ? "Budgets demandés (Compositeur)" : "Requested budgets (Composer)"}>
                    {runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de données budget." : "No budget data yet."}</p> : (
                      <>
                        <p className="text-navy/55 text-xs mb-3">{fr ? "Budget moyen" : "Average budget"} : <span className="font-bold text-navy">${avgBudget}</span> · {runs.length} {fr ? "recherches" : "runs"}</p>
                        <div className="space-y-2.5">{budgetBuckets.map((b) => <BarRow key={b.label} label={b.label} n={b.n} max={Math.max(1, ...budgetBuckets.map((x) => x.n))} />)}</div>
                      </>
                    )}
                  </Panel>
                </div>
              </div>
            )}

            {tab === "moderation" && (
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="flex gap-1.5">
                    {["all", "draft", "published", "suspended"].map((s) => (
                      <button key={s} onClick={() => setOfferStatus(s)} className={pill(offerStatus === s)}>
                        {s === "all" ? (fr ? "Toutes" : "All") : OSTATUS[s]?.[locale] ?? s}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1 min-w-[160px] max-w-xs">
                    <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input value={offerQuery} onChange={(e) => setOfferQuery(e.target.value)} placeholder={fr ? "Chercher une offre…" : "Search an offer…"} className="w-full border border-black/10 rounded-full pl-9 pr-3 py-2 text-sm text-navy" />
                  </div>
                </div>
                {fOffers.length === 0 ? <p className="text-navy/50">{fr ? "Aucune offre." : "No offers."}</p> : (
                  <div className="space-y-3">
                    {fOffers.map((o) => (
                      <div key={o.id} className="flex items-center gap-4 bg-surface border border-black/5 rounded-2xl p-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy truncate">{o.title_fr}</h3>
                          <p className="text-navy/45 text-xs truncate flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {o.location} · ${o.price_from}</p>
                        </div>
                        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${OSTATUS[o.status]?.cls ?? "bg-navy/10 text-navy/60"}`}>{OSTATUS[o.status]?.[locale] ?? o.status}</span>
                        <div className="flex gap-2 shrink-0">
                          {o.status !== "published" && <button onClick={() => setOfferStatusFn(o.id, "published")} className="inline-flex items-center gap-1 text-green-700 hover:bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Publier" : "Publish"}</button>}
                          {o.status === "published" && <button onClick={() => setOfferStatusFn(o.id, "suspended")} className="inline-flex items-center gap-1 text-red-600 hover:bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><PauseCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Suspendre" : "Suspend"}</button>}
                          {o.status === "suspended" && <button onClick={() => setOfferStatusFn(o.id, "draft")} className="inline-flex items-center gap-1 text-navy/60 hover:bg-navy/5 border border-black/10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "En attente" : "Pending"}</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "users" && (
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="flex gap-1.5">
                    {["all", ...ROLES].map((s) => (
                      <button key={s} onClick={() => setUserRoleF(s)} className={pill(userRoleF === s)}>{s === "all" ? (fr ? "Tous" : "All") : s}</button>
                    ))}
                  </div>
                  <div className="relative flex-1 min-w-[160px] max-w-xs">
                    <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder={fr ? "Chercher un utilisateur…" : "Search a user…"} className="w-full border border-black/10 rounded-full pl-9 pr-3 py-2 text-sm text-navy" />
                  </div>
                </div>
                {fProfiles.length === 0 ? <p className="text-navy/50">{fr ? "Aucun utilisateur." : "No users."}</p> : (
                  <div className="space-y-2">
                    {fProfiles.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                        <span className="flex-1 min-w-0 truncate text-navy text-sm">{p.display_name || p.id.slice(0, 8)}</span>
                        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${ROLE_CLS[p.role] ?? "bg-black/5 text-navy/60"}`}>{p.role}</span>
                        <select value={p.role} onChange={(e) => setUserRoleFn(p.id, e.target.value)} className="shrink-0 border border-black/10 rounded-lg px-2 py-1 text-xs text-navy bg-white" aria-label={fr ? "Changer le rôle" : "Change role"}>
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    ))}
                    <p className="text-navy/40 text-xs mt-2">{fr ? "Change le rôle directement dans le menu déroulant." : "Change a role directly with the dropdown."}</p>
                  </div>
                )}
              </div>
            )}

            {tab === "bookings" && (
              <div>
                <div className="flex gap-1.5 mb-5">
                  {["all", "pending", "confirmed", "declined"].map((s) => (
                    <button key={s} onClick={() => setBookingF(s)} className={pill(bookingF === s)}>{s === "all" ? (fr ? "Toutes" : "All") : BSTATUS[s]?.[locale] ?? s}</button>
                  ))}
                </div>
                {fBookings.length === 0 ? <p className="text-navy/50">{fr ? "Aucune réservation." : "No bookings."}</p> : (
                  <div className="space-y-2">
                    {fBookings.map((b) => (
                      <div key={b.id} className="flex items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-navy text-sm truncate">{b.guest_name || "—"} · {b.party_size ?? 1} {fr ? "pers." : "guests"}</p>
                          <p className="text-navy/45 text-xs truncate">{offerName(b.offer_id)}</p>
                        </div>
                        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${BSTATUS[b.status]?.cls ?? "bg-navy/10 text-navy/70"}`}>{BSTATUS[b.status]?.[locale] ?? b.status}</span>
                        {b.status === "pending" && (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setBookingStatusFn(b.id, "confirmed")} className="inline-flex items-center gap-1 text-green-700 hover:bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Confirmer" : "Confirm"}</button>
                            <button onClick={() => setBookingStatusFn(b.id, "declined")} className="inline-flex items-center gap-1 text-red-600 hover:bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><XCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Refuser" : "Decline"}</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "analytics" && (
              <div className="grid md:grid-cols-2 gap-5">
                <Panel title={fr ? "Budgets des clients" : "Client budgets"}>
                  {runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Aucune donnée encore. Les budgets choisis dans le Compositeur s'afficheront ici." : "No data yet. Budgets chosen in the Composer will appear here."}</p> : (
                    <>
                      <p className="text-navy/55 text-xs mb-3">{fr ? "Budget moyen demandé" : "Average requested budget"} : <span className="font-bold text-navy">${avgBudget}</span> · {runs.length} {fr ? "recherches" : "runs"}</p>
                      <div className="space-y-2.5">{budgetBuckets.map((b) => <BarRow key={b.label} label={b.label} n={b.n} max={Math.max(1, ...budgetBuckets.map((x) => x.n))} />)}</div>
                    </>
                  )}
                </Panel>
                <Panel title={fr ? "Type de sortie demandé" : "Requested outing type"}>
                  {runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Aucune donnée encore." : "No data yet."}</p> : (
                    <div className="space-y-2.5">{ctxCounts.map((c) => <BarRow key={c.k} label={CTX[c.k]} n={c.n} max={Math.max(1, ...ctxCounts.map((x) => x.n))} />)}</div>
                  )}
                </Panel>
                <Panel title={fr ? "Valeur des réservations" : "Booking value"}>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="font-serif text-2xl font-bold text-navy">${estValue}</p><p className="text-navy/50 text-xs">{fr ? "valeur estimée totale" : "total est. value"}</p></div>
                    <div><p className="font-serif text-2xl font-bold text-navy">${counts.bookingsTotal ? Math.round(estValue / counts.bookingsTotal) : 0}</p><p className="text-navy/50 text-xs">{fr ? "par réservation" : "per booking"}</p></div>
                  </div>
                </Panel>
                <Panel title={fr ? "Top offres (réservations)" : "Top offers (bookings)"}>
                  {topOffers.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de réservations." : "No bookings yet."}</p> : (
                    <div className="space-y-2.5">{topOffers.map(({ o, n }) => <BarRow key={o.id} label={o.title_fr} n={n} max={topOffers[0].n} />)}</div>
                  )}
                </Panel>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
