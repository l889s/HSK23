import { Hero } from "@/components/Hero";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { getClassifiers } from "@/lib/data";

export default function PracticePage() {
  const items = getClassifiers();
  return (
    <main className="min-h-screen">
      <Hero
        title="تمارين Flashcards"
        subtitle="راجع المصنِّفات بطريقة تفاعلية — اكشف الإجابة بعد التفكير"
        emoji="✨"
        kicker="练习 · ممارسة"
      />
      <FlashcardDeck items={items} />
    </main>
  );
}
