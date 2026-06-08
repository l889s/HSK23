"use client";

import Link from "next/link";
import { Flame, ChevronLeft } from "lucide-react";
import { useDaily } from "@/lib/streak";
import { cn } from "@/lib/utils";

export function DailyStreakChip() {
  const { ready, state } = useDaily();
  if (!ready) return <div className="h-[68px]" aria-hidden />;

  const { streak, today, goal } = state;
  const pct = Math.min(100, Math.round((today.count / goal) * 100));
  const isOnStreak = streak.current > 0;

  return (
    <Link
      href="/achievements"
      className="mx-auto mb-4 block max-w-2xl px-4 sm:px-5"
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 overflow-hidden rounded-2xl p-3.5 text-white shadow-coral"
        )}
        style={{
          background: isOnStreak
            ? "linear-gradient(135deg, #FF6B35 0%, #FF4D4F 100%)"
            : "linear-gradient(135deg, #8C8C8C 0%, #6C6C6C 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <Flame
            className={cn(
              "h-8 w-8",
              isOnStreak ? "fill-amber-300 text-amber-300" : "text-white/70"
            )}
            style={{
              filter: isOnStreak
                ? "drop-shadow(0 0 8px rgba(252,211,77,.7))"
                : "none",
            }}
          />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tabular-nums">{streak.current}</span>
              <span className="text-xs font-bold opacity-90">يوم متتالي</span>
            </div>
            <div className="mt-0.5 text-[11px] font-semibold opacity-90">
              {today.goalMet
                ? "✅ تحقّق الهدف اليوم"
                : `${today.count} / ${goal} كلمة اليوم`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* شريط دائري صغير للهدف */}
          <div className="relative h-10 w-10">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="16" fill="none"
                stroke="#fff" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={2 * Math.PI * 16 * (1 - pct / 100)}
                transform="rotate(-90 20 20)"
                style={{ transition: "stroke-dashoffset .5s" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold tabular-nums">
              {pct}%
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 opacity-80" />
        </div>
      </div>
    </Link>
  );
}
