import type { Metadata } from "next";
import edmonton from "@/data/edmonton-data.json";
import { getCityEvents, type EventItem } from "@/lib/cityEvents";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Événements à Edmonton — festivals, concerts, sorties | YEG Date",
  description:
    "Tous les événements à venir à Edmonton : festivals, concerts, marchés, sports et sorties en famille. Mis à jour chaque jour depuis le calendrier officiel de la Ville d'Edmonton.",
};

export default async function EvenementsPage() {
  const staticEvents = edmonton.events as unknown as EventItem[];
  const cityEvents = await getCityEvents();

  // Évite les doublons (un même événement curé + venant de la Ville).
  const seen = new Set(staticEvents.map((e) => e.name.trim().toLowerCase()));
  const merged = [...staticEvents, ...cityEvents.filter((e) => !seen.has(e.name.trim().toLowerCase()))];

  return <EventsClient events={merged} />;
}
