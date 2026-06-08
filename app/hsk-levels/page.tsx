import { Hero } from "@/components/Hero";
import { HskLevelsClient } from "@/components/HskLevelsClient";

export default function HskLevelsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero
        title="مستويات HSK"
        subtitle="اختر النظام والمستوى الذي يناسبك"
        emoji="📚"
        kicker="水平 · المستويات"
      />
      <HskLevelsClient />
    </main>
  );
}
