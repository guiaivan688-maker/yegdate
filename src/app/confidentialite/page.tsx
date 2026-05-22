"use client";

import { useLocale } from "@/lib/locale-context";

export default function ConfidentialitePage() {
  const { locale } = useLocale();
  const fr = locale === "fr";

  const sections = fr
    ? [
        ["Qui sommes-nous", "YEG Date est une plateforme indépendante de planification d'expériences à Edmonton (Alberta, Canada). Pour toute question : hello@yegdate.ca."],
        ["Données que nous collectons", "Nous collectons uniquement les informations que vous nous fournissez via nos formulaires (nom, courriel, téléphone, message, détails de votre demande). Vos favoris et votre préférence de langue sont stockés localement dans votre navigateur (localStorage) et ne nous sont pas transmis."],
        ["Utilisation des données", "Vos informations servent uniquement à répondre à vos demandes de devis ou de réservation et, si vous vous inscrivez, à vous envoyer notre infolettre. Nous ne vendons jamais vos données."],
        ["Partage", "Nous ne partageons vos informations qu'avec les prestataires nécessaires à votre demande (ex. restaurant, photographe), et avec notre service d'envoi de courriels. Aucun autre partage."],
        ["Cookies & analytics", "Nous utilisons un outil d'analyse respectueux de la vie privée, sans cookies de pistage publicitaire. Le localStorage sert uniquement à vos favoris et à la langue."],
        ["Vos droits", "Vous pouvez demander l'accès, la correction ou la suppression de vos données à tout moment en écrivant à hello@yegdate.ca."],
      ]
    : [
        ["Who we are", "YEG Date is an independent experience-planning platform in Edmonton (Alberta, Canada). Questions: hello@yegdate.ca."],
        ["Data we collect", "We only collect information you provide through our forms (name, email, phone, message, request details). Your favorites and language preference are stored locally in your browser (localStorage) and are not sent to us."],
        ["How we use data", "Your information is used only to respond to your quote or booking requests and, if you subscribe, to send our newsletter. We never sell your data."],
        ["Sharing", "We only share your information with vendors needed for your request (e.g. restaurant, photographer) and with our email delivery service. No other sharing."],
        ["Cookies & analytics", "We use a privacy-friendly analytics tool with no advertising trackers. localStorage is used only for your favorites and language."],
        ["Your rights", "You may request access, correction or deletion of your data anytime by emailing hello@yegdate.ca."],
      ];

  return (
    <section className="py-16 sm:py-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-2">
          {fr ? "Politique de confidentialité" : "Privacy Policy"}
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
