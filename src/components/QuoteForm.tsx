"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";

interface QuoteFormProps {
  activity?: string;
  addons?: string[];
  guests?: number;
  total?: number;
  compact?: boolean;
}

export default function QuoteForm({ activity, addons, guests, total, compact }: QuoteFormProps) {
  const { locale, t } = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, activity, addons, guests, total, locale }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <CheckCircleIcon className="w-14 h-14 text-gold mx-auto mb-4" />
        <p className="text-navy font-serif text-xl font-bold">{t("quote.success")}</p>
      </motion.div>
    );
  }

  const inputCls =
    "w-full bg-cream/60 border border-black/5 rounded-xl px-4 py-3 text-navy text-sm placeholder:text-navy/40 outline-none focus:ring-2 focus:ring-gold/40 transition-shadow";

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={t("quote.name")}
          className={inputCls}
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={t("quote.email")}
          className={inputCls}
        />
      </div>
      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder={t("quote.phone")}
        className={inputCls}
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder={t("quote.message")}
        rows={compact ? 2 : 3}
        className={inputCls}
      />
      {status === "error" && <p className="text-red-600 text-xs">{t("quote.error")}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "sending" ? t("quote.sending") : t("quote.submit")}
      </button>
    </form>
  );
}
