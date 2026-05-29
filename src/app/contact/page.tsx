"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/SocialIcons";
import { useLocale } from "@/lib/locale-context";

export default function ContactPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Réservation", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("sending");
    try {
      await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: `[${form.subject}] ${form.message}`, locale }),
      });
    } catch {}
    setStatus("done");
  }

  const faqs = [
    { qFr: "Comment réserver ?", qEn: "How do I book?", aFr: "Choisissez un forfait ou utilisez Weekend Match, on s'occupe du reste.", aEn: "Pick a package or use Weekend Match — we handle the rest." },
    { qFr: "Livrez-vous à St. Albert / Sherwood Park ?", qEn: "Do you serve St. Albert / Sherwood Park?", aFr: "Oui, dans tout le Grand Edmonton.", aEn: "Yes, across Greater Edmonton." },
    { qFr: "Puis-je annuler ?", qEn: "Can I cancel?", aFr: "Annulation gratuite jusqu'à 72h avant.", aEn: "Free cancellation up to 72h before." },
    { qFr: "Vous êtes qui ?", qEn: "Who are you?", aFr: "Ivan et Karl, deux Edmontoniens passionnés.", aEn: "Ivan and Karl, two passionate Edmontonians." },
  ];

  const inputCls = "w-full bg-surface border border-black/10 rounded-xl px-4 py-3 text-navy text-sm placeholder:text-navy/40 outline-none focus:ring-2 focus:ring-gold/40 transition-shadow";

  return (
    <div className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy">
            {fr ? "Parlons de votre prochaine sortie" : "Let's talk about your next outing"}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-5">
            <div className="space-y-3 text-navy/75">
              <p className="flex items-center gap-3"><Mail className="w-5 h-5 text-gold" strokeWidth={1.5} /> <a href="mailto:wheretogoyeg@gmail.com" className="hover:text-gold transition-colors">wheretogoyeg@gmail.com</a></p>
              <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-gold" strokeWidth={1.5} /> +1 (780) 000-0000</p>
              <p className="flex items-center gap-3"><Clock className="w-5 h-5 text-gold" strokeWidth={1.5} /> {fr ? "Lun-Ven 9h-18h · Sam 10h-16h" : "Mon-Fri 9am-6pm · Sat 10am-4pm"}</p>
              <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} /> Edmonton, Alberta, Canada</p>
            </div>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/wheretogoyeg" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-navy/5 hover:bg-gold/15 flex items-center justify-center text-navy/70 hover:text-gold transition-colors"><InstagramIcon /></a>
              <a href="https://www.facebook.com/share/18CVN5NTXM/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-navy/5 hover:bg-gold/15 flex items-center justify-center text-navy/70 hover:text-gold transition-colors"><FacebookIcon /></a>
              <a href="https://www.tiktok.com/@wheretogoyeg" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-navy/5 hover:bg-gold/15 flex items-center justify-center text-navy/70 hover:text-gold transition-colors"><TikTokIcon /></a>
            </div>
            <div className="rounded-3xl overflow-hidden border border-black/5 shadow-sm">
              <iframe title="Edmonton" src="https://www.google.com/maps?q=Downtown+Edmonton+AB&output=embed" width="100%" height="260" style={{ border: 0 }} loading="lazy" />
            </div>
          </div>

          {/* Form */}
          <div className="bg-surface rounded-3xl border border-black/5 shadow-sm p-7">
            {status === "done" ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-14 h-14 text-gold mx-auto mb-4" strokeWidth={1.5} />
                <p className="font-serif text-xl font-bold text-navy">{fr ? "Merci ! Nous vous répondons sous 24h." : "Thank you! We'll reply within 24h."}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={fr ? "Prénom" : "First name"} className={inputCls} />
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inputCls} />
                </div>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={fr ? "Téléphone (optionnel)" : "Phone (optional)"} className={inputCls} />
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls}>
                  {["Réservation", "Partenariat", "Presse", "Autre"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" rows={4} className={inputCls} />
                <button type="submit" disabled={status === "sending"} className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
                  {status === "sending" ? (fr ? "Envoi…" : "Sending…") : (fr ? "Envoyer le message" : "Send message")}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="font-serif text-2xl font-bold text-navy text-center mb-6">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-black/5 p-5">
                <p className="font-semibold text-navy mb-1">{fr ? f.qFr : f.qEn}</p>
                <p className="text-navy/60 text-sm">{fr ? f.aFr : f.aEn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
