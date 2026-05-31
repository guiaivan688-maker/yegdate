"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Camera, Flower2, UtensilsCrossed, ChefHat, Car, Video, type LucideIcon } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import plansData from "@/data/plans.json";

const SIGNATURE = "grande-romance";

const addonIcons: Record<string, LucideIcon> = { photographer: Camera, roomDecor: Flower2, picnic: UtensilsCrossed, chef: ChefHat, driver: Car, videographer: Video };

export default function PackagesPage() {
  const { locale, t } = useLocale();
  const fr = locale === "fr";
  const packages = plansData.packages;
  const signature = packages.find((p) => p.id === SIGNATURE);
  const others = packages.filter((p) => p.id !== SIGNATURE);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&q=80" alt="Edmonton experience packages" fill priority sizes="100vw" className="object-cover saturate-[0.85] contrast-[1.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block w-14 h-1 gradient-gold rounded-full mb-7" />
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream leading-tight mb-5">
              {fr ? "Des expériences clé en main, pensées dans les moindres détails" : "Turnkey experiences, considered down to the last detail"}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl mx-auto">
              {fr ? "Choisissez un forfait, ajoutez vos touches, on s'occupe de tout le reste." : "Choose a package, add your touches, and we handle everything else."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Signature package */}
      {signature && (
        <section className="py-20 px-4 bg-cream">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-black/5 shadow-sm bg-surface">
              <div className="relative h-72 lg:h-auto">
                <Image src={signature.image} alt={(signature.title as Record<string, string>)[locale]} fill className="object-cover saturate-[0.92]" sizes="(max-width:1024px) 100vw, 50vw" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-navy text-cream text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" strokeWidth={2} /> {fr ? "Signature" : "Signature"}
                </span>
              </div>
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <h2 className="font-serif text-3xl font-bold text-navy mb-2">{(signature.title as Record<string, string>)[locale]}</h2>
                <p className="text-navy/60 mb-6">{(signature.description as Record<string, string>)[locale]}</p>
                <ul className="space-y-2.5 mb-8">
                  {(signature.includes as Record<string, string[]>)[locale].map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-navy/75"><Check className="w-4 h-4 text-gold shrink-0 mt-1" strokeWidth={2} /> {item}</li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-3xl font-bold text-navy">${signature.price}</span>
                  <a href="/services#devis" className="gradient-gold text-navy font-bold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity">{t("packages.bookThis")}</a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other packages */}
      <section className="pb-20 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <a href="/weekend-match" className="block mb-10 rounded-2xl border border-navy/15 px-6 py-4 text-center text-navy/80 hover:bg-navy hover:text-cream transition-colors">
            {fr ? "Pas sûr de ton choix ? Essaie Weekend Match — on te recommande le forfait parfait en 4 questions →" : "Not sure? Try Weekend Match — we recommend the perfect package in 4 questions →"}
          </a>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((pkg, i) => {
              const includes = (pkg.includes as Record<string, string[]>)[locale];
              const quoteOnly = (pkg as { quoteOnly?: boolean }).quoteOnly === true;
              return (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6 }} className="bg-surface rounded-3xl border border-black/5 shadow-sm hover:shadow-xl overflow-hidden group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={pkg.image} alt={(pkg.title as Record<string, string>)[locale]} fill className="object-cover saturate-[0.92] group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 100vw, 33vw" />
                    <div className="absolute top-4 right-4 gradient-navy text-cream rounded-full px-4 py-2 text-sm font-bold">
                      {quoteOnly ? (fr ? "Sur devis" : "On quote") : `$${pkg.price}`}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-bold text-navy mb-2">{(pkg.title as Record<string, string>)[locale]}</h3>
                    <p className="text-navy/60 text-sm leading-relaxed mb-4">{(pkg.description as Record<string, string>)[locale]}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-navy/70"><Check className="w-4 h-4 text-gold shrink-0 mt-0.5" strokeWidth={2} /> {item}</li>
                      ))}
                    </ul>
                    <a href="/services#devis" className="block text-center w-full gradient-gold text-navy font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                      {quoteOnly ? t("common.quote") : t("packages.bookThis")}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personnalisez — add-ons */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">{fr ? "Personnalisez votre expérience" : "Personalize your experience"}</h2>
            <p className="text-navy/60 text-lg max-w-2xl mx-auto">{fr ? "Ajoutez ces options à n'importe quel forfait." : "Add these options to any package."}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {plansData.services.map((s, i) => {
              const Icon = addonIcons[s.id] ?? Sparkles;
              return (
                <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-surface rounded-2xl border border-black/5 p-5 text-center">
                  <Icon className="w-6 h-6 text-gold mx-auto mb-3" strokeWidth={1.5} />
                  <p className="font-medium text-navy text-sm leading-snug mb-1">{(s.title as Record<string, string>)[locale]}</p>
                  <p className="text-gold font-bold text-sm">+${s.price}</p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-center mt-8">
            <Link href="/sur-mesure" className="inline-block border-2 border-navy text-navy font-semibold px-8 py-3 rounded-full hover:bg-navy hover:text-cream transition-colors">
              {fr ? "Composer mon expérience sur-mesure" : "Build my custom experience"}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
