"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Download, Lock, Loader2, FileText } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";

export default function SpecClient({ markdown, error }: { markdown: string; error: string | null }) {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const uid = data.session?.user?.id;
      if (!uid) { setAuthed(false); return; }
      const { data: prof } = await supabase.from("profiles").select("role").eq("id", uid).single();
      const r = (prof as { role?: string } | null)?.role ?? "client";
      setRole(r);
      setAuthed(r === "admin");
    });
    return () => { active = false; };
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-navy/50">
        <Loader2 className="w-6 h-6 animate-spin mr-2" strokeWidth={1.5} /> {fr ? "Chargement…" : "Loading…"}
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md bg-surface border border-black/5 rounded-3xl p-8 text-center">
          <Lock className="w-10 h-10 text-navy/40 mx-auto mb-3" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl font-bold text-navy mb-2">{fr ? "Accès réservé" : "Access restricted"}</h1>
          <p className="text-navy/60 text-sm mb-5">
            {role
              ? (fr ? "Cette page est réservée à l'admin." : "This page is admin-only.")
              : (fr ? "Connecte-toi avec ton compte admin." : "Sign in with your admin account.")}
          </p>
          <Link href="/connexion" className="inline-block gradient-gold text-navy font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            {fr ? "Connexion" : "Sign in"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-navy/60 hover:text-navy text-sm">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> {fr ? "Retour admin" : "Back to admin"}
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/PROJECT-SPEC.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-surface border border-navy/15 text-navy px-4 py-2 rounded-full text-sm font-semibold hover:bg-navy/5 transition-colors"
            >
              <FileText className="w-4 h-4" strokeWidth={1.5} /> {fr ? "Ouvrir en texte" : "Open as text"}
            </a>
            <a
              href="/PROJECT-SPEC.txt"
              download="PROJECT-SPEC.txt"
              className="inline-flex items-center gap-1.5 bg-navy text-cream px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" strokeWidth={2} /> {fr ? "Télécharger .txt" : "Download .txt"}
            </a>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-red-700">
            <strong>{fr ? "Impossible de charger le document" : "Failed to load document"} :</strong> {error}
          </div>
        ) : (
          <article className="bg-surface border border-black/5 rounded-3xl shadow-sm p-6 sm:p-10 spec-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </article>
        )}
      </div>

      <style jsx global>{`
        .spec-prose h1 { font-family: var(--font-playfair), serif; font-size: 2rem; font-weight: 800; color: rgb(26, 54, 93); margin: 1.5rem 0 1rem; line-height: 1.15; }
        .spec-prose h2 { font-family: var(--font-playfair), serif; font-size: 1.5rem; font-weight: 700; color: rgb(26, 54, 93); margin: 2.5rem 0 1rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.06); }
        .spec-prose h3 { font-family: var(--font-playfair), serif; font-size: 1.2rem; font-weight: 700; color: rgb(26, 54, 93); margin: 1.75rem 0 0.5rem; }
        .spec-prose h4 { font-weight: 700; color: rgb(26, 54, 93); margin: 1.25rem 0 0.5rem; }
        .spec-prose p { color: rgba(26, 54, 93, 0.85); line-height: 1.65; margin: 0.6rem 0; }
        .spec-prose ul, .spec-prose ol { color: rgba(26, 54, 93, 0.85); margin: 0.6rem 0 0.6rem 1.5rem; line-height: 1.65; }
        .spec-prose ul { list-style: disc; }
        .spec-prose ol { list-style: decimal; }
        .spec-prose li { margin: 0.25rem 0; }
        .spec-prose li > p { margin: 0; }
        .spec-prose strong { color: rgb(26, 54, 93); font-weight: 700; }
        .spec-prose em { font-style: italic; color: rgba(26, 54, 93, 0.75); }
        .spec-prose a { color: rgb(194, 158, 81); text-decoration: underline; }
        .spec-prose a:hover { color: rgb(154, 126, 52); }
        .spec-prose code { background: rgba(26, 54, 93, 0.06); color: rgb(26, 54, 93); padding: 0.1rem 0.4rem; border-radius: 0.3rem; font-size: 0.875em; font-family: ui-monospace, monospace; }
        .spec-prose pre { background: rgb(26, 54, 93); color: rgb(252, 244, 230); padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 1rem 0; font-size: 0.85rem; }
        .spec-prose pre code { background: transparent; color: inherit; padding: 0; }
        .spec-prose blockquote { border-left: 4px solid rgb(194, 158, 81); padding-left: 1rem; color: rgba(26, 54, 93, 0.7); font-style: italic; margin: 1rem 0; }
        .spec-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        .spec-prose th { background: rgba(26, 54, 93, 0.05); color: rgb(26, 54, 93); font-weight: 700; text-align: left; padding: 0.5rem 0.75rem; border-bottom: 2px solid rgba(0,0,0,0.1); }
        .spec-prose td { padding: 0.5rem 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.06); color: rgba(26, 54, 93, 0.85); vertical-align: top; }
        .spec-prose tr:hover td { background: rgba(0,0,0,0.02); }
        .spec-prose hr { border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 2.5rem 0; }
        .spec-prose input[type="checkbox"] { margin-right: 0.5rem; }
        .spec-prose img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
      `}</style>
    </div>
  );
}
