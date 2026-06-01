import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import SpecClient from "./SpecClient";

export const metadata: Metadata = {
  title: "Spécifications projet — Where To Go YEG (Admin)",
  robots: { index: false, follow: false },
};

export default async function SpecPage() {
  const filePath = path.join(process.cwd(), "docs", "PROJECT-SPEC.md");
  let markdown = "";
  let error: string | null = null;
  try {
    markdown = await fs.readFile(filePath, "utf8");
  } catch (e) {
    error = (e as Error).message;
  }

  return <SpecClient markdown={markdown} error={error} />;
}
