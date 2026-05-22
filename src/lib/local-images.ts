// ─────────────────────────────────────────────────────────────────────────
// LOCAL EDMONTON PHOTO OVERRIDES (Chantier 3)
//
// HOW TO REPLACE A STOCK IMAGE WITH A REAL EDMONTON PHOTO:
//   1. Drop your photo in  /public/images/<segment>/<slug>.jpg
//      e.g.  /public/images/couples/streetcar-prive-high-level.jpg
//   2. Add the slug to the LOCAL_IMAGES set below.
//   3. That's it — the site will use your local photo everywhere instead of
//      the Unsplash fallback. Until a slug is listed here, the verified
//      thematic Unsplash image is used (so nothing ever 404s).
//
// Recommended look (matches the brand): high resolution, slightly desaturated,
// high contrast, 1200px+ wide. See /public/images/README.md for the full list.
// ─────────────────────────────────────────────────────────────────────────

// Slugs that have a real local photo available at /images/<segment>/<slug>.jpg
export const LOCAL_IMAGES = new Set<string>([
  // "streetcar-prive-high-level",
  // "pique-nique-river-valley",
]);

const SEGMENT_DIR: Record<string, string> = {
  couples: "couples",
  famille: "famille",
  amis: "amis",
  business: "business",
};

/**
 * Returns the local Edmonton photo if registered, otherwise the fallback URL.
 */
export function resolveImage(slug: string | undefined, segment: string | undefined, fallback: string): string {
  if (slug && LOCAL_IMAGES.has(slug)) {
    const dir = SEGMENT_DIR[segment ?? ""] ?? "misc";
    return `/images/${dir}/${slug}.jpg`;
  }
  return fallback;
}
