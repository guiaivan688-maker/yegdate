import couples from "@/data/activities-couples.json";
import famille from "@/data/activities-famille.json";
import amis from "@/data/activities-amis.json";
import business from "@/data/activities-business.json";
import type { Locale } from "./locale-context";

export interface Activity {
  id: string;
  slug: string;
  segment: "couples" | "famille" | "amis" | "business";
  title: Record<Locale, string>;
  location: string;
  address: string;
  description: Record<Locale, string>;
  longDescription: Record<Locale, string>;
  image: string;
  gallery: string[];
  priceRange: Record<Locale, string>;
  priceFrom: number;
  priceTo: number;
  budgetTier: number;
  duration: Record<Locale, string>;
  groupSize: Record<Locale, string>;
  ageRange?: Record<Locale, string>;
  season: string[];
  mood: string[];
  tags: string[];
  includes: Record<Locale, string[]>;
  services: string[];
  cta: "book" | "quote";
  rating: number;
  mapsQuery: string;
  coords: [number, number];
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return allActivities.find((a) => a.id === slug || a.slug === slug);
}

const bySegment: Record<string, Activity[]> = {
  couples: couples as Activity[],
  famille: famille as Activity[],
  amis: amis as Activity[],
  business: business as Activity[],
};

export const allActivities: Activity[] = [
  ...(couples as Activity[]),
  ...(famille as Activity[]),
  ...(amis as Activity[]),
  ...(business as Activity[]),
];

export function getActivitiesBySegment(segment: string): Activity[] {
  return bySegment[segment] ?? [];
}

export function getSimilarActivities(activity: Activity, count = 3): Activity[] {
  return getActivitiesBySegment(activity.segment)
    .filter((a) => a.id !== activity.id)
    .slice(0, count);
}
