"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="gradient-navy text-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-serif font-bold text-base">Y</span>
              </div>
              <span className="font-serif text-xl font-bold">
                YEG <span className="text-gold">Date</span>
              </span>
            </div>
            <p className="text-cream/60 text-sm font-serif italic">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.explore")}
            </h4>
            <div className="space-y-2">
              {[
                { href: "/decouvrir", key: "nav.discover" },
                { href: "/weekend-match", key: "nav.weekendMatch" },
                { href: "/couples", key: "nav.couples" },
                { href: "/famille", key: "nav.famille" },
                { href: "/amis", key: "nav.amis" },
                { href: "/buffets", key: "nav.buffets" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block text-cream/60 hover:text-gold text-sm transition-colors">
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("nav.services")}
            </h4>
            <div className="space-y-2">
              {[
                { href: "/services", key: "nav.services" },
                { href: "/packages", key: "nav.packages" },
                { href: "/business", key: "nav.business" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block text-cream/60 hover:text-gold text-sm transition-colors">
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.follow")}
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

        <div className="border-t border-cream/10 mt-12 pt-8 text-center space-y-1">
          <p className="text-cream/40 text-xs">{t("footer.disclaimer")}</p>
          <p className="text-cream/40 text-sm">
            &copy; {new Date().getFullYear()} YEG Date. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
