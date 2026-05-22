"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft, Search, Heart } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

const links = [
  { href: "/decouvrir", key: "nav.discover" },
  { href: "/weekend-match", key: "nav.weekendMatch" },
  { href: "/packages", key: "nav.packages" },
  { href: "/night-out", key: "nav.nightout" },
  { href: "/buffets", key: "nav.buffets" },
  { href: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const { locale, toggleLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            {!isHome && (
              <button
                onClick={goBack}
                aria-label={t("common.backTo")}
                className="flex items-center gap-1.5 text-navy/70 hover:text-navy bg-surface/70 hover:bg-surface border border-black/5 rounded-full pl-2.5 pr-3 py-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium hidden sm:inline">{t("common.backTo")}</span>
              </button>
            )}
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl tracking-tight">
                <span className="font-serif font-bold text-navy">YEG</span>
                <span className="text-gold font-bold">·</span>
                <span className="font-light text-navy">Date</span>
              </span>
              <span className="hidden sm:block text-[10px] text-navy/45 tracking-wide mt-0.5">
                {t("hero.tagline")}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-navy/70 hover:text-navy font-medium text-sm transition-colors duration-200"
              >
                {t(link.key)}
              </Link>
            ))}
            <Link href="/recherche" aria-label="Recherche" className="text-navy/70 hover:text-gold transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link href="/mes-favoris" aria-label="Mes favoris" className="text-navy/70 hover:text-gold transition-colors">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <button
              onClick={toggleLocale}
              aria-label="Switch language"
              className="ml-1 px-3.5 py-1.5 rounded-full bg-navy text-cream text-xs font-semibold tracking-wider hover:bg-navy-light transition-colors"
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link href="/recherche" aria-label="Recherche" className="text-navy/70 hover:text-gold transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link href="/mes-favoris" aria-label="Mes favoris" className="text-navy/70 hover:text-gold transition-colors">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <button
              onClick={toggleLocale}
              aria-label="Switch language"
              className="px-3.5 py-1.5 rounded-full bg-navy text-cream text-xs font-semibold"
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="text-navy">
              {open ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-navy/80 hover:text-navy font-medium transition-colors"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
