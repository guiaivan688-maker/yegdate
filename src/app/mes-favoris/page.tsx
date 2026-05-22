"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartCrack } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { useFavorites } from "@/lib/favorites-context";
import { getActivityBySlug } from "@/lib/activities";
import ActivityCard from "@/components/ActivityCard";

export default function FavorisPage() {
  const { locale } = useLocale();
  const { favorites } = useFavorites();
  const fr = locale === "fr";

  const items = favorites.map((s) => getActivityBySlug(s)).filter(Boolean);

  return (
    <section className="py-16 sm:py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block w-12 h-1 gradient-gold rounded-full mb-5" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-3">{fr ? "Mon plan" : "My plan"}</h1>
          <p className="text-navy/60 text-lg">
            {fr ? "Vos activités sauvegardées, prêtes à réserver." : "Your saved activities, ready to book."}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <HeartCrack className="w-14 h-14 text-navy/20 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-navy/60 mb-6">
              {fr ? "Aucun favori pour l'instant. Cliquez sur le ♥ d'une activité pour la sauvegarder." : "No favorites yet. Tap the ♥ on an activity to save it."}
            </p>
            <Link href="/decouvrir" className="inline-block gradient-gold text-navy font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              {fr ? "Découvrir les activités" : "Discover activities"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((a, i) => a && <ActivityCard key={a.id} activity={a} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
