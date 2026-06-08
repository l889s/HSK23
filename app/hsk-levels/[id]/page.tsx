import { notFound } from "next/navigation";
import { getHskLevel, getWordsForLevel } from "@/lib/data";
import { LevelWordsClient } from "@/components/LevelWordsClient";

export default function LevelDetailPage({ params }: { params: { id: string } }) {
  const found = getHskLevel(params.id);
  if (!found) return notFound();
  const words = getWordsForLevel(params.id);
  return (
    <main className="min-h-screen">
      <LevelWordsClient level={found.level} words={words} />
    </main>
  );
}
