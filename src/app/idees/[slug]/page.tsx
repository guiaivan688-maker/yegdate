import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ideaPages, getIdeaPage } from "@/lib/ideas";
import IdeasList from "@/components/IdeasList";

export function generateStaticParams() {
  return ideaPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getIdeaPage(slug);
  if (!page) return { title: "Where To Go YEG" };
  return {
    title: page.title.fr,
    description: page.description.fr,
    alternates: { canonical: `/idees/${slug}` },
  };
}

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getIdeaPage(slug)) notFound();
  return <IdeasList slug={slug} />;
}
