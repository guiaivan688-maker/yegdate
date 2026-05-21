"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";

const links = [
  { href: "/", key: "home" },
  { href: "/decouvrir", key: "discover" },
  { href: "/weekend-match", key: "weekendMatch" },
  { href: "/services", key: "services" },
  { href: "/packages", key: "packages" },
];

export default function Navbar() {
  const { locale, toggleLocale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-navy flex items-center justify-center">
              <span className="text-gold font-serif font-bold text-sm">Y</span>
            </div>
            <span className="font-serif text-xl font-bold text-navy">
              YEG <span className="text-gold">Date</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-navy/70 hover:text-navy font-medium text-sm transition-colors duration-200"
              >
                {t("nav", link.key, locale)}
              </Link>
            ))}
            <button
              onClick={toggleLocale}
              className="ml-2 px-3 py-1.5 rounded-full bg-navy text-cream text-xs font-semibold tracking-wider hover:bg-navy-light transition-colors"
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="px-3 py-1.5 rounded-full bg-navy text-cream text-xs font-semibold"
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
            <button onClick={() => setOpen(!open)} className="text-navy">
              {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
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
            className="md:hidden glass border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-navy/80 hover:text-navy font-medium transition-colors"
                >
                  {t("nav", link.key, locale)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
