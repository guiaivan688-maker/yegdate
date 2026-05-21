import ActivityDetail from "@/components/ActivityDetail";
import { allActivities } from "@/lib/activities";

export function generateStaticParams() {
  return allActivities.map((a) => ({ slug: a.id }));
}

export default async function ActivitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ActivityDetail slug={slug} />;
}
