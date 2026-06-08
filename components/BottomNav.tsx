"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Sparkles, TrendingUp, Trophy, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSrs } from "@/lib/spacedRepetition";
import { getClassifiers } from "@/lib/data";
import type { NavItem } from "@/lib/types";

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  Home, Layers, Sparkles, TrendingUp, Trophy,
};

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // عدّاد المراجعات المستحقة لعرض الشارة على tab "التمارين"
  const classifierIds = getClassifiers().map((c) => c.id);
  const { dueCount } = useSrs(classifierIds);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl border-t border-[#F0F0F0] bg-white/95 backdrop-blur shadow-nav"
      aria-label="التنقل الرئيسي"
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          const isActive =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          // الشارة فقط على /classifiers (التمارين)
          const showBadge = it.href === "/classifiers" && dueCount > 0;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition-colors",
                  isActive ? "text-coral" : "text-muted hover:text-ink"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-2")}
                  />
                  {showBadge && (
                    <span
                      className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-violet px-1 text-[10px] font-extrabold text-white"
                      aria-label={`${dueCount} مراجعة مستحقة`}
                    >
                      {dueCount > 99 ? "99+" : dueCount}
                    </span>
                  )}
                </div>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
