"use client";

import { useState } from "react";
import { Flag, X, CheckCircle2, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";

type TargetType = "offer" | "event" | "general";

interface Props {
  target_type: TargetType;
  target_id?: string | null;
  target_label?: string | null;
  className?: string;
  label?: string;
  iconOnly?: boolean;
}

const CATEGORIES = ["content", "price", "image", "spam", "other"] as const;
type Category = (typeof CATEGORIES)[number];

const CAT_LABEL: Record<Category, { fr: string; en: string }> = {
  content: { fr: "Information incorrecte", en: "Incorrect information" },
  price:   { fr: "Prix erroné",            en: "Wrong price" },
  image:   { fr: "Image inappropriée",     en: "Inappropriate image" },
  spam:    { fr: "Spam / frauduleux",      en: "Spam / fraudulent" },
  other:   { fr: "Autre",                  en: "Other" },
};

export default function ReportButton(props: Props) {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>("content");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || message.trim().length < 5) return;
    setBusy(true);
    const { error } = await supabase.from("reports").insert({
      target_type: props.target_type,
      target_id: props.target_id ?? null,
      target_label: props.target_label ?? null,
      category,
      message: message.trim().slice(0, 2000),
      reporter_email: email.trim() || null,
    });
    setBusy(false);
    if (!error) setDone(true);
    else console.error("[report] insert failed:", error.message);
  }

  function close() {
    setOpen(false);
    setTimeout(() => { setDone(false); setMessage(""); setEmail(""); setCategory("content"); }, 200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={props.className ?? "inline-flex items-center gap-1 text-xs text-navy/45 hover:text-navy/70 transition-colors"}
        aria-label={fr ? "Signaler un problème" : "Report an issue"}
      >
        <Flag className="w-3.5 h-3.5" strokeWidth={1.75} />
        {!props.iconOnly && (props.label ?? (fr ? "Signaler" : "Report"))}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/40"
          onClick={close}
        >
          <div
            className="bg-surface rounded-3xl border border-black/5 shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-navy">{fr ? "Signaler un problème" : "Report an issue"}</h3>
              <button onClick={close} aria-label={fr ? "Fermer" : "Close"} className="text-navy/45 hover:text-navy"><X className="w-5 h-5" strokeWidth={1.75} /></button>
            </div>

            {done ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-navy font-semibold mb-1">{fr ? "Merci !" : "Thanks!"}</p>
                <p className="text-navy/55 text-sm mb-5">{fr ? "On regarde ça rapidement." : "We'll review it shortly."}</p>
                <button onClick={close} className="inline-flex items-center justify-center gap-2 gradient-navy text-cream font-semibold px-5 py-2 rounded-full">{fr ? "Fermer" : "Close"}</button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                {props.target_label && (
                  <div className="text-xs text-navy/50 bg-black/5 rounded-lg px-3 py-2">
                    <span className="text-navy/40">{fr ? "Contenu :" : "Content:"}</span> {props.target_label}
                  </div>
                )}
                <label className="text-xs text-navy/60">{fr ? "Catégorie" : "Category"}
                  <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy bg-white">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABEL[c][locale]}</option>)}
                  </select>
                </label>
                <label className="text-xs text-navy/60">{fr ? "Détails *" : "Details *"}
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required minLength={5} maxLength={2000} rows={4} placeholder={fr ? "Décris ce qui ne va pas…" : "Describe the issue…"} className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy resize-none" />
                </label>
                <label className="text-xs text-navy/60">{fr ? "Ton email (optionnel)" : "Your email (optional)"}
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={fr ? "Si tu veux qu'on revienne vers toi" : "If you'd like us to follow up"} className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" />
                </label>
                <button type="submit" disabled={busy || message.trim().length < 5} className="inline-flex items-center justify-center gap-2 gradient-gold text-navy font-bold px-5 py-2.5 rounded-full mt-1 disabled:opacity-60">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <Flag className="w-4 h-4" strokeWidth={2} />}
                  {fr ? "Envoyer le signalement" : "Send report"}
                </button>
                <p className="text-navy/40 text-[11px] mt-1">{fr ? "Les signalements sont anonymes. L'email est optionnel et ne sert que si on a besoin de revenir vers toi." : "Reports are anonymous. The email is optional and only used if we need to follow up."}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
