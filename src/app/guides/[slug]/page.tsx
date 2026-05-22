import type { Metadata } from "next";
import GuideArticle from "@/components/GuideArticle";
import guides from "@/data/guides.json";

interface Guide { slug: string; title: Record<string, string>; excerpt: Record<string, string>; }

export function generateStaticParams() {
  return (guides as Guide[]).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = (guides as Guide[]).find((x) => x.slug === slug);
  if (!g) return { title: "YEG Date" };
  return {
    title: `${g.title.fr} | YEG Date`,
    description: g.excerpt.fr,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuideArticle slug={slug} />;
}
