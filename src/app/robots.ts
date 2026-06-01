import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/PROJECT-SPEC.txt", "/AUDIT-SITE.txt"],
    },
    sitemap: "https://wheretogoyeg.ca/sitemap.xml",
  };
}
