"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export default function Newsletter() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Hidden source field for later segmentation (Where To Go YEG vs Private Haven)
    const payload = { email, source: "yegdate", type: "newsletter" };
    try {
      await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter", email, message: JSON.stringify(payload) }),
      });
    } catch {}
    setDone(true);
  }

  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto gradient-navy rounded-3xl px-8 py-14 sm:px-14 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-3">{t("newsletter.title")}</h2>
        <p className="text-cream/60 text-sm mb-8">{t("newsletter.social")}</p>
        {done ? (
          <div className="flex items-center justify-center gap-2 text-gold">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
            <span className="font-semibold">{t("newsletter.thanks")}</span>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="hidden" name="source" value="yegdate" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-1 bg-cream/95 rounded-full px-5 py-3 text-navy text-sm placeholder:text-navy/40 outline-none focus:ring-2 focus:ring-gold"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="gradient-gold text-navy font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t("newsletter.cta")}
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
}
