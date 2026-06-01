import type { Metadata } from "next";
import ActivityDetail from "@/components/ActivityDetail";
import { allActivities, getActivityBySlug, type Activity } from "@/lib/activities";

const BASE = "https://wheretogoyeg.ca";

export function generateStaticParams() {
  return allActivities.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return { title: "Where To Go YEG" };
  return {
    title: `${activity.title.fr} — ${activity.location} | Where To Go YEG`,
    description: activity.description.fr,
    keywords: [...activity.tags, "Edmonton", activity.location],
    alternates: { canonical: `/activite/${activity.id}` },
    openGraph: {
      title: `${activity.title.fr} | Where To Go YEG`,
      description: activity.description.fr,
      images: [activity.image.startsWith("http") ? activity.image : `${BASE}${activity.image}`],
      type: "website",
    },
  };
}

function buildActivityJsonLd(activity: Activity) {
  const isFixedVenue = !activity.tags.includes("picnic"); // picnics travel by definition
  const imageUrl = activity.image.startsWith("http") ? activity.image : `${BASE}${activity.image}`;
  return {
    "@context": "https://schema.org",
    "@type": isFixedVenue ? "TouristAttraction" : "Service",
    name: activity.title.fr,
    alternateName: activity.title.en,
    description: activity.description.fr,
    image: imageUrl,
    url: `${BASE}/activite/${activity.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: activity.address,
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    geo: activity.coords ? {
      "@type": "GeoCoordinates",
      latitude: activity.coords[0],
      longitude: activity.coords[1],
    } : undefined,
    aggregateRating: activity.rating ? {
      "@type": "AggregateRating",
      ratingValue: activity.rating,
      ratingCount: 25,
      bestRating: 5,
    } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: activity.priceFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: activity.priceFrom,
        maxPrice: activity.priceTo,
        priceCurrency: "CAD",
      },
      availability: "https://schema.org/InStock",
      url: `${BASE}/reserver`,
    },
    areaServed: { "@type": "City", name: "Edmonton, Alberta" },
    inLanguage: ["fr-CA", "en-CA"],
    provider: { "@type": "Organization", name: "Where To Go YEG", url: BASE },
  };
}

export default async function ActivitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  const jsonLd = activity ? buildActivityJsonLd(activity) : null;
  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ActivityDetail slug={slug} />
    </>
  );
}
