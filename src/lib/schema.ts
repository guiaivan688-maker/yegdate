import { getActivitiesBySegment } from "./activities";

const BASE = "https://wheretogoyeg.ca";

export function buildSegmentItemListJsonLd(segment: "couples" | "famille" | "amis" | "business") {
  const activities = getActivitiesBySegment(segment);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Activités ${segment} à Edmonton`,
    inLanguage: ["fr-CA", "en-CA"],
    numberOfItems: activities.length,
    itemListElement: activities.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE}/activite/${a.id}`,
      name: a.title.fr,
      image: a.image.startsWith("http") ? a.image : `${BASE}${a.image}`,
    })),
  };
}

export function buildPicnicServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pique-nique sur-mesure à Edmonton",
    serviceType: "Picnic planning service",
    description:
      "Compose ton pique-nique à Edmonton : 23 lieux (Walterdale, Hawrelak, Borden, Muttart Conservatory, Mill Creek…), options décoration, photographe, panier gourmet, demande en mariage.",
    provider: { "@type": "Organization", name: "Where To Go YEG", url: BASE },
    areaServed: { "@type": "City", name: "Edmonton, Alberta" },
    url: `${BASE}/pique-nique`,
    inLanguage: ["fr-CA", "en-CA"],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: 89,
      highPrice: 1199,
      offerCount: 23,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
