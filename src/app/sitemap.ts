import type { MetadataRoute } from "next";
import { allActivities } from "@/lib/activities";
import { ideaPages } from "@/lib/ideas";

const BASE = "https://wheretogoyeg.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/decouvrir",
    "/evenements",
    "/weekend-match",
    "/sur-mesure",
    "/couples",
    "/famille",
    "/amis",
    "/business",
    "/buffets",
    "/services",
    "/packages",
    "/night-out",
    "/about",
    "/contact",
    "/guides",
    "/idees",
    "/compositeur",
    "/reserver",
    "/carte",
    "/recherche",
    "/mes-favoris",
    "/confidentialite",
    "/conditions",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const activityRoutes = allActivities.map((a) => ({
    url: `${BASE}/activite/${a.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const ideaRoutes = ideaPages.map((p) => ({
    url: `${BASE}/idees/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...activityRoutes, ...ideaRoutes];
}
