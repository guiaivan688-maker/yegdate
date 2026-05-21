import type { MetadataRoute } from "next";
import { allActivities } from "@/lib/activities";

const BASE = "https://yegdate.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/decouvrir",
    "/weekend-match",
    "/couples",
    "/famille",
    "/amis",
    "/business",
    "/buffets",
    "/services",
    "/packages",
    "/about",
    "/contact",
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

  return [...staticRoutes, ...activityRoutes];
}
