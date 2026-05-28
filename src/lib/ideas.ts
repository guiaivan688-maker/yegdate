import plansRaw from "@/data/weekend-plans.json";

export interface IdeaStep { time: string; title: { fr: string; en: string }; place: string; address: string; price: number; }
export interface IdeaPlan { id: string; segment: string; title: { fr: string; en: string }; image: string; ambiance: string; budgetTier: number; season: string[]; steps: IdeaStep[]; total: number; }

export const ideaPlans = plansRaw as IdeaPlan[];

interface SegmentDef { key: string; slug: string; fr: string; en: string; }

const SEGMENTS: SegmentDef[] = [
  { key: "couples", slug: "en-couple", fr: "en couple", en: "as a couple" },
  { key: "famille", slug: "en-famille", fr: "en famille", en: "as a family" },
  { key: "amis", slug: "entre-amis", fr: "entre amis", en: "with friends" },
  { key: "solo", slug: "en-solo", fr: "en solo", en: "solo" },
  { key: "business", slug: "affaires", fr: "entre collègues", en: "for work" },
];

const BUDGETS = [60, 120, 250];

export interface IdeaPage {
  slug: string;
  segment: string;
  maxBudget: number | null;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  h1: { fr: string; en: string };
}

function build(): IdeaPage[] {
  const pages: IdeaPage[] = [];
  for (const s of SEGMENTS) {
    pages.push({
      slug: `sorties-${s.slug}-edmonton`,
      segment: s.key,
      maxBudget: null,
      title: { fr: `Que faire ${s.fr} à Edmonton ? | Where To Go YEG`, en: `What to do ${s.en} in Edmonton? | Where To Go YEG` },
      description: {
        fr: `Idées de sorties ${s.fr} à Edmonton : soirées clé en main avec étapes, adresses et budget. Compose la tienne en quelques secondes.`,
        en: `Outing ideas ${s.en} in Edmonton: ready-made nights with steps, addresses and budget. Compose yours in seconds.`,
      },
      h1: { fr: `Que faire ${s.fr} à Edmonton ?`, en: `What to do ${s.en} in Edmonton?` },
    });
    for (const b of BUDGETS) {
      pages.push({
        slug: `sorties-${s.slug}-${b}-edmonton`,
        segment: s.key,
        maxBudget: b,
        title: { fr: `Sortir ${s.fr} à Edmonton pour ${b}$ | Where To Go YEG`, en: `Going out ${s.en} in Edmonton for $${b} | Where To Go YEG` },
        description: {
          fr: `Sorties ${s.fr} à Edmonton à ${b}$ ou moins : des soirées complètes qui tiennent dans ton budget.`,
          en: `Outings ${s.en} in Edmonton for $${b} or less: full nights that fit your budget.`,
        },
        h1: { fr: `Sortir ${s.fr} à Edmonton pour ${b}$ ou moins`, en: `Going out ${s.en} in Edmonton for $${b} or less` },
      });
    }
  }
  return pages;
}

export const ideaPages: IdeaPage[] = build();

export function getIdeaPage(slug: string): IdeaPage | undefined {
  return ideaPages.find((p) => p.slug === slug);
}

export function plansForIdea(page: IdeaPage): IdeaPlan[] {
  return ideaPlans
    .filter((p) => p.segment === page.segment)
    .filter((p) => page.maxBudget == null || p.total <= page.maxBudget)
    .sort((a, b) => a.total - b.total);
}
