import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { ClassifiersClient } from "@/components/ClassifiersClient";
import { Skeleton } from "@/components/Skeleton";
import { getClassifiers } from "@/lib/data";

/** Skeleton بسيط لصفحة المصنّفات */
function ClassifiersSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5">
      {/* لافتة المراجعة */}
      <Skeleton className="mb-6 h-[72px]" />

      {/* البحث + الفلاتر */}
      <Skeleton className="mb-3 h-12" />
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-20" />
      </div>

      {/* قائمة المصنّفات */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px]" />
        ))}
      </div>
    </div>
  );
}

export default function ClassifiersPage() {
  const items = getClassifiers();
  return (
    <main className="min-h-screen">
      <Hero
        title="كلمات الكمية"
        subtitle={`${items.length} مصنِّف · الاستخدام وملاحظات المعلم`}
        emoji="量"
        kicker="量词用法 · 量词"
      />
      <Suspense fallback={<ClassifiersSkeleton />}>
        <ClassifiersClient items={items} />
      </Suspense>
    </main>
  );
}
