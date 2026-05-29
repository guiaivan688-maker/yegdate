"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";

interface Banner { id: number; message_fr: string; message_en: string | null; href: string | null; }

const DISMISS_KEY = "yegdate-banner-dismissed";

export default function SiteBanner() {
  const { locale } = useLocale();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_banners")
      .select("id,message_fr,message_en,href")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        const b = data as Banner;
        let dismissed = "";
        try { dismissed = localStorage.getItem(DISMISS_KEY) || ""; } catch { /* no-op */ }
        setBanner(b);
        setHidden(dismissed === String(b.id));
      });
    return () => { active = false; };
  }, []);

  if (!banner || hidden) return null;

  const message = locale === "fr" ? banner.message_fr : banner.message_en || banner.message_fr;

  function dismiss() {
    setHidden(true);
    try { localStorage.setItem(DISMISS_KEY, String(banner!.id)); } catch { /* no-op */ }
  }

  const text = <span className="text-sm font-semibold text-navy">{message}</span>;

  return (
    <div className="gradient-gold">
      <div className="max-w-7xl mx-auto px-10 sm:px-12 py-2.5 flex items-center justify-center text-center relative">
        {banner.href ? <a href={banner.href} className="hover:underline">{text}</a> : text}
        <button
          onClick={dismiss}
          aria-label={locale === "fr" ? "Fermer" : "Close"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/55 hover:text-navy transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
