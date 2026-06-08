import { Hero } from "@/components/Hero";
import { AchievementsClient } from "@/components/AchievementsClient";

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero
        title="إنجازاتي"
        subtitle="تتبّع رحلتك في تعلُّم الصينية"
        emoji="🏆"
        kicker="成就 · الإنجازات"
      />
      <AchievementsClient />
    </main>
  );
}
