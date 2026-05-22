import type { Metadata } from "next";
import ActivityDetail from "@/components/ActivityDetail";
import { allActivities, getActivityBySlug } from "@/lib/activities";

export function generateStaticParams() {
  return allActivities.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return { title: "YEG Date" };
  return {
    title: `${activity.title.fr} — ${activity.location} | YEG Date`,
    description: activity.description.fr,
    keywords: [...activity.tags, "Edmonton", activity.location],
    openGraph: {
      title: `${activity.title.fr} | YEG Date`,
      description: activity.description.fr,
      images: [activity.image],
    },
  };
}

export default async function ActivitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ActivityDetail slug={slug} />;
}
