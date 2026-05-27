// Connecteur Open Data — Ville d'Edmonton (calendrier public des événements).
// Source officielle, gratuite, mise à jour quotidiennement : data.edmonton.ca (API Socrata/SODA).
// Réutilisable sous les conditions d'open data de la Ville.
//
// La donnée ne contient PAS d'image -> on attribue une image par catégorie, prise
// dans les photos déjà vérifiées du site (donc jamais de 404). Pour des photos
// sur-mesure : déposer /public/images/events/<cat>.jpg et pointer l'URL ici.

export interface EventItem {
  name: string;
  location: string;
  description: string;
  tags: string[];
  dateLabel: Record<string, string>;
  dates: Record<string, string>;
  price: Record<string, string>;
  bookingUrl: string;
  image: string;
  source?: "city" | "curated";
  lat?: number;
  lng?: number;
}

interface CityRow {
  title?: string;
  begins?: string;
  ends?: string;
  event_type?: string;
  event_venue?: string;
  neighbourhood?: string;
  event_link?: { url?: string };
  latitude?: string;
  longitude?: string;
}

const DATASET = "64u3-c7bh";
const ENDPOINT = `https://data.edmonton.ca/resource/${DATASET}.json`;
const CITY_EVENTS_PAGE = "https://www.edmonton.ca/attractions_events/schedule-festivals-events";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80";

// Mot-clé du event_type -> { tag, image }. Images = photos vérifiées déjà utilisées sur le site.
const CATEGORIES: { test: RegExp; tag: string; image: string }[] = [
  { test: /festival/i,                          tag: "festival",   image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80" },
  { test: /music|concert|symphony|band/i,        tag: "musique",    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80" },
  { test: /sport|recreation|run|race|marathon/i, tag: "sport",      image: "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80" },
  { test: /art|exhibit|gallery|culture|theat/i,  tag: "arts",       image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
  { test: /market|farmer|food|culinary/i,        tag: "marché",     image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80" },
  { test: /parade|procession|community|nature/i, tag: "communauté", image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80" },
  { test: /family|children|kid/i,                tag: "famille",    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80" },
];

function categorize(eventType: string | undefined): { tag: string; image: string } {
  const t = eventType ?? "";
  for (const c of CATEGORIES) if (c.test.test(t)) return { tag: c.tag, image: c.image };
  return { tag: "à Edmonton", image: FALLBACK_IMG };
}

function fmt(dateStr: string, locale: string, opts: Intl.DateTimeFormatOptions): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", { ...opts, timeZone: "America/Edmonton" }).format(d);
}

function buildDates(begins: string, ends?: string) {
  const sameDay = !ends || begins.slice(0, 10) === ends.slice(0, 10);
  const full = (loc: string) =>
    sameDay
      ? fmt(begins, loc, { day: "numeric", month: "long", year: "numeric" })
      : `${fmt(begins, loc, { day: "numeric", month: "short" })} – ${fmt(ends!, loc, { day: "numeric", month: "short", year: "numeric" })}`;
  return {
    dateLabel: { fr: fmt(begins, "fr", { month: "short", day: "numeric" }), en: fmt(begins, "en", { month: "short", day: "numeric" }) },
    dates: { fr: full("fr"), en: full("en") },
  };
}

function seasonTags(begins: string): string[] {
  const m = new Date(begins).getMonth() + 1;
  if (m >= 5 && m <= 9) return ["été"];
  if (m >= 11 || m <= 3) return ["hiver"];
  return [];
}

/**
 * Récupère les événements à venir du calendrier public de la Ville d'Edmonton.
 * Mis en cache 24h (ISR). Renvoie [] en cas d'erreur réseau pour ne jamais casser la page.
 */
export async function getCityEvents(): Promise<EventItem[]> {
  const today = new Date().toISOString().slice(0, 10);
  const where = encodeURIComponent(`ends >= '${today}'`);
  const url = `${ENDPOINT}?$where=${where}&$order=begins&$limit=48`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const rows = (await res.json()) as CityRow[];
    return rows
      .filter((r) => r.title && r.begins)
      .map((r) => {
        const { tag, image } = categorize(r.event_type);
        const { dateLabel, dates } = buildDates(r.begins!, r.ends);
        const lat = r.latitude ? parseFloat(r.latitude) : undefined;
        const lng = r.longitude ? parseFloat(r.longitude) : undefined;
        return {
          name: r.title!,
          location: r.event_venue || r.neighbourhood || "Edmonton",
          description: r.event_type || "",
          tags: [tag, ...seasonTags(r.begins!)],
          dateLabel,
          dates,
          price: { fr: "Détails", en: "Details" },
          bookingUrl: r.event_link?.url || CITY_EVENTS_PAGE,
          image,
          source: "city" as const,
          ...(lat !== undefined && !isNaN(lat) && lng !== undefined && !isNaN(lng) ? { lat, lng } : {}),
        };
      });
  } catch {
    return [];
  }
}
