import type { Activity } from "./activities";
import type { Locale } from "./locale-context";

export const NEIGHBOURHOODS = [
  "Downtown",
  "Ice District",
  "Whyte Ave",
  "West Edmonton",
  "Edmonton NW",
  "Edmonton NE",
  "Edmonton SW",
  "Edmonton SE",
] as const;
export type Neighbourhood = (typeof NEIGHBOURHOODS)[number];

export function getNeighbourhood(address: string): Neighbourhood | "Other" {
  const a = address.toLowerCase();
  if (a.includes("ice district") || a.includes("rogers place") || a.includes("jasper ave")) return "Ice District";
  if (a.includes("whyte") || a.includes("strathcona") || a.includes("82 ave") || a.includes("83 ave") || a.includes("84 ave")) return "Whyte Ave";
  if (a.includes("west edmonton mall") || a.includes("170 st") || a.includes("178 st") || a.includes("87 ave nw") && a.includes("17")) return "West Edmonton";
  if (a.match(/\b10[0-5] (st|ave|street|avenue)\b/) || a.includes("downtown") || a.includes("104 ave") || a.includes("104 st") || a.includes("city centre")) return "Downtown";
  const quad = a.match(/\b(nw|ne|sw|se)\b/);
  if (quad) {
    const q = quad[1].toUpperCase() as "NW" | "NE" | "SW" | "SE";
    return `Edmonton ${q}` as Neighbourhood;
  }
  return "Other";
}

export function parseGroupSize(gs: string): { min: number; max: number } {
  const range = gs.match(/(\d+)\s*[-–à]\s*(\d+)/);
  if (range) return { min: parseInt(range[1]), max: parseInt(range[2]) };
  const single = gs.match(/(\d+)/);
  if (single) {
    const n = parseInt(single[1]);
    return { min: n, max: Math.max(n, 100) };
  }
  return { min: 1, max: 100 };
}

export function fitsGroupSize(activity: Activity, guests: number, locale: Locale): boolean {
  const text = activity.groupSize[locale] || activity.groupSize.fr || "";
  const { min, max } = parseGroupSize(text);
  return guests >= min && guests <= max;
}

export function getPricingUnit(activity: Activity, locale: Locale): "person" | "couple" | "family" | "group" {
  const text = (activity.priceRange[locale] || activity.priceRange.fr || "").toLowerCase();
  if (text.includes("/ pers") || text.includes("personne") || text.includes("/ person") || text.includes("/person")) return "person";
  if (text.includes("couple")) return "couple";
  if (text.includes("famille") || text.includes("family")) return "family";
  return "group";
}

export function computeEstimate(
  activity: Activity,
  guests: number,
  locale: Locale,
): { from: number; to: number; unit: "person" | "couple" | "family" | "group"; multiplier: number } {
  const unit = getPricingUnit(activity, locale);
  let multiplier = 1;
  if (unit === "person") multiplier = guests;
  else if (unit === "couple") multiplier = Math.max(1, Math.ceil(guests / 2));
  else if (unit === "family") multiplier = Math.max(1, Math.ceil(guests / 4));
  return {
    from: activity.priceFrom * multiplier,
    to: activity.priceTo * multiplier,
    unit,
    multiplier,
  };
}

export function formatEstimate(
  est: { from: number; to: number },
  guests: number,
  locale: Locale,
): string {
  const fr = locale === "fr";
  const label = fr ? `${guests} pers` : `${guests} ppl`;
  if (est.from === est.to) return fr ? `${est.from}$ pour ${label}` : `$${est.from} for ${label}`;
  return fr ? `${est.from}$ – ${est.to}$ pour ${label}` : `$${est.from}–$${est.to} for ${label}`;
}
