"use client";

import { useEffect, useState, useCallback } from "react";
import { Flag, CheckCircle2, XCircle, Trash2, Mail, ExternalLink, RotateCcw } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";

interface Report {
  id: number;
  target_type: "offer" | "event" | "general";
  target_id: string | null;
  target_label: string | null;
  category: string | null;
  message: string;
  reporter_email: string | null;
  status: "open" | "resolved" | "dismissed";
  resolved_at: string | null;
  created_at: string;
}

type Filter = "all" | "open" | "resolved" | "dismissed";

const STATUS_CLS: Record<Report["status"], { fr: string; en: string; cls: string }> = {
  open:      { fr: "À traiter", en: "Open",      cls: "bg-amber-500/15 text-amber-700" },
  resolved:  { fr: "Résolu",    en: "Resolved",  cls: "bg-green-500/15 text-green-700" },
  dismissed: { fr: "Ignoré",    en: "Dismissed", cls: "bg-black/5 text-navy/50" },
};

const CAT_LABEL: Record<string, { fr: string; en: string }> = {
  content: { fr: "Information", en: "Information" },
  price:   { fr: "Prix",        en: "Price" },
  image:   { fr: "Image",       en: "Image" },
  spam:    { fr: "Spam",        en: "Spam" },
  other:   { fr: "Autre",       en: "Other" },
};

const TYPE_LABEL: Record<Report["target_type"], { fr: string; en: string }> = {
  offer:   { fr: "Offre",     en: "Offer" },
  event:   { fr: "Événement", en: "Event" },
  general: { fr: "Général",   en: "General" },
};

const COLS = "id,target_type,target_id,target_label,category,message,reporter_email,status,resolved_at,created_at";

export default function ReportsManager() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<Filter>("open");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("reports").select(COLS).order("created_at", { ascending: false });
    setReports((data as Report[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: number, status: Report["status"]) {
    const resolved_at = status === "resolved" ? new Date().toISOString() : null;
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status, resolved_at } : r)));
    await supabase.from("reports").update({ status, resolved_at }).eq("id", id);
  }

  async function remove(id: number) {
    setReports((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("reports").delete().eq("id", id);
  }

  const fReports = reports.filter((r) => filter === "all" || r.status === filter);
  const openCount = reports.filter((r) => r.status === "open").length;
  const pill = (active: boolean) => `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${active ? "gradient-navy text-cream" : "bg-surface text-navy/60 hover:text-navy border border-black/5"}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {(["open", "resolved", "dismissed", "all"] as Filter[]).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={pill(filter === s)}>
            {s === "all" ? (fr ? "Tous" : "All") : STATUS_CLS[s as Report["status"]][locale]}
            {s === "open" && openCount > 0 && <span className={`ml-1.5 ${filter === s ? "bg-gold text-navy" : "bg-gold/30 text-navy"} text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none`}>{openCount}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-navy/40 text-sm">{fr ? "Chargement…" : "Loading…"}</p>
      ) : fReports.length === 0 ? (
        <p className="text-navy/50">{fr ? "Aucun signalement." : "No reports."}</p>
      ) : (
        <div className="space-y-3">{fReports.map((r) => (
          <div key={r.id} className="bg-surface border border-black/5 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/55 inline-flex items-center gap-1">
                <Flag className="w-3 h-3 text-gold" strokeWidth={2} />
                {TYPE_LABEL[r.target_type]?.[locale] ?? r.target_type}
                {r.category && <> · {CAT_LABEL[r.category]?.[locale] ?? r.category}</>}
              </span>
              <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_CLS[r.status]?.cls ?? ""}`}>{STATUS_CLS[r.status]?.[locale] ?? r.status}</span>
              <span className="text-navy/40 text-xs ml-auto">{new Date(r.created_at).toLocaleString(locale === "fr" ? "fr-CA" : "en-CA", { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
            {r.target_label && (
              <p className="text-navy/55 text-xs mb-1 italic">« {r.target_label} »{r.target_id ? <> · <span className="font-mono not-italic text-navy/40">{r.target_id.slice(0, 8)}</span></> : null}</p>
            )}
            <p className="text-navy text-sm mb-3 whitespace-pre-wrap">{r.message}</p>
            {r.reporter_email && (
              <a href={`mailto:${r.reporter_email}`} className="inline-flex items-center gap-1 text-navy/60 hover:text-navy text-xs mb-3">
                <Mail className="w-3.5 h-3.5" strokeWidth={1.75} /> {r.reporter_email}
              </a>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {r.status !== "resolved" && <button onClick={() => setStatus(r.id, "resolved")} className="inline-flex items-center gap-1 text-green-700 hover:bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Résoudre" : "Resolve"}</button>}
              {r.status !== "dismissed" && <button onClick={() => setStatus(r.id, "dismissed")} className="inline-flex items-center gap-1 text-navy/60 hover:bg-black/5 border border-black/10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><XCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Ignorer" : "Dismiss"}</button>}
              {r.status !== "open" && <button onClick={() => setStatus(r.id, "open")} className="inline-flex items-center gap-1 text-amber-700 hover:bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} /> {fr ? "Rouvrir" : "Reopen"}</button>}
              {r.target_type === "offer" && (
                <a href="/reserver" className="inline-flex items-center gap-1 text-navy/55 hover:text-navy text-xs ml-auto"><ExternalLink className="w-3 h-3" strokeWidth={1.75} /> {fr ? "Voir page" : "View page"}</a>
              )}
              <button onClick={() => remove(r.id)} className="text-navy/40 hover:text-red-500 transition-colors ml-1" aria-label={fr ? "Supprimer" : "Delete"}><Trash2 className="w-4 h-4" strokeWidth={1.75} /></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
