"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Heart, Sparkles, Volume2, BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import { useSpeech } from "@/lib/useSpeech";
import { useSrs } from "@/lib/spacedRepetition";
import { ClassifierFlashcards } from "@/components/ClassifierFlashcards";
import { ListeningPractice } from "@/components/ListeningPractice";
import { TypingPractice } from "@/components/TypingPractice";
import { PracticeModeChooser, type PracticeMode } from "@/components/PracticeModeChooser";
import type { Classifier } from "@/lib/types";

const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export function ClassifiersClient({ items }: { items: Classifier[] }) {
  const searchParams = useSearchParams();
  const initialHsk = (() => {
    const raw = searchParams.get("hsk");
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 && n <= 6 ? n : null;
  })();

  const [query, setQuery] = useState("");
  const [hsk, setHsk] = useState<number | null>(initialHsk);
  const [onlyFavs, setOnlyFavs] = useState(false);
  // اختيار الوضع (chooser screen)
  const [chooserOpen, setChooserOpen] = useState(false);
  // الوضع النشط حالياً (null = ما فيه session شغّالة)
  const [activeMode, setActiveMode] = useState<PracticeMode | null>(null);
  // مصدر الكلمات: "filtered" (من الفلاتر الحالية) أو "due" (المستحقات SRS)
  const [sessionSource, setSessionSource] = useState<"filtered" | "due">("filtered");

  const { has, toggle, count } = useFavorites();
  const { toast } = useToast();
  const { speak, supported } = useSpeech();
  const allIds = useMemo(() => items.map((i) => i.id), [items]);
  const { dueCount, getDueIds, newCount } = useSrs(allIds);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      if (hsk !== null && c.hsk !== hsk) return false;
      if (onlyFavs && !has(c.id)) return false;
      if (!q) return true;
      return (
        c.char.includes(q) ||
        c.pinyin.toLowerCase().includes(q) ||
        c.ar.includes(q) ||
        c.usage.includes(q) ||
        c.examples.some((e) => e.zh.includes(q) || e.ar.includes(q))
      );
    });
  }, [items, query, hsk, onlyFavs, has]);

  function onToggleFav(c: Classifier) {
    const wasFav = has(c.id);
    toggle(c.id);
    toast(
      wasFav ? `أُزيل "${c.char}" من المفضلة` : `تمت إضافة "${c.char}" للمفضلة`,
      wasFav ? "info" : "success"
    );
  }

  function startPractice() {
    if (filtered.length === 0) {
      toast("لا توجد مصنِّفات للتدريب — عدّل الفلاتر", "error");
      return;
    }
    setSessionSource("filtered");
    setChooserOpen(true);
  }

  function startSrsReview() {
    if (dueCount === 0) {
      toast("لا توجد كلمات مستحقة للمراجعة 🎉", "info");
      return;
    }
    setSessionSource("due");
    setChooserOpen(true);
  }

  function handleModeSelected(mode: PracticeMode) {
    setChooserOpen(false);
    setActiveMode(mode);
  }

  function handleSessionClose() {
    setActiveMode(null);
  }

  // البطاقات حسب المصدر
  const practiceItems = useMemo(() => {
    if (sessionSource === "due") {
      const dueIds = new Set(getDueIds());
      return items.filter((i) => dueIds.has(i.id));
    }
    return filtered;
  }, [sessionSource, filtered, getDueIds, items]);

  // عدد الكلمات للعرض في chooser
  const sessionCount = sessionSource === "due" ? dueCount : filtered.length;

  function onSpeak(text: string) {
    if (!supported) {
      toast("متصفّحك لا يدعم النطق التلقائي", "error");
      return;
    }
    speak(text);
  }

  return (
    <>
      {/* شاشة اختيار الوضع */}
      {chooserOpen && (
        <PracticeModeChooser
          dueCount={sessionCount}
          onSelect={handleModeSelected}
          onClose={() => setChooserOpen(false)}
        />
      )}

      {/* الوضع العادي */}
      {activeMode === "normal" && (
        <ClassifierFlashcards
          items={practiceItems}
          mode={sessionSource === "due" ? "srs" : "normal"}
          onClose={handleSessionClose}
        />
      )}

      {/* وضع الاستماع */}
      {activeMode === "listening" && (
        <ListeningPractice
          items={practiceItems}
          allItems={items}
          onClose={handleSessionClose}
        />
      )}

      {/* وضع الكتابة */}
      {activeMode === "typing" && (
        <TypingPractice
          items={practiceItems}
          allItems={items}
          onClose={handleSessionClose}
        />
      )}

      <div className="mx-auto max-w-2xl px-4 sm:px-5">
        {/* لافتة المراجعة المتباعدة */}
        <button
          onClick={startSrsReview}
          disabled={dueCount === 0}
          className={cn(
            "mb-4 flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3.5 text-right transition-all",
            dueCount > 0
              ? "border border-violet/30 bg-gradient-to-l from-violet/5 to-violet-soft text-ink shadow-card hover:shadow-cardHover"
              : "cursor-default border border-[#F0F0F0] bg-[#FAFAFA] text-muted"
          )}
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              dueCount > 0 ? "bg-violet text-white" : "bg-[#E8E8E8] text-[#A0A0A0]"
            )}
          >
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold">
              {dueCount > 0 ? (
                <>
                  <span className="text-violet">{dueCount}</span>{" "}
                  {dueCount === 1 ? "كلمة" : "كلمات"} مستحقة للمراجعة
                </>
              ) : (
                "لا توجد مراجعات مستحقة"
              )}
            </div>
            <div className="mt-0.5 text-[11px] font-semibold opacity-80">
              {dueCount > 0
                ? `${newCount} جديدة · اضغط لبدء جلسة المراجعة`
                : "أحسنت! ارجع لاحقاً للمراجعة"}
            </div>
          </div>
          {dueCount > 0 && (
            <span className="shrink-0 rounded-full bg-violet px-2.5 py-1 text-[11px] font-extrabold text-white">
              ابدأ
            </span>
          )}
        </button>

        {/* البحث */}
        <div className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث: 个 / gè / عام / للأشياء / 一个人..."
            dir="rtl"
            className={cn(
              "w-full rounded-2xl border bg-white px-12 py-3.5 text-[15px] outline-none transition-colors",
              query ? "border-violet" : "border-[#E8E8E8]"
            )}
          />
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B0B0B0]" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
              aria-label="مسح"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mb-3">
          <div className="mb-1.5 text-[11px] font-bold text-muted">المستوى</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setHsk(null)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors",
                hsk === null
                  ? "bg-violet text-white"
                  : "bg-[#F7F7F7] text-muted hover:bg-[#EEEEEE]"
              )}
            >
              الكل
            </button>
            {HSK_LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => setHsk(lv)}
                className={cn(
                  "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors",
                  hsk === lv
                    ? "bg-violet text-white"
                    : "bg-[#F7F7F7] text-muted hover:bg-[#EEEEEE]"
                )}
              >
                HSK {lv}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOnlyFavs((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors",
              onlyFavs
                ? "bg-coral text-white"
                : "bg-[#F7F7F7] text-muted hover:bg-[#EEEEEE]"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", onlyFavs && "fill-current")} />
            المفضلة {count > 0 && `(${count})`}
          </button>

          <button
            onClick={startPractice}
            className="ms-auto flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-black"
          >
            <Sparkles className="h-3.5 w-3.5" />
            ابدأ التمرين
          </button>
        </div>

        <div className="mb-3 text-xs font-semibold text-muted">
          {filtered.length} مصنِّف
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="rounded-2xl bg-[#F7F7F7] p-8 text-center text-sm text-muted">
              لا توجد نتائج
            </div>
          )}

          {filtered.map((c) => (
            <article
              key={c.id}
              className="rounded-3xl border border-[#F0F0F0] bg-white p-5 shadow-card"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onSpeak(c.char)}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-soft transition-transform hover:scale-105"
                  aria-label={`نطق ${c.char}`}
                >
                  <span className="font-cn text-3xl font-bold text-violet">
                    {c.char}
                  </span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[13px] italic text-muted" dir="ltr">
                      {c.pinyin}
                    </span>
                    <span className="rounded-md bg-violet-soft px-2 py-0.5 text-[10px] font-bold text-violet">
                      HSK {c.hsk}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-extrabold text-ink">
                    {c.ar}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted">
                    {c.usage}
                  </p>
                </div>

                <button
                  onClick={() => onToggleFav(c)}
                  className="shrink-0 rounded-xl p-1.5 transition-colors hover:bg-[#F7F7F7]"
                  aria-label="إضافة للمفضلة"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      has(c.id) ? "fill-coral text-coral" : "text-[#C8C8C8]"
                    )}
                  />
                </button>
              </div>

              {c.examples.length > 0 && (
                <div className="mt-4 space-y-2">
                  {c.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => onSpeak(ex.zh)}
                      className="flex w-full items-center gap-2 rounded-xl bg-violet-soft/40 px-3 py-2 text-right transition-colors hover:bg-violet-soft"
                    >
                      <Volume2 className="h-4 w-4 shrink-0 text-violet" />
                      <div className="flex-1">
                        <div dir="ltr" className="font-cn text-[15px] text-ink">
                          {ex.zh}
                        </div>
                        <div className="text-xs text-muted">{ex.ar}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
