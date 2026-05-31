"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2, Mail, ShieldCheck, CheckCircle2, PauseCircle, RotateCcw,
  LayoutDashboard, Store, Users, CalendarCheck, BarChart3, Search, XCircle, MapPin,
  Megaphone, Star, Copy, Check, Tag, Plus, Trash2, Download, Target, Bell, Flag,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import GoogleSignIn from "@/components/GoogleSignIn";
import EmailPasswordAuth from "@/components/EmailPasswordAuth";
import BannerManager from "@/components/BannerManager";
import ReportsManager from "@/components/ReportsManager";
import picnicParks from "@/data/picnic-parks.json";
import picnicOptions from "@/data/picnic-options.json";
import picnicActivities from "@/data/activities-picnic.json";

interface Offer { id: string; title_fr: string; location: string | null; price_from: number; status: string; owner: string; created_at: string; featured: boolean; }
interface Profile { id: string; role: string; display_name: string | null; created_at: string; }
interface Booking { id: string; offer_id: string; guest_name: string | null; party_size: number | null; status: string; created_at: string; requested_for: string | null; }
interface Run { budget: number; context: string; fits: boolean; created_at: string; categories: string[] | null; }
interface Promo { id: number; code: string; description: string | null; percent_off: number; active: boolean; uses: number; created_at: string; }

const SITE = "https://wheretogoyeg.ca";
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
const PAGES = ["/", "/evenements", "/compositeur", "/reserver", "/idees", "/couples", "/famille"];
const SOURCES = ["instagram", "facebook", "tiktok", "email", "google", "autre"];

type Tab = "overview" | "moderation" | "marketing" | "promos" | "content" | "picnic" | "reports" | "users" | "bookings" | "analytics";
type DatePreset = "7d" | "30d" | "90d" | "365d";
type BadgeKey = "pending" | "bookingsPending";

const DATE_PRESETS: { value: DatePreset; days: number; fr: string; en: string }[] = [
  { value: "7d",   days: 7,   fr: "7 derniers jours",  en: "Last 7 days" },
  { value: "30d",  days: 30,  fr: "30 derniers jours", en: "Last 30 days" },
  { value: "90d",  days: 90,  fr: "90 derniers jours", en: "Last 90 days" },
  { value: "365d", days: 365, fr: "12 derniers mois",  en: "Last 12 months" },
];

const NAV: Array<{
  group: { fr: string; en: string } | null;
  items: Array<{ key: Tab; fr: string; en: string; Icon: typeof Store; badgeKey?: BadgeKey }>;
}> = [
  { group: null, items: [
    { key: "overview", fr: "Vue d'ensemble", en: "Overview", Icon: LayoutDashboard },
  ]},
  { group: { fr: "Données", en: "Data" }, items: [
    { key: "bookings",  fr: "Réservations", en: "Bookings",  Icon: CalendarCheck, badgeKey: "bookingsPending" },
    { key: "users",     fr: "Utilisateurs", en: "Users",     Icon: Users },
    { key: "analytics", fr: "Analyses",     en: "Analytics", Icon: BarChart3 },
  ]},
  { group: { fr: "Gestion", en: "Manage" }, items: [
    { key: "moderation", fr: "Modération",   en: "Moderation",  Icon: Store, badgeKey: "pending" },
    { key: "reports",    fr: "Signalements", en: "Reports",     Icon: Flag },
    { key: "promos",     fr: "Codes promo",  en: "Promo codes", Icon: Tag },
    { key: "content",    fr: "Bannière",     en: "Banner",      Icon: Bell },
    { key: "picnic",     fr: "Pique-nique",  en: "Picnic",      Icon: MapPin },
  ]},
  { group: { fr: "Marketing", en: "Marketing" }, items: [
    { key: "marketing", fr: "Marketing", en: "Marketing", Icon: Megaphone },
  ]},
];

function budgetLabel(b: number) {
  if (b < 60) return "≤ 60 $"; if (b < 120) return "60–120 $"; if (b < 200) return "120–200 $"; if (b < 300) return "200–300 $"; return "300 $ +";
}
function downloadCSV(name: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

function BarRow({ label, n, max, color = "gradient-gold" }: { label: string; n: number; max: number; color?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 text-navy/65 truncate">{label}</span>
      <div className="flex-1 bg-black/5 rounded-full h-2.5 overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{ width: `${max ? (n / max) * 100 : 0}%` }} /></div>
      <span className="w-8 text-right text-navy font-semibold">{n}</span>
    </div>
  );
}
function Panel({ children, title }: { children: React.ReactNode; title?: string }) {
  return <div className="bg-surface border border-black/5 rounded-2xl p-5">{title && <h3 className="font-semibold text-navy mb-4 text-sm">{title}</h3>}{children}</div>;
}

function Sparkline({ values, color = "navy" }: { values: number[]; color?: "navy" | "gold" | "green" | "red" }) {
  const w = 100, h = 28;
  const colorCls = { navy: "text-navy/70", gold: "text-gold", green: "text-green-600", red: "text-red-500" }[color];
  if (!values.length || values.every((v) => v === 0)) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7 text-navy/15" preserveAspectRatio="none">
        <line x1="0" y1={h - 1} x2={w} y2={h - 1} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${h - (v / max) * (h - 2) - 1}`).join(" ");
  const fillPts = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full h-7 ${colorCls}`} preserveAspectRatio="none">
      <polygon points={fillPts} fill="currentColor" fillOpacity="0.1" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function formatValue(v: number, suffix: string) {
  if (suffix === "$") return `$${Math.round(v).toLocaleString("fr-CA")}`;
  return v.toLocaleString("fr-CA") + suffix;
}

function StatCard({ title, value, previous, spark, compare, fr, suffix = "" }: {
  title: string; value: number; previous: number | null; spark: number[]; compare: boolean; fr: boolean; suffix?: string;
}) {
  let change: number | null = null;
  if (compare && previous !== null && previous > 0) change = Math.round(((value - previous) / previous) * 100);
  else if (compare && previous === 0 && value > 0) change = 100; // surge from zero
  const flat = compare && previous === 0 && value === 0;
  const positive = change !== null && change > 0;
  const negative = change !== null && change < 0;
  const Trend = positive ? TrendingUp : negative ? TrendingDown : Minus;
  const sparkColor: "navy" | "green" | "red" = positive ? "green" : negative ? "red" : "navy";
  return (
    <div className="bg-surface border border-black/5 rounded-2xl p-5 flex flex-col gap-2">
      <p className="text-sm text-navy/55">{title}</p>
      <p className="font-serif text-3xl font-bold text-navy leading-none">{formatValue(value, suffix)}</p>
      {compare && (
        <div className="flex items-center gap-2 text-xs min-h-[18px]">
          {flat ? (
            <span className="text-navy/40">{fr ? "Pas de données" : "No data"}</span>
          ) : change !== null ? (
            <>
              <span className={`inline-flex items-center gap-0.5 font-semibold ${positive ? "text-green-700" : negative ? "text-red-600" : "text-navy/50"}`}>
                <Trend className="w-3 h-3" strokeWidth={2} />{positive ? "+" : ""}{change}%
              </span>
              <span className="text-navy/45">{fr ? "vs période préc." : "vs prev. period"}</span>
            </>
          ) : (
            <span className="text-navy/40">{fr ? "Période préc. : 0" : "Prev. period: 0"}</span>
          )}
        </div>
      )}
      <div className="mt-1"><Sparkline values={spark} color={sparkColor} /></div>
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
  const [runsLoading, setRunsLoading] = useState(true);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [offerStatus, setOfferStatus] = useState("all");
  const [offerQuery, setOfferQuery] = useState("");
  const [userRoleF, setUserRoleF] = useState("all");
  const [userQuery, setUserQuery] = useState("");
  const [bookingF, setBookingF] = useState("all");
  const [utmPage, setUtmPage] = useState("/");
  const [utmSource, setUtmSource] = useState("instagram");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [shareOffer, setShareOffer] = useState("");
  const [copied, setCopied] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newPct, setNewPct] = useState(15);
  const [newDesc, setNewDesc] = useState("");
  const [dateRange, setDateRange] = useState<DatePreset>("7d");
  const [compare, setCompare] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (!data.session) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const next = s?.user ?? null;
      setUser((prev) => (prev?.id === next?.id ? prev : next));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadAdmin = useCallback(async (uid: string) => {
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", uid).single();
    const r = (prof as { role?: string } | null)?.role ?? "client";
    setRole(r);
    if (r === "admin") {
      setRunsLoading(true);
      supabase.from("composer_runs").select("budget,context,fits,created_at,categories").order("created_at", { ascending: false }).limit(1000)
        .then(({ data }) => { setRuns((data as Run[]) ?? []); setRunsLoading(false); });

      const [o, p, b, pc] = await Promise.all([
        supabase.from("offers").select("id,title_fr,location,price_from,status,owner,created_at,featured").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id,role,display_name,created_at").order("created_at", { ascending: false }),
        supabase.from("booking_requests").select("id,offer_id,guest_name,party_size,status,created_at,requested_for").order("created_at", { ascending: false }),
        supabase.from("promo_codes").select("*").order("created_at", { ascending: false }),
      ]);
      setOffers((o.data as Offer[]) ?? []);
      setProfiles((p.data as Profile[]) ?? []);
      setBookings((b.data as Booking[]) ?? []);
      setPromos((pc.data as Promo[]) ?? []);
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
  async function setOfferStatusFn(id: string, status: string) { setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))); await supabase.from("offers").update({ status }).eq("id", id); }
  async function setFeaturedFn(id: string, featured: boolean) { setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, featured } : o))); await supabase.from("offers").update({ featured }).eq("id", id); }
  async function setUserRoleFn(id: string, newRole: string) { setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role: newRole } : p))); await supabase.from("profiles").update({ role: newRole }).eq("id", id); }
  async function setBookingStatusFn(id: string, status: string) { setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b))); await supabase.from("booking_requests").update({ status }).eq("id", id); }
  function copy(text: string, key: string) { navigator.clipboard?.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(""), 1800); }).catch(() => {}); }
  async function createPromo() {
    const code = newCode.trim().toUpperCase();
    if (!code) return;
    const { data, error } = await supabase.from("promo_codes").insert({ code, percent_off: newPct, description: newDesc.trim() || null }).select("*").single();
    if (!error && data) { setPromos((prev) => [data as Promo, ...prev]); setNewCode(""); setNewDesc(""); }
  }
  async function togglePromo(id: number, active: boolean) { setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p))); await supabase.from("promo_codes").update({ active }).eq("id", id); }
  async function deletePromo(id: number) { setPromos((prev) => prev.filter((p) => p.id !== id)); await supabase.from("promo_codes").delete().eq("id", id); }

  const offerById = useMemo(() => Object.fromEntries(offers.map((o) => [o.id, o])) as Record<string, Offer>, [offers]);
  const counts = useMemo(() => ({
    clients: profiles.filter((p) => p.role === "client").length,
    prestataires: profiles.filter((p) => p.role === "prestataire").length,
    offersTotal: offers.length, published: offers.filter((o) => o.status === "published").length,
    pending: offers.filter((o) => o.status === "draft").length, suspended: offers.filter((o) => o.status === "suspended").length,
    featured: offers.filter((o) => o.featured).length,
    bookingsTotal: bookings.length, bookingsPending: bookings.filter((b) => b.status === "pending").length,
  }), [profiles, offers, bookings]);
  const estValue = useMemo(() => bookings.reduce((s, b) => s + ((offerById[b.offer_id]?.price_from ?? 0) * (b.party_size ?? 1)), 0), [bookings, offerById]);
  const topOffers = useMemo(() => offers.map((o) => ({ o, n: bookings.filter((b) => b.offer_id === o.id).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 5), [offers, bookings]);
  const avgBudget = runs.length ? Math.round(runs.reduce((s, r) => s + r.budget, 0) / runs.length) : 0;
  const matchRate = runs.length ? Math.round((runs.filter((r) => r.fits).length / runs.length) * 100) : 0;
  const budgetBuckets = useMemo(() => {
    const defs: [number, number, string][] = [[0, 60, "≤ 60 $"], [60, 120, "60–120 $"], [120, 200, "120–200 $"], [200, 300, "200–300 $"], [300, 1e9, "300 $ +"]];
    return defs.map(([lo, hi, label]) => ({ label, n: runs.filter((r) => r.budget >= lo && r.budget < hi).length }));
  }, [runs]);
  const ctxCounts = useMemo(() => Object.keys(CTX).map((k) => ({ k, n: runs.filter((r) => r.context === k).length })), [runs]);
  const failedCombos = useMemo(() => {
    const m = new Map<string, number>();
    runs.filter((r) => !r.fits).forEach((r) => { const k = `${CTX[r.context] ?? r.context} · ${budgetLabel(r.budget)}`; m.set(k, (m.get(k) ?? 0) + 1); });
    return [...m.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n).slice(0, 6);
  }, [runs]);
  const topCombos = useMemo(() => {
    const m = new Map<string, number>();
    runs.forEach((r) => { if (!r.categories || r.categories.length === 0) return; const k = [...r.categories].sort().join(" + "); m.set(k, (m.get(k) ?? 0) + 1); });
    return [...m.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n).slice(0, 6);
  }, [runs]);
  const topBudget = useMemo(() => [...budgetBuckets].sort((a, b) => b.n - a.n)[0], [budgetBuckets]);
  const topCtx = useMemo(() => [...ctxCounts].sort((a, b) => b.n - a.n)[0], [ctxCounts]);

  // ----- Date-window metrics for KPI cards -----
  const periodDays = useMemo(() => DATE_PRESETS.find((p) => p.value === dateRange)?.days ?? 7, [dateRange]);
  const kpis = useMemo(() => {
    const dayMs = 86400000;
    const nowMs = Date.now();
    const currentStart = nowMs - periodDays * dayMs;
    const previousStart = nowMs - 2 * periodDays * dayMs;
    function inCurrent(iso: string) { const t = new Date(iso).getTime(); return t >= currentStart && t <= nowMs; }
    function inPrevious(iso: string) { const t = new Date(iso).getTime(); return t >= previousStart && t < currentStart; }
    function dailyOf<T extends { created_at: string }>(items: T[], valueOf?: (x: T) => number): number[] {
      const arr = new Array(periodDays).fill(0);
      items.forEach((x) => {
        const t = new Date(x.created_at).getTime();
        const dayIdx = Math.floor((nowMs - t) / dayMs);
        if (dayIdx >= 0 && dayIdx < periodDays) arr[periodDays - 1 - dayIdx] += valueOf ? valueOf(x) : 1;
      });
      return arr;
    }
    const curB = bookings.filter((b) => inCurrent(b.created_at));
    const prvB = bookings.filter((b) => inPrevious(b.created_at));
    const curP = profiles.filter((p) => inCurrent(p.created_at));
    const prvP = profiles.filter((p) => inPrevious(p.created_at));
    const curR = runs.filter((r) => inCurrent(r.created_at));
    const prvR = runs.filter((r) => inPrevious(r.created_at));
    const valueOf = (b: Booking) => (offerById[b.offer_id]?.price_from ?? 0) * (b.party_size ?? 1);
    return {
      bookings: { current: curB.length, previous: prvB.length, spark: dailyOf(curB) },
      value:    { current: curB.reduce((s, b) => s + valueOf(b), 0), previous: prvB.reduce((s, b) => s + valueOf(b), 0), spark: dailyOf(curB, valueOf) },
      users:    { current: curP.length, previous: prvP.length, spark: dailyOf(curP) },
      runs:     { current: curR.length, previous: prvR.length, spark: dailyOf(curR) },
    };
  }, [bookings, profiles, runs, offerById, periodDays]);

  const fOffers = offers.filter((o) => (offerStatus === "all" || o.status === offerStatus) && (offerQuery === "" || o.title_fr.toLowerCase().includes(offerQuery.toLowerCase()) || (o.location ?? "").toLowerCase().includes(offerQuery.toLowerCase())));
  const fProfiles = profiles.filter((p) => (userRoleF === "all" || p.role === userRoleF) && (userQuery === "" || (p.display_name ?? "").toLowerCase().includes(userQuery.toLowerCase()) || p.id.includes(userQuery)));
  const fBookings = bookings.filter((b) => bookingF === "all" || b.status === bookingF);
  const publishedOffers = offers.filter((o) => o.status === "published");
  const offerName = (id: string) => offerById[id]?.title_fr ?? id.slice(0, 8);
  const pill = (active: boolean) => `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${active ? "gradient-navy text-cream" : "bg-surface text-navy/60 hover:text-navy border border-black/5"}`;
  const utmUrl = `${SITE}${utmPage === "/" ? "" : utmPage}?utm_source=${utmSource}&utm_medium=${utmSource === "email" ? "email" : "social"}&utm_campaign=${encodeURIComponent(utmCampaign.trim() || "campagne")}`;
  const shareTitle = publishedOffers.find((o) => o.id === shareOffer)?.title_fr ?? publishedOffers[0]?.title_fr ?? "";
  const shareCaption = shareTitle ? `${shareTitle} — réserve ta sortie à Edmonton sur Where To Go YEG : ${SITE}/reserver?utm_source=${utmSource}&utm_medium=social&utm_campaign=offre  #yeg #edmonton` : "";

  function exportBookings() { downloadCSV("reservations.csv", ["Client", "Personnes", "Statut", "Offre", "Date"], bookings.map((b) => [b.guest_name ?? "", b.party_size ?? 1, b.status, offerName(b.offer_id), b.created_at?.slice(0, 10) ?? ""])); }
  function exportUsers() { downloadCSV("utilisateurs.csv", ["Nom", "Rôle", "Inscrit le"], profiles.map((p) => [p.display_name ?? p.id, p.role, p.created_at?.slice(0, 10) ?? ""])); }

  const allItems = useMemo(() => NAV.flatMap((g) => g.items), []);
  const currentNav = allItems.find((i) => i.key === tab);
  function badgeOf(key?: BadgeKey) {
    if (key === "pending") return counts.pending;
    if (key === "bookingsPending") return counts.bookingsPending;
    return 0;
  }

  // ---------- LOADING / AUTH / ROLE GATES ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex items-center gap-2 text-navy/50"><Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} /> {fr ? "Chargement…" : "Loading…"}</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream py-16 px-4">
        <div className="max-w-md w-full bg-surface border border-black/5 rounded-3xl p-8">
          <div className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-3 py-1.5 text-sm mb-6"><ShieldCheck className="w-4 h-4 text-gold" strokeWidth={1.75} /> {fr ? "Console admin" : "Admin console"}</div>
          <Mail className="w-8 h-8 text-gold mb-4" strokeWidth={1.5} />
          <h2 className="font-serif text-2xl font-bold text-navy mb-2">{fr ? "Connexion admin" : "Admin sign in"}</h2>
          <EmailPasswordAuth />
          <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-black/10" /></div>
          <GoogleSignIn redirectTo="/admin" label={fr ? "Continuer avec Google" : "Continue with Google"} />
          <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou par email" : "or by email"}<span className="h-px flex-1 bg-black/10" /></div>
          {emailSent ? <p className="text-navy/65">{fr ? "Lien envoyé ! Vérifie ta boîte mail." : "Link sent! Check your inbox."}</p> : (
            <form onSubmit={sendMagicLink} className="flex flex-col gap-3 mt-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={fr ? "ton@email.com" : "you@email.com"} className="w-full border border-black/10 rounded-full px-5 py-3 text-navy" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"><Mail className="w-4 h-4" strokeWidth={2} /> {fr ? "Recevoir mon lien" : "Send my link"}</button>
            </form>
          )}
        </div>
      </div>
    );
  }
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream py-16 px-4">
        <div className="max-w-xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-navy mb-2">{fr ? "Accès réservé aux administrateurs" : "Admins only"}</h2>
          <p className="text-navy/65 text-sm">{fr ? "Ton compte n'a pas le rôle admin." : "Your account isn't an admin."}</p>
        </div>
      </div>
    );
  }

  // ---------- ADMIN APP ----------
  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-surface border-r border-black/5 sticky top-0 h-screen overflow-y-auto p-5">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 bg-navy text-cream rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider mb-3"><ShieldCheck className="w-3 h-3 text-gold" strokeWidth={2.25} /> ADMIN</div>
          <p className="font-serif font-bold text-navy text-lg leading-tight">Where To Go<span className="text-gold">·</span>YEG</p>
        </div>
        <nav className="space-y-0.5 flex-1">
          {NAV.map((group, gi) => (
            <div key={gi}>
              {group.group && <p className="text-[10px] font-semibold uppercase tracking-widest text-navy/35 mt-4 mb-1.5 px-3">{fr ? group.group.fr : group.group.en}</p>}
              {group.items.map((item) => {
                const active = tab === item.key;
                const b = badgeOf(item.badgeKey);
                return (
                  <button key={item.key} onClick={() => setTab(item.key)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-navy text-cream" : "text-navy/65 hover:text-navy hover:bg-black/5"}`}>
                    <item.Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span className="flex-1 text-left">{fr ? item.fr : item.en}</span>
                    {b > 0 && <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none ${active ? "bg-gold text-navy" : "bg-gold/80 text-navy"}`}>{b}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <p className="text-navy/30 text-[10px] mt-4">© {new Date().getFullYear()} · Edmonton, AB</p>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top toolbar */}
        <div className="border-b border-black/5 bg-surface px-4 sm:px-8 py-4 flex flex-wrap items-center gap-3 sticky top-0 z-10">
          {/* Mobile: select for tab navigation */}
          <select value={tab} onChange={(e) => setTab(e.target.value as Tab)} className="md:hidden flex-1 min-w-[140px] border border-black/10 rounded-lg px-3 py-2 text-sm bg-white text-navy font-medium">
            {NAV.map((group, gi) => (
              <optgroup key={gi} label={group.group ? (fr ? group.group.fr : group.group.en) : "—"}>
                {group.items.map((i) => <option key={i.key} value={i.key}>{fr ? i.fr : i.en}{badgeOf(i.badgeKey) > 0 ? ` (${badgeOf(i.badgeKey)})` : ""}</option>)}
              </optgroup>
            ))}
          </select>
          {/* Desktop: page title */}
          <h1 className="hidden md:block font-serif text-xl sm:text-2xl font-bold text-navy">{currentNav ? (fr ? currentNav.fr : currentNav.en) : ""}</h1>
          {/* Date range + Compare (overview only) */}
          {tab === "overview" && (
            <div className="md:ml-auto flex items-center gap-2 flex-wrap">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value as DatePreset)} className="border border-black/10 rounded-lg px-3 py-1.5 text-sm bg-white text-navy">
                {DATE_PRESETS.map((p) => <option key={p.value} value={p.value}>{fr ? p.fr : p.en}</option>)}
              </select>
              <label className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-navy/70 cursor-pointer select-none">
                <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="accent-navy w-4 h-4" />
                {fr ? "Comparer" : "Compare"}
              </label>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8">
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title={fr ? "Réservations" : "Bookings"} value={kpis.bookings.current} previous={compare ? kpis.bookings.previous : null} spark={kpis.bookings.spark} compare={compare} fr={fr} />
                <StatCard title={fr ? "Valeur estimée" : "Estimated value"} value={kpis.value.current} previous={compare ? kpis.value.previous : null} spark={kpis.value.spark} compare={compare} fr={fr} suffix="$" />
                <StatCard title={fr ? "Nouveaux utilisateurs" : "New users"} value={kpis.users.current} previous={compare ? kpis.users.previous : null} spark={kpis.users.spark} compare={compare} fr={fr} />
                <StatCard title={fr ? "Recherches Compositeur" : "Composer searches"} value={kpis.runs.current} previous={compare ? kpis.runs.previous : null} spark={kpis.runs.spark} compare={compare} fr={fr} />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Panel title={fr ? "Offres par statut" : "Offers by status"}>
                  <div className="space-y-2.5">
                    <BarRow label={fr ? "En ligne" : "Live"} n={counts.published} max={counts.offersTotal} color="bg-green-500/70" />
                    <BarRow label={fr ? "En attente" : "Pending"} n={counts.pending} max={counts.offersTotal} color="bg-amber-500/70" />
                    <BarRow label={fr ? "Suspendu" : "Suspended"} n={counts.suspended} max={counts.offersTotal} color="bg-red-500/60" />
                  </div>
                </Panel>
                <Panel title={fr ? "Top offres (réservations)" : "Top offers (bookings)"}>
                  {topOffers.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de réservations." : "No bookings yet."}</p> : <div className="space-y-2.5">{topOffers.map(({ o, n }) => <BarRow key={o.id} label={o.title_fr} n={n} max={topOffers[0].n} />)}</div>}
                </Panel>
                <Panel title={fr ? "Compositeur : taux de succès" : "Composer: match rate"}>
                  {runsLoading ? <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p> : runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de recherches." : "No searches yet."}</p> : (
                    <div className="flex items-center gap-4">
                      <div><p className="font-serif text-4xl font-bold text-navy">{matchRate}%</p><p className="text-navy/50 text-xs">{fr ? "des recherches trouvent une soirée" : "of searches find a night out"}</p></div>
                      <div className="flex-1 text-xs text-navy/55">{runs.length} {fr ? "recherches · budget moyen" : "runs · avg budget"} ${avgBudget}<br />{runs.filter((r) => !r.fits).length} {fr ? "sans résultat" : "with no result"}</div>
                    </div>
                  )}
                </Panel>
                <Panel title={fr ? "Totaux globaux" : "All-time totals"}>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div><p className="font-serif text-2xl font-bold text-navy">{profiles.length}</p><p className="text-navy/50 text-xs">{fr ? "utilisateurs" : "users"}</p></div>
                    <div><p className="font-serif text-2xl font-bold text-navy">{counts.published}</p><p className="text-navy/50 text-xs">{fr ? "offres en ligne" : "live offers"}</p></div>
                    <div><p className="font-serif text-2xl font-bold text-navy">{counts.bookingsTotal}</p><p className="text-navy/50 text-xs">{fr ? "réservations" : "bookings"}</p></div>
                    <div><p className="font-serif text-2xl font-bold text-navy">${Math.round(estValue).toLocaleString("fr-CA")}</p><p className="text-navy/50 text-xs">{fr ? "valeur estimée totale" : "total est. value"}</p></div>
                  </div>
                </Panel>
                <Panel title={fr ? "Pique-nique (contenu)" : "Picnic (content)"}>
                  <div className="grid grid-cols-3 gap-4 text-center mb-3">
                    <div><p className="font-serif text-2xl font-bold text-navy">{picnicParks.length}</p><p className="text-navy/50 text-xs">{fr ? "parcs" : "parks"}</p></div>
                    <div><p className="font-serif text-2xl font-bold text-navy">{picnicOptions.length}</p><p className="text-navy/50 text-xs">{fr ? "options" : "options"}</p></div>
                    <div><p className="font-serif text-2xl font-bold text-navy">{picnicActivities.length}</p><p className="text-navy/50 text-xs">{fr ? "activités" : "activities"}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button onClick={() => setTab("picnic")} className="inline-flex items-center gap-1 gradient-navy text-cream font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"><MapPin className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Ouvrir l'onglet" : "Open tab"}</button>
                    <a href="/pique-nique" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border border-black/10 text-navy/70 hover:text-navy hover:bg-black/5 font-semibold px-3 py-1.5 rounded-full transition-colors">{fr ? "Voir la page" : "View page"} →</a>
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {tab === "moderation" && (
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex gap-1.5">{["all", "draft", "published", "suspended"].map((s) => <button key={s} onClick={() => setOfferStatus(s)} className={pill(offerStatus === s)}>{s === "all" ? (fr ? "Toutes" : "All") : OSTATUS[s]?.[locale] ?? s}</button>)}</div>
                <div className="relative flex-1 min-w-[160px] max-w-xs"><Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} /><input value={offerQuery} onChange={(e) => setOfferQuery(e.target.value)} placeholder={fr ? "Chercher une offre…" : "Search…"} className="w-full border border-black/10 rounded-full pl-9 pr-3 py-2 text-sm text-navy" /></div>
              </div>
              {fOffers.length === 0 ? <p className="text-navy/50">{fr ? "Aucune offre." : "No offers."}</p> : (
                <div className="space-y-3">{fOffers.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center gap-3 bg-surface border border-black/5 rounded-2xl p-4">
                    <div className="flex-1 min-w-[160px]"><h3 className="font-semibold text-navy truncate flex items-center gap-1.5">{o.featured && <Star className="w-3.5 h-3.5 text-gold shrink-0" fill="currentColor" strokeWidth={0} />}{o.title_fr}</h3><p className="text-navy/45 text-xs truncate flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {o.location} · ${o.price_from}</p></div>
                    <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${OSTATUS[o.status]?.cls ?? "bg-navy/10 text-navy/60"}`}>{OSTATUS[o.status]?.[locale] ?? o.status}</span>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {o.status === "published" && <button onClick={() => setFeaturedFn(o.id, !o.featured)} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${o.featured ? "bg-gold/20 text-[#9a7e34] border-gold/40" : "text-navy/55 border-black/10 hover:bg-black/5"}`}><Star className="w-3.5 h-3.5" strokeWidth={1.75} fill={o.featured ? "currentColor" : "none"} /> {o.featured ? (fr ? "En vedette" : "Featured") : (fr ? "Mettre en avant" : "Feature")}</button>}
                      {o.status !== "published" && <button onClick={() => setOfferStatusFn(o.id, "published")} className="inline-flex items-center gap-1 text-green-700 hover:bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Publier" : "Publish"}</button>}
                      {o.status === "published" && <button onClick={() => setOfferStatusFn(o.id, "suspended")} className="inline-flex items-center gap-1 text-red-600 hover:bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><PauseCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Suspendre" : "Suspend"}</button>}
                      {o.status === "suspended" && <button onClick={() => setOfferStatusFn(o.id, "draft")} className="inline-flex items-center gap-1 text-navy/60 hover:bg-navy/5 border border-black/10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "En attente" : "Pending"}</button>}
                    </div>
                  </div>))}
                </div>
              )}
            </div>
          )}

          {tab === "marketing" && (
            <div className="grid md:grid-cols-2 gap-5">
              <Panel title={fr ? "Ciblage recommandé" : "Recommended targeting"}>
                {runsLoading ? <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p> : runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de données du Compositeur." : "No Composer data yet."}</p> : (
                  <>
                    <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-4"><p className="text-navy/60 text-xs mb-1">{fr ? "D'après la demande réelle" : "Based on real demand"}</p><p className="text-navy font-semibold"><Target className="w-4 h-4 inline text-[#9a7e34] mr-1" strokeWidth={2} />{fr ? "Cible : " : "Target: "}<span className="text-[#9a7e34]">{CTX[topCtx?.k] ?? "—"}</span>{", "}<span className="text-[#9a7e34]">{topBudget?.label ?? "—"}</span></p></div>
                    <div className="space-y-2.5">{ctxCounts.map((c) => <BarRow key={c.k} label={CTX[c.k]} n={c.n} max={Math.max(1, ...ctxCounts.map((x) => x.n))} />)}</div>
                  </>
                )}
              </Panel>
              <Panel title={fr ? "Générateur de lien de campagne" : "Campaign link builder"}>
                <p className="text-navy/55 text-xs mb-3">{fr ? "Crée un lien traçable pour tes pubs." : "Create a trackable link."}</p>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select value={utmPage} onChange={(e) => setUtmPage(e.target.value)} className="flex-1 border border-black/10 rounded-lg px-2 py-2 text-sm text-navy bg-white">{PAGES.map((p) => <option key={p} value={p}>{p}</option>)}</select>
                    <select value={utmSource} onChange={(e) => setUtmSource(e.target.value)} className="flex-1 border border-black/10 rounded-lg px-2 py-2 text-sm text-navy bg-white">{SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                  </div>
                  <input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder={fr ? "nom de campagne (ex: ete2026)" : "campaign name"} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" />
                  <div className="bg-black/5 rounded-lg p-3 text-xs text-navy/70 break-all font-mono">{utmUrl}</div>
                  <button onClick={() => copy(utmUrl, "utm")} className="inline-flex items-center gap-1.5 gradient-navy text-cream text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">{copied === "utm" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied === "utm" ? (fr ? "Copié !" : "Copied!") : (fr ? "Copier le lien" : "Copy link")}</button>
                </div>
              </Panel>
              <Panel title={fr ? "Kit de partage social" : "Social share kit"}>
                {publishedOffers.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Publie une offre pour générer une légende." : "Publish an offer first."}</p> : (
                  <div className="space-y-3">
                    <select value={shareOffer || publishedOffers[0].id} onChange={(e) => setShareOffer(e.target.value)} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy bg-white">{publishedOffers.map((o) => <option key={o.id} value={o.id}>{o.title_fr}</option>)}</select>
                    <textarea readOnly value={shareCaption} rows={4} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy bg-black/5 resize-none" />
                    <button onClick={() => copy(shareCaption, "share")} className="inline-flex items-center gap-1.5 gradient-navy text-cream text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">{copied === "share" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied === "share" ? (fr ? "Copié !" : "Copied!") : (fr ? "Copier la légende" : "Copy caption")}</button>
                  </div>
                )}
              </Panel>
              <Panel title={fr ? "Offres en vedette" : "Featured offers"}>
                {offers.filter((o) => o.featured).length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Aucune. Active la mise en avant dans Modération." : "None. Toggle in Moderation."}</p> : <div className="space-y-2">{offers.filter((o) => o.featured).map((o) => (<div key={o.id} className="flex items-center gap-2 text-sm"><Star className="w-3.5 h-3.5 text-gold shrink-0" fill="currentColor" strokeWidth={0} /><span className="flex-1 truncate text-navy">{o.title_fr}</span><span className="text-navy/50 text-xs">${o.price_from}</span></div>))}</div>}
              </Panel>
            </div>
          )}

          {tab === "promos" && (
            <div className="space-y-5">
              <Panel title={fr ? "Créer un code promo" : "Create a promo code"}>
                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-xs text-navy/60">{fr ? "Code" : "Code"}<input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="FETEDESMERES" className="mt-1 block w-44 border border-black/10 rounded-lg px-3 py-2 text-sm text-navy uppercase" /></label>
                  <label className="text-xs text-navy/60">{fr ? "Réduction %" : "Discount %"}<input type="number" min={1} max={100} value={newPct} onChange={(e) => setNewPct(Number(e.target.value))} className="mt-1 block w-24 border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" /></label>
                  <label className="text-xs text-navy/60 flex-1 min-w-[160px]">{fr ? "Description (optionnel)" : "Description (optional)"}<input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder={fr ? "Spécial fête des Mères" : "Mother's Day special"} className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" /></label>
                  <button onClick={createPromo} className="inline-flex items-center gap-1.5 gradient-gold text-navy font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" strokeWidth={2} /> {fr ? "Créer" : "Create"}</button>
                </div>
              </Panel>
              {promos.length === 0 ? <p className="text-navy/50">{fr ? "Aucun code promo." : "No promo codes."}</p> : (
                <div className="space-y-2">{promos.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                    <span className="font-mono font-bold text-navy bg-gold/15 border border-gold/30 rounded-lg px-2.5 py-1 text-sm">{p.code}</span>
                    <span className="text-navy font-semibold text-sm">−{p.percent_off}%</span>
                    <span className="text-navy/50 text-xs flex-1 min-w-[100px] truncate">{p.description || ""} · {p.uses} {fr ? "utilisations" : "uses"}</span>
                    <button onClick={() => togglePromo(p.id, !p.active)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${p.active ? "bg-green-500/15 text-green-700" : "bg-black/5 text-navy/50"}`}>{p.active ? (fr ? "Actif" : "Active") : (fr ? "Inactif" : "Inactive")}</button>
                    <button onClick={() => deletePromo(p.id)} className="text-navy/40 hover:text-red-500 transition-colors" aria-label={fr ? "Supprimer" : "Delete"}><Trash2 className="w-4 h-4" strokeWidth={1.75} /></button>
                  </div>))}
                </div>
              )}
              <p className="text-navy/40 text-xs">{fr ? "Les codes actifs sont validés au moment du paiement Stripe." : "Active codes are validated at Stripe checkout."}</p>
            </div>
          )}

          {tab === "content" && <BannerManager fr={fr} />}

          {tab === "picnic" && (
            <div className="space-y-6">
              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 text-sm text-navy">
                <p className="font-semibold mb-1">{fr ? "Lecture seule" : "Read-only"}</p>
                <p className="text-navy/70">{fr
                  ? "Cette section affiche le contenu pique-nique (en lecture seule pour l'instant). Pour éditer, modifier les fichiers JSON dans "
                  : "This section shows picnic content (read-only for now). To edit, modify the JSON files in "}
                  <code className="font-mono text-xs bg-black/5 px-1.5 py-0.5 rounded">src/data/picnic-*.json</code>.
                </p>
                {/* TODO: migrate picnic-parks/options/activities to Supabase tables so admins can edit from this UI */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-black/5 rounded-2xl p-5">
                  <p className="text-sm text-navy/55">{fr ? "Parcs" : "Parks"}</p>
                  <p className="font-serif text-3xl font-bold text-navy leading-none mt-1">{picnicParks.length}</p>
                  <p className="text-navy/45 text-xs mt-2">{fr ? "Edmonton" : "Edmonton"}</p>
                </div>
                <div className="bg-surface border border-black/5 rounded-2xl p-5">
                  <p className="text-sm text-navy/55">{fr ? "Options" : "Options"}</p>
                  <p className="font-serif text-3xl font-bold text-navy leading-none mt-1">{picnicOptions.length}</p>
                  <p className="text-navy/45 text-xs mt-2">{fr ? "décor, traiteur, photo, transport, logistique" : "decor, catering, photo, transport, logistics"}</p>
                </div>
                <div className="bg-surface border border-black/5 rounded-2xl p-5">
                  <p className="text-sm text-navy/55">{fr ? "Activités" : "Activities"}</p>
                  <p className="font-serif text-3xl font-bold text-navy leading-none mt-1">{picnicActivities.length}</p>
                  <p className="text-navy/45 text-xs mt-2">{fr ? "couples / famille / amis / business" : "couples / family / friends / business"}</p>
                </div>
                <div className="bg-surface border border-black/5 rounded-2xl p-5 flex flex-col">
                  <p className="text-sm text-navy/55">{fr ? "Page publique" : "Public page"}</p>
                  <p className="font-mono text-sm text-navy mt-1">/pique-nique</p>
                  <a href="/pique-nique" target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 gradient-gold text-navy font-bold px-3 py-1.5 rounded-full text-xs hover:opacity-90 transition-opacity self-start">{fr ? "Ouvrir" : "Open"} →</a>
                </div>
              </div>

              <Panel title={fr ? "Parcs" : "Parks"}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-navy/55 text-xs uppercase tracking-wider border-b border-black/5">
                        <th className="py-2 pr-3 font-semibold">{fr ? "Nom" : "Name"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Quartier" : "Neighbourhood"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Idéal pour" : "Best for"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Réservation" : "Reservation"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "À surveiller" : "Watchout"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(picnicParks as Array<{
                        id: string;
                        name: string;
                        neighbourhood?: string;
                        best_for?: string[];
                        reservation_required?: boolean | string;
                        watchout?: { fr?: string; en?: string };
                      }>).map((p) => {
                        const r = p.reservation_required;
                        const rLabel = r === true ? (fr ? "Oui" : "Yes")
                          : r === false ? (fr ? "Non" : "No")
                          : typeof r === "string" ? (r === "partial" ? (fr ? "Partielle" : "Partial") : r === "verify" ? (fr ? "Vérifier" : "Verify") : r)
                          : "—";
                        const rCls = r === true ? "bg-amber-500/15 text-amber-700"
                          : r === false ? "bg-green-500/15 text-green-700"
                          : "bg-navy/10 text-navy/60";
                        const w = p.watchout ? (fr ? p.watchout.fr : p.watchout.en) : null;
                        return (
                          <tr key={p.id} className="border-b border-black/5 last:border-0 align-top">
                            <td className="py-2.5 pr-3 font-semibold text-navy">{p.name}</td>
                            <td className="py-2.5 pr-3 text-navy/65">{p.neighbourhood ?? "—"}</td>
                            <td className="py-2.5 pr-3">
                              <div className="flex flex-wrap gap-1">
                                {(p.best_for ?? []).map((t) => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy/10 text-navy/70">{t}</span>)}
                              </div>
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${rCls}`}>{rLabel}</span>
                            </td>
                            <td className="py-2.5 pr-3 text-navy/65 text-xs max-w-xs">{w ?? <span className="text-navy/30">—</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel title={fr ? "Options" : "Options"}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-navy/55 text-xs uppercase tracking-wider border-b border-black/5">
                        <th className="py-2 pr-3 font-semibold">{fr ? "Nom" : "Name"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Catégorie" : "Category"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Prix" : "Price"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Occasions" : "Occasions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(picnicOptions as Array<{
                        id: string;
                        category: string;
                        name: { fr: string; en: string };
                        price: number;
                        perPerson?: boolean;
                        occasions?: string[];
                        icon?: string;
                      }>).map((o) => (
                        <tr key={o.id} className="border-b border-black/5 last:border-0 align-top">
                          <td className="py-2.5 pr-3 font-semibold text-navy">
                            <span className="mr-1">{o.icon}</span>{fr ? o.name.fr : o.name.en}
                          </td>
                          <td className="py-2.5 pr-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-[#9a7e34] uppercase tracking-wider">{o.category}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-navy font-semibold">
                            ${o.price}{o.perPerson ? <span className="text-navy/50 font-normal text-xs"> / {fr ? "pers." : "pp"}</span> : null}
                          </td>
                          <td className="py-2.5 pr-3">
                            <div className="flex flex-wrap gap-1">
                              {(o.occasions ?? []).map((occ) => <span key={occ} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy/10 text-navy/70">{occ}</span>)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel title={fr ? "Activités" : "Activities"}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-navy/55 text-xs uppercase tracking-wider border-b border-black/5">
                        <th className="py-2 pr-3 font-semibold">{fr ? "Titre" : "Title"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Segment" : "Segment"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Prix" : "Price"}</th>
                        <th className="py-2 pr-3 font-semibold">{fr ? "Note" : "Rating"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(picnicActivities as Array<{
                        id: string;
                        segment: string;
                        title: { fr: string; en: string };
                        priceRange?: { fr: string; en: string };
                        rating?: number;
                      }>).map((a) => (
                        <tr key={a.id} className="border-b border-black/5 last:border-0 align-top">
                          <td className="py-2.5 pr-3 font-semibold text-navy">{a.title.fr}</td>
                          <td className="py-2.5 pr-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy/10 text-navy/70 uppercase tracking-wider">{a.segment}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-navy/70 text-xs">{a.priceRange ? (fr ? a.priceRange.fr : a.priceRange.en) : "—"}</td>
                          <td className="py-2.5 pr-3 text-navy/70">
                            {typeof a.rating === "number" ? (
                              <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-gold" fill="currentColor" strokeWidth={0} />{a.rating.toFixed(1)}</span>
                            ) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          )}

          {tab === "reports" && <ReportsManager />}

          {tab === "users" && (
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex gap-1.5">{["all", ...ROLES].map((s) => <button key={s} onClick={() => setUserRoleF(s)} className={pill(userRoleF === s)}>{s === "all" ? (fr ? "Tous" : "All") : s}</button>)}</div>
                <div className="relative flex-1 min-w-[160px] max-w-xs"><Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} /><input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder={fr ? "Chercher…" : "Search…"} className="w-full border border-black/10 rounded-full pl-9 pr-3 py-2 text-sm text-navy" /></div>
                <button onClick={exportUsers} className="inline-flex items-center gap-1.5 border border-black/10 text-navy/70 hover:text-navy hover:bg-black/5 rounded-full px-3 py-2 text-xs font-semibold transition-colors"><Download className="w-3.5 h-3.5" strokeWidth={1.75} /> CSV</button>
              </div>
              {fProfiles.length === 0 ? <p className="text-navy/50">{fr ? "Aucun utilisateur." : "No users."}</p> : (
                <div className="space-y-2">{fProfiles.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                    <span className="flex-1 min-w-[120px] truncate text-navy text-sm">{p.display_name || p.id.slice(0, 8)}</span>
                    <div className="flex gap-1 shrink-0">{ROLES.map((r) => <button key={r} onClick={() => p.role !== r && setUserRoleFn(p.id, r)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${p.role === r ? (ROLE_CLS[r] ?? "bg-navy text-cream") + " ring-1 ring-inset ring-black/10" : "bg-black/5 text-navy/45 hover:text-navy hover:bg-black/10"}`}>{r}</button>)}</div>
                  </div>))}
                  <p className="text-navy/40 text-xs mt-2">{fr ? "Clique un rôle pour l'attribuer (le rôle actif est surligné)." : "Click a role to assign it."}</p>
                </div>
              )}
            </div>
          )}

          {tab === "bookings" && (
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex gap-1.5">{["all", "pending", "confirmed", "declined"].map((s) => <button key={s} onClick={() => setBookingF(s)} className={pill(bookingF === s)}>{s === "all" ? (fr ? "Toutes" : "All") : BSTATUS[s]?.[locale] ?? s}</button>)}</div>
                <button onClick={exportBookings} className="inline-flex items-center gap-1.5 border border-black/10 text-navy/70 hover:text-navy hover:bg-black/5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ml-auto"><Download className="w-3.5 h-3.5" strokeWidth={1.75} /> CSV</button>
              </div>
              {fBookings.length === 0 ? <p className="text-navy/50">{fr ? "Aucune réservation." : "No bookings."}</p> : (
                <div className="space-y-2">{fBookings.map((b) => (
                  <div key={b.id} className="flex flex-wrap items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-[140px]"><p className="text-navy text-sm truncate">{b.guest_name || "—"} · {b.party_size ?? 1} {fr ? "pers." : "guests"}</p><p className="text-navy/45 text-xs truncate">{offerName(b.offer_id)}</p></div>
                    <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${BSTATUS[b.status]?.cls ?? "bg-navy/10 text-navy/70"}`}>{BSTATUS[b.status]?.[locale] ?? b.status}</span>
                    {b.status === "pending" && (<div className="flex gap-2 shrink-0"><button onClick={() => setBookingStatusFn(b.id, "confirmed")} className="inline-flex items-center gap-1 text-green-700 hover:bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Confirmer" : "Confirm"}</button><button onClick={() => setBookingStatusFn(b.id, "declined")} className="inline-flex items-center gap-1 text-red-600 hover:bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><XCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Refuser" : "Decline"}</button></div>)}
                  </div>))}
                </div>
              )}
            </div>
          )}

          {tab === "analytics" && (
            <div className="grid md:grid-cols-2 gap-5">
              <Panel title={fr ? "Compositeur : taux de succès" : "Composer: match rate"}>
                {runsLoading ? <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p> : runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Aucune recherche encore." : "No searches yet."}</p> : (
                  <><p className="font-serif text-4xl font-bold text-navy">{matchRate}%</p><p className="text-navy/50 text-xs mb-1">{fr ? "des recherches trouvent une soirée concrète" : "of searches find a real night out"}</p><p className="text-navy/45 text-xs">{runs.length} {fr ? "recherches · budget moyen demandé" : "runs · avg requested budget"} ${avgBudget}</p></>
                )}
              </Panel>
              <Panel title={fr ? "Recherches SANS résultat (à créer en priorité)" : "Searches with NO result (create these)"}>
                {runsLoading ? <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p> : failedCombos.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Toutes les recherches trouvent une offre 🎉" : "Every search finds an offer."}</p> : (
                  <div className="space-y-2.5">{failedCombos.map((c) => <BarRow key={c.label} label={c.label} n={c.n} max={failedCombos[0].n} color="bg-red-500/60" />)}</div>
                )}
              </Panel>
              <Panel title={fr ? "Budgets demandés" : "Requested budgets"}>
                {runsLoading ? <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p> : runs.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Aucune donnée." : "No data."}</p> : <div className="space-y-2.5">{budgetBuckets.map((b) => <BarRow key={b.label} label={b.label} n={b.n} max={Math.max(1, ...budgetBuckets.map((x) => x.n))} />)}</div>}
              </Panel>
              <Panel title={fr ? "Combinaisons de catégories (composées)" : "Category combos (composed)"}>
                {runsLoading ? <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p> : topCombos.length === 0 ? <p className="text-navy/40 text-sm">{fr ? "Pas encore de données." : "No data yet."}</p> : <div className="space-y-2.5">{topCombos.map((c) => <BarRow key={c.label} label={c.label} n={c.n} max={topCombos[0].n} />)}</div>}
              </Panel>
              <Panel title={fr ? "Valeur des réservations" : "Booking value"}>
                <div className="grid grid-cols-2 gap-4"><div><p className="font-serif text-2xl font-bold text-navy">${Math.round(estValue).toLocaleString("fr-CA")}</p><p className="text-navy/50 text-xs">{fr ? "valeur estimée totale" : "total est. value"}</p></div><div><p className="font-serif text-2xl font-bold text-navy">${counts.bookingsTotal ? Math.round(estValue / counts.bookingsTotal) : 0}</p><p className="text-navy/50 text-xs">{fr ? "par réservation" : "per booking"}</p></div></div>
              </Panel>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
