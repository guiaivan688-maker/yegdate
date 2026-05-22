"use client";

import { useLocale } from "@/lib/locale-context";

export default function ConditionsPage() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  const sections = fr
    ? [
        ["Objet", "YEG Date met en relation des résidents et visiteurs d'Edmonton avec des activités, lieux et prestataires locaux, et propose des services de planification d'expériences. En utilisant le site, vous acceptez ces conditions."],
        ["Réservations & devis", "Les prix affichés sont indicatifs et peuvent varier selon la disponibilité, la saison et le prestataire. Une demande de devis ou de réservation ne devient ferme qu'après confirmation écrite de notre part."],
        ["Annulation", "Sauf indication contraire, l'annulation est gratuite jusqu'à 72 heures avant la date prévue. Au-delà, des frais peuvent s'appliquer selon les conditions du prestataire."],
        ["Prestataires tiers", "Certaines activités sont opérées par des partenaires indépendants. Leurs propres conditions s'appliquent. YEG Date agit comme intermédiaire et coordonnateur."],
        ["Responsabilité", "Nous faisons de notre mieux pour assurer l'exactitude des informations (lieux, horaires, prix), mais ne pouvons garantir l'absence d'erreurs ou de changements. Votre participation aux activités se fait sous votre responsabilité."],
        ["Contact", "Pour toute question relative à ces conditions : hello@yegdate.ca."],
      ]
    : [
        ["Purpose", "YEG Date connects Edmonton residents and visitors with local activities, places and vendors, and offers experience-planning services. By using the site, you accept these terms."],
        ["Bookings & quotes", "Displayed prices are indicative and may vary by availability, season and vendor. A quote or booking request becomes firm only after our written confirmation."],
        ["Cancellation", "Unless otherwise stated, cancellation is free up to 72 hours before the scheduled date. Beyond that, fees may apply per the vendor's terms."],
        ["Third-party vendors", "Some activities are operated by independent partners whose own terms apply. YEG Date acts as an intermediary and coordinator."],
        ["Liability", "We do our best to keep information accurate (places, times, prices) but cannot guarantee it is error-free or unchanged. Participation in activities is at your own risk."],
        ["Contact", "For any question about these terms: hello@yegdate.ca."],
      ];

  return (
    <section className="py-16 sm:py-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-2">
          {fr ? "Conditions d'utilisation" : "Terms of Use"}
        </h1>
        <p className="text-navy/45 text-sm mb-10">{fr ? "Dernière mise à jour : mai 2026" : "Last updated: May 2026"}</p>
        <div className="space-y-8">
          {sections.map(([title, body]) => (
            <div key={title}>
              <h2 className="font-serif text-xl font-bold text-navy mb-2">{title}</h2>
              <p className="text-navy/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
