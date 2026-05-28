"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "./SocialIcons";

const socials = [
  { label: "Instagram", href: "https://instagram.com/yegdate", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/yegdate", Icon: FacebookIcon },
  { label: "TikTok", href: "https://tiktok.com/@yegdate", Icon: TikTokIcon },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="gradient-navy text-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="text-2xl tracking-tight mb-3 block">
              <span className="font-light text-cream">Where To Go</span>
              <span className="text-gold font-bold">·</span>
              <span className="font-serif font-bold text-cream">YEG</span>
            </span>
            <p className="text-cream/60 text-sm font-serif italic">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.explore")}
            </h4>
            <div className="space-y-2">
              {[
                { href: "/decouvrir", key: "nav.discover" },
                { href: "/evenements", key: "nav.events" },
                { href: "/guides", key: "nav.guides" },
                { href: "/carte", key: "nav.carte" },
                { href: "/night-out", key: "nav.nightout" },
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
                { href: "/about", key: "nav.about" },
                { href: "/contact", key: "nav.contact" },
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
            <div className="flex gap-3 mb-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-gold/20 flex items-center justify-center text-cream/70 hover:text-gold transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <a href="mailto:wheretogoyeg@gmail.com" className="text-cream/60 hover:text-gold text-sm transition-colors">
              wheretogoyeg@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 text-center space-y-2">
          <p className="text-cream/50 text-sm">
            {t("footer.privateHaven")}{" "}
            <a href="#" title="Bientôt disponible" className="text-gold italic hover:underline">
              Private Haven
            </a>
          </p>
          <p className="text-cream/40 text-xs">{t("footer.disclaimer")}</p>
          <div className="flex items-center justify-center gap-4 text-cream/50 text-xs">
            <Link href="/confidentialite" className="hover:text-gold transition-colors">{t("footer.privacy")}</Link>
            <span className="text-cream/20">·</span>
            <Link href="/conditions" className="hover:text-gold transition-colors">{t("footer.terms")}</Link>
          </div>
          <p className="text-cream/40 text-sm">
            {t("footer.madeWith")} &copy; {new Date().getFullYear()} Where To Go YEG — Edmonton, AB, Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
