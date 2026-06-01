"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft, Search, Heart, ShieldCheck, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/lib/supabase";
import ContextPicker from "./ContextPicker";

interface NavLink {
  href: string;
  fr: string;
  en: string;
  desc?: { fr: string; en: string };
}

interface NavBucket {
  id: string;
  fr: string;
  en: string;
  links: NavLink[];
}

const BUCKETS: NavBucket[] = [
  {
    id: "plan",
    fr: "Planifier",
    en: "Plan",
    links: [
      { href: "/compositeur", fr: "Compose ta soirée", en: "Compose your night",
        desc: { fr: "4 questions, on construit ton plan", en: "4 questions, we build your plan" } },
      { href: "/pique-nique", fr: "Pique-nique", en: "Picnic",
        desc: { fr: "23 lieux Edmonton, indoor + outdoor", en: "23 Edmonton venues, indoor + outdoor" } },
      { href: "/sur-mesure", fr: "Sur-mesure", en: "Custom builder",
        desc: { fr: "Compose bloc par bloc", en: "Build block by block" } },
      { href: "/weekend-match", fr: "Weekend Match", en: "Weekend Match",
        desc: { fr: "Le plan parfait pour ce week-end", en: "Perfect plan for this weekend" } },
    ],
  },
  {
    id: "book",
    fr: "Réserver",
    en: "Book",
    links: [
      { href: "/reserver", fr: "Mes réservations", en: "Bookings",
        desc: { fr: "Réserver une expérience vérifiée", en: "Book a vetted experience" } },
      { href: "/night-out", fr: "Night Out", en: "Night Out",
        desc: { fr: "Soirées clé en main par vibe", en: "Turnkey nights by vibe" } },
      { href: "/buffets", fr: "Buffets", en: "Buffets",
        desc: { fr: "AYCE sushi, BBQ coréen, hot pot", en: "AYCE sushi, Korean BBQ, hot pot" } },
      { href: "/packages", fr: "Forfaits", en: "Packages",
        desc: { fr: "Expériences clé en main", en: "Turnkey experiences" } },
    ],
  },
  {
    id: "discover",
    fr: "Découvrir",
    en: "Discover",
    links: [
      { href: "/decouvrir", fr: "Découvrir Edmonton", en: "Discover Edmonton",
        desc: { fr: "Toutes les activités curées", en: "All curated activities" } },
      { href: "/carte", fr: "Carte interactive", en: "Interactive map",
        desc: { fr: "Activités + parcs sur la carte", en: "Activities + parks on the map" } },
      { href: "/evenements", fr: "Événements", en: "Events",
        desc: { fr: "Festivals & événements à venir", en: "Upcoming festivals & events" } },
      { href: "/guides", fr: "Guides", en: "Guides",
        desc: { fr: "Articles longs Edmonton", en: "Edmonton long reads" } },
      { href: "/couples", fr: "Couples", en: "Couples" },
      { href: "/famille", fr: "Famille", en: "Family" },
      { href: "/amis", fr: "Amis", en: "Friends" },
      { href: "/business", fr: "Affaires", en: "Business" },
    ],
  },
];

export default function Navbar() {
  const { locale, toggleLocale, t } = useLocale();
  const fr = locale === "fr";
  const [open, setOpen] = useState(false);
  const [openBucket, setOpenBucket] = useState<string | null>(null);
  const [openMobileBucket, setOpenMobileBucket] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  const labels = {
    search: fr ? "Recherche" : "Search",
    favs: fr ? "Mes favoris" : "My favorites",
    lang: fr ? "Switch to English" : "Passer au français",
    menu: fr ? "Menu" : "Menu",
  };

  useEffect(() => {
    let active = true;
    const check = async (uid?: string) => {
      if (active) setIsLoggedIn(!!uid);
      if (!uid) { if (active) setIsAdmin(false); return; }
      const { data } = await supabase.from("profiles").select("role").eq("id", uid).single();
      if (active) setIsAdmin((data as { role?: string } | null)?.role === "admin");
    };
    supabase.auth.getSession().then(({ data }) => check(data.session?.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => check(s?.user?.id));
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  // Close desktop dropdown on outside click + Esc
  useEffect(() => {
    if (!openBucket) return;
    function onDown(e: MouseEvent) {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) setOpenBucket(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenBucket(null);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openBucket]);

  // Close mobile menu on pathname change
  useEffect(() => {
    setOpen(false);
    setOpenMobileBucket(null);
    setOpenBucket(null);
  }, [pathname]);

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
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: back + logo + ContextPicker */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {!isHome && (
              <button
                onClick={goBack}
                aria-label={t("common.backTo")}
                className="flex items-center gap-1.5 text-navy/70 hover:text-navy bg-surface/70 hover:bg-surface border border-black/5 rounded-full pl-2.5 pr-3 py-1.5 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium hidden sm:inline">{t("common.backTo")}</span>
              </button>
            )}
            <Link href="/" className="flex flex-col leading-none shrink-0">
              <span className="text-lg sm:text-2xl tracking-tight whitespace-nowrap">
                <span className="font-light text-navy">Where To Go</span>
                <span className="text-gold font-bold">·</span>
                <span className="font-serif font-bold text-navy">YEG</span>
              </span>
            </Link>
            <div className="hidden md:block">
              <ContextPicker />
            </div>
          </div>

          {/* Center desktop: 3 buckets */}
          <div ref={desktopRef} className="hidden md:flex items-center gap-1">
            {BUCKETS.map((bucket) => {
              const isOpen = openBucket === bucket.id;
              return (
                <div key={bucket.id} className="relative">
                  <button
                    onClick={() => setOpenBucket(isOpen ? null : bucket.id)}
                    onMouseEnter={() => setOpenBucket(bucket.id)}
                    aria-expanded={isOpen}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium text-sm transition-colors ${
                      isOpen ? "bg-navy text-cream" : "text-navy/70 hover:text-navy hover:bg-surface"
                    }`}
                  >
                    {fr ? bucket.fr : bucket.en}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} strokeWidth={2} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        onMouseLeave={() => setOpenBucket(null)}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[420px] bg-surface border border-black/10 rounded-2xl shadow-xl p-3 z-50"
                      >
                        <div className="grid grid-cols-2 gap-1">
                          {bucket.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="block rounded-xl px-3 py-2 hover:bg-gold/10 transition-colors group"
                            >
                              <div className="font-semibold text-navy text-sm group-hover:text-[#9a7e34]">
                                {fr ? link.fr : link.en}
                              </div>
                              {link.desc && (
                                <div className="text-navy/55 text-[11px] leading-snug mt-0.5">
                                  {fr ? link.desc.fr : link.desc.en}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right: utilities */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAdmin && (
              <Link href="/admin" className="inline-flex items-center gap-1 text-gold hover:text-gold-dark font-semibold text-sm transition-colors">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.75} /> Admin
              </Link>
            )}
            {!isLoggedIn && (
              <Link href="/connexion" className="text-navy/70 hover:text-navy font-medium text-sm transition-colors">
                {t("nav.connexion")}
              </Link>
            )}
            <Link href="/recherche" aria-label={labels.search} className="text-navy/70 hover:text-gold transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link href="/mes-favoris" aria-label={labels.favs} className="text-navy/70 hover:text-gold transition-colors">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <button
              onClick={toggleLocale}
              aria-label={labels.lang}
              className="px-3 py-1.5 rounded-full bg-navy text-cream text-xs font-semibold tracking-wider hover:bg-navy-light transition-colors"
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
          </div>

          {/* Mobile right: ContextPicker, search, lang, menu */}
          <div className="md:hidden flex items-center gap-2">
            <ContextPicker />
            <button
              onClick={toggleLocale}
              aria-label={labels.lang}
              className="px-2.5 py-1 rounded-full bg-navy text-cream text-[11px] font-semibold"
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
            <button onClick={() => setOpen(!open)} aria-label={labels.menu} className="text-navy">
              {open ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {BUCKETS.map((bucket) => {
                const open = openMobileBucket === bucket.id;
                return (
                  <div key={bucket.id} className="border-b border-black/5 last:border-0 pb-2">
                    <button
                      onClick={() => setOpenMobileBucket(open ? null : bucket.id)}
                      className="w-full flex items-center justify-between py-2.5 text-navy font-semibold"
                    >
                      {fr ? bucket.fr : bucket.en}
                      <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-2 pb-1 space-y-0.5">
                            {bucket.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-navy/75 hover:text-navy text-sm"
                              >
                                {fr ? link.fr : link.en}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 pt-2 text-sm">
                <Link href="/recherche" className="text-navy/70 hover:text-gold inline-flex items-center gap-1">
                  <Search className="w-4 h-4" strokeWidth={1.5} /> {labels.search}
                </Link>
                <Link href="/mes-favoris" className="text-navy/70 hover:text-gold inline-flex items-center gap-1">
                  <Heart className="w-4 h-4" strokeWidth={1.5} /> {labels.favs}
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="ml-auto inline-flex items-center gap-1 text-gold font-semibold">
                    <ShieldCheck className="w-4 h-4" strokeWidth={1.75} /> Admin
                  </Link>
                )}
                {!isLoggedIn && (
                  <Link href="/connexion" className="ml-auto text-navy/70 hover:text-navy">{t("nav.connexion")}</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
