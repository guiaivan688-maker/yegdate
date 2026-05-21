"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="gradient-navy text-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-serif font-bold text-sm">Y</span>
              </div>
              <span className="font-serif text-xl font-bold">
                YEG <span className="text-gold">Date</span>
              </span>
            </div>
            <p className="text-cream/60 text-sm font-serif italic">
              {t("footer", "tagline", locale)}
            </p>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer", "explore", locale)}
            </h4>
            <div className="space-y-2">
              {[
                { href: "/decouvrir", label: t("nav", "discover", locale) },
                { href: "/weekend-match", label: t("nav", "weekendMatch", locale) },
                { href: "/couples", label: t("nav", "couples", locale) },
                { href: "/famille", label: t("nav", "famille", locale) },
                { href: "/amis", label: t("nav", "amis", locale) },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-cream/60 hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <div className="space-y-2">
              {[
                { href: "/services", label: t("nav", "services", locale) },
                { href: "/packages", label: t("nav", "packages", locale) },
                { href: "/business", label: t("nav", "business", locale) },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-cream/60 hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer", "follow", locale)}
            </h4>
            <div className="flex gap-3">
              {["Instagram", "Facebook", "TikTok"].map((social) => (
                <span
                  key={social}
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-gold/20 flex items-center justify-center text-cream/60 hover:text-gold text-xs font-semibold transition-colors cursor-pointer"
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 text-center">
          <p className="text-cream/40 text-sm">
            &copy; {new Date().getFullYear()} YEG Date. {t("footer", "rights", locale)}
          </p>
        </div>
      </div>
    </footer>
  );
}
