"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";

// Email + password auth. Tries to sign in; if the account doesn't exist, creates it.
// Simplest reliable method (no OAuth, no email delivery) once "Confirm email" is OFF in Supabase.
export default function EmailPasswordAuth() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
      if (signUpError) {
        setMsg(signUpError.message);
        setBusy(false);
        return;
      }
      if (!data.session) {
        setMsg(fr ? "Compte créé. Confirme ton email — ou désactive « Confirm email » dans Supabase pour entrer tout de suite." : "Account created. Confirm your email — or disable “Confirm email” in Supabase to get in instantly.");
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    // The parent page's onAuthStateChange picks up the new session and shows the dashboard.
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={fr ? "ton@email.com" : "you@email.com"} className="w-full border border-black/10 rounded-full px-5 py-3 text-navy" />
      <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={fr ? "Mot de passe (6+ caractères)" : "Password (6+ chars)"} className="w-full border border-black/10 rounded-full px-5 py-3 text-navy" />
      <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 gradient-gold text-navy font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : <Lock className="w-4 h-4" strokeWidth={2} />}
        {fr ? "Se connecter / Créer mon compte" : "Sign in / Create account"}
      </button>
      {msg && <p className="text-navy/60 text-xs">{msg}</p>}
    </form>
  );
}
