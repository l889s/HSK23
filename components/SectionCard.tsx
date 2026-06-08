"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Section, Accent } from "@/lib/types";

const accentText: Record<Accent, string> = {
  coral: "text-coral",
  violet: "text-violet",
  mint: "text-mint",
};

const accentSoftBg: Record<Accent, string> = {
  coral: "bg-coral-soft",
  violet: "bg-violet-soft",
  mint: "bg-mint-soft",
};

// يحوّل id القسم إلى رابط المستوى المُفلتر
function levelHref(section: Section, level: string): string {
  if (section.id === "lc") {
    // المصنِّفات: فلتر HSK رقم
    return `/classifiers?hsk=${encodeURIComponent(level)}`;
  }
  const sys = section.id === "n1" ? "3" : "2";
  return `/hsk-levels?system=${sys}&level=${encodeURIComponent(level)}`;
}

export function SectionCard({ section }: { section: Section }) {
  const router = useRouter();
  const { href, emoji, accent, tag, badge, zh, title, sub, count, unit, levels } =
    section;

  return (
    <Card
      onClick={() => router.push(href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
      aria-label={title}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl",
            accentSoftBg[accent]
          )}
        >
          <span>{emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant={accent}>{badge}</Badge>
            <span className="text-xs font-semibold text-[#A8A8A8]">{tag}</span>
          </div>
          <h3 className="mb-1 text-xl font-extrabold text-ink leading-tight">
            {title}
          </h3>
          <p
            className={cn(
              "mb-2 font-cn text-[13px] font-medium",
              accentText[accent]
            )}
          >
            {zh}
          </p>
          <p className="text-[13px] leading-relaxed text-muted">{sub}</p>
        </div>

        <div className="shrink-0 text-left">
          <div className={cn("text-lg font-black leading-none", accentText[accent])}>
            {count}
          </div>
          <div className="mt-1 text-[10px] text-[#B0B0B0]">{unit}</div>
        </div>
      </div>

      {/* شارات المستويات — قابلة للنقر */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {levels.map((lv) => (
          <Link
            key={lv}
            href={levelHref(section, lv)}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg bg-[#F7F7F7] px-2.5 py-1 text-xs font-semibold text-[#666] whitespace-nowrap transition-colors hover:bg-[#EEEEEE]"
          >
            HSK {lv}
          </Link>
        ))}
      </div>

      <div
        className={cn(
          "absolute bottom-4 left-4 flex h-8 w-8 items-center justify-center rounded-xl",
          accentSoftBg[accent],
          accentText[accent]
        )}
      >
        <ArrowLeft className="h-4 w-4" />
      </div>
    </Card>
  );
}
