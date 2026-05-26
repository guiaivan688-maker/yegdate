"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import EmailPasswordAuth from "@/components/EmailPasswordAuth";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function ConnexionPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const router = useRouter();
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let active = true;
    const route = async (uid?: string) => {
      if (!uid) { if (active) setBusy(false); return; }
      if (active) setBusy(true);
      const { data } = await supabase.from("profiles").select("role").eq("id", uid).single();
      const role = (data as { role?: string } | null)?.role ?? "client";
      const dest = role === "admin" ? "/admin" : role === "prestataire" ? "/prestataire" : "/";
      router.replace(dest);
    };
    supabase.auth.getSession().then(({ data }) => route(data.session?.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { if (s?.user) route(s.user.id); });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [router]);

  if (busy) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex items-center gap-2 text-navy/50"><Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} /> {fr ? "Connexion…" : "Signing in…"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4 flex justify-center">
      <div className="max-w-md w-full">
        <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-2">{fr ? "Connexion" : "Sign in"}</h1>
        <p className="text-navy/60 mb-8">{fr ? "Un seul espace — on te redirige automatiquement selon ton rôle." : "One login — we route you automatically based on your role."}</p>
        <div className="bg-surface border border-black/5 rounded-3xl p-8">
          <EmailPasswordAuth />
          <div className="flex items-center gap-3 my-4 text-navy/35 text-xs"><span className="h-px flex-1 bg-black/10" />{fr ? "ou" : "or"}<span className="h-px flex-1 bg-black/10" /></div>
          <GoogleSignIn redirectTo="/connexion" label={fr ? "Continuer avec Google" : "Continue with Google"} />
        </div>
        <p className="text-navy/40 text-xs text-center mt-5">{fr ? "Admin → back-office · Prestataire → son espace · Client → accueil" : "Admin → back-office · Partner → their space · Client → home"}</p>
      </div>
    </div>
  );
}
