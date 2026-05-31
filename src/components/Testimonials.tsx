"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { useLocale } from "@/lib/locale-context";

type Testimonial = {
  name: string;
  initials: string;
  avatarStyle: "navy" | "gold";
  occasion: { fr: string; en: string };
  neighbourhood: { fr: string; en: string };
  text: { fr: string; en: string };
};

const testimonials: Testimonial[] = [
  {
    name: "Marc & Lucie T.",
    initials: "ML",
    avatarStyle: "navy",
    occasion: { fr: "Anniversaire de mariage", en: "Wedding anniversary" },
    neighbourhood: { fr: "Riverbend", en: "Riverbend" },
    text: {
      fr: "On a réservé le streetcar du High Level pour nos 10 ans de mariage. Mention spéciale pour le mousseux sans alcool — j'étais enceinte, ils ont géré sans qu'on demande. Le coucher de soleil sur la rivière, à 50 m au-dessus du vide, je vais m'en souvenir longtemps.",
      en: "We booked the High Level streetcar for our 10th anniversary. Special shout-out for the non-alcoholic sparkling — I was pregnant and they handled it without us having to ask. The sunset over the river, 50 m up, I'll remember for a long time.",
    },
  },
  {
    name: "Jasmine O.",
    initials: "JO",
    avatarStyle: "gold",
    occasion: { fr: "EVJF", en: "Bachelorette" },
    neighbourhood: { fr: "Strathcona", en: "Strathcona" },
    text: {
      fr: "Le Pedal Pub pour l'EVJF de ma sœur, c'était la meilleure soirée. La conductrice nous a fait passer par les bons spots de Whyte Ave, on a chanté du Shania Twain à tue-tête, tout le monde a dansé. Réservé en 3 clics, payé par 6 personnes via le lien — zéro stress.",
      en: "Pedal Pub for my sister's bachelorette was the best night. The driver took us through the right Whyte Ave spots, we belted out Shania Twain, everyone danced. Booked in 3 clicks, split between 6 of us via the link — zero stress.",
    },
  },
  {
    name: "Famille Tremblay",
    initials: "FT",
    avatarStyle: "navy",
    occasion: { fr: "Pique-nique famille", en: "Family picnic" },
    neighbourhood: { fr: "Bonnie Doon", en: "Bonnie Doon" },
    text: {
      fr: "Pique-nique design au Borden Park sous le Vaulted Willow avec nos deux gars (5 et 8 ans). La box enfants avec les sandwichs en forme d'animaux a fait son effet. Pendant qu'on était sur le plaid, eux jouaient sur le playground à côté — exactement ce qu'on cherchait pour un dimanche.",
      en: "Design picnic at Borden Park under the Vaulted Willow with our two boys (5 and 8). The kid boxes with animal-shaped sandwiches were a hit. While we relaxed on the blanket, they played on the playground right there — exactly what we wanted for a Sunday.",
    },
  },
  {
    name: "David P.",
    initials: "DP",
    avatarStyle: "gold",
    occasion: { fr: "Demande en mariage", en: "Proposal" },
    neighbourhood: { fr: "Garneau", en: "Garneau" },
    text: {
      fr: "Pique-nique coucher de soleil à Queen Elizabeth Park face au Walterdale Bridge — c'est là que je lui ai demandée. Ils ont caché la bague dans le panier comme on avait convenu, le photographe était à 20 m, discret. Elle a dit oui. Tout était à sa place, je n'ai eu qu'à respirer.",
      en: "Sunset picnic at Queen Elizabeth Park facing the Walterdale Bridge — that's where I proposed. They hid the ring in the basket as planned, the photographer was 20 m away, discreet. She said yes. Everything was in place, all I had to do was breathe.",
    },
  },
  {
    name: "Sophie L.",
    initials: "SL",
    avatarStyle: "navy",
    occasion: { fr: "Sortie entre amis", en: "Friends night" },
    neighbourhood: { fr: "Oliver", en: "Oliver" },
    text: {
      fr: "Six d'entre nous chez Bad Axe Throwing un vendredi soir — la coach a été patiente avec celles qui n'avaient jamais lancé, et le mini-tournoi a vraiment chauffé. On a fini sur Whyte ensuite, mais c'est le lancer de hache dont tout le monde parle encore au bureau.",
      en: "Six of us at Bad Axe Throwing on a Friday night — the coach was patient with the ones who'd never thrown, and the mini-tournament got genuinely heated. We ended up on Whyte after, but axe throwing is what everyone's still talking about at the office.",
    },
  },
  {
    name: "Amélie & Karim B.",
    initials: "AK",
    avatarStyle: "gold",
    occasion: { fr: "Sortie famille", en: "Family outing" },
    neighbourhood: { fr: "Windermere", en: "Windermere" },
    text: {
      fr: "TELUS World of Science un samedi pluvieux, billets et stationnement réservés via le site, sans faire la file. Notre fille de 7 ans est sortie du planétarium en disant qu'elle voulait être astronaute. On y retournera dès que l'expo temporaire change.",
      en: "TELUS World of Science on a rainy Saturday, tickets and parking booked through the site, no line. Our 7-year-old came out of the planetarium saying she wanted to be an astronaut. We'll be back as soon as the temporary exhibit changes.",
    },
  },
];

const avatarClass = {
  navy: "gradient-navy text-gold",
  gold: "gradient-gold text-navy",
} as const;

export default function Testimonials() {
  const { locale, t } = useLocale();

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">
            {t("sections.testimonialsTitle")}
          </h2>
          <p className="text-navy/60 text-lg">{t("sections.testimonialsSubtitle")}</p>
          <div className="w-16 h-1 gradient-gold rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 snap-x">
          {testimonials.map((item, i) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-auto bg-surface rounded-3xl border border-black/5 shadow-sm p-7 flex flex-col"
            >
              <div
                className="flex items-center justify-between mb-4"
                aria-label={locale === "fr" ? "Note : 5 sur 5" : "Rating: 5 out of 5"}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} className="w-4 h-4 text-gold" />
                  ))}
                </div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full">
                  {item.occasion[locale]}
                </span>
              </div>

              <blockquote className="text-navy/80 text-sm leading-relaxed mb-6 italic flex-1">
                &ldquo;{item.text[locale]}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-black/5">
                <div
                  className={`w-11 h-11 rounded-full ${avatarClass[item.avatarStyle]} flex items-center justify-center font-serif font-bold text-sm shrink-0`}
                  aria-hidden="true"
                >
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-navy font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-navy/50 text-xs truncate">{item.neighbourhood[locale]}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
