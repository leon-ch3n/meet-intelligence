"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

export type TabKey = "notes" | "sources";

const tabs: { key: TabKey; label: string }[] = [
  { key: "notes", label: "Notes" },
  { key: "sources", label: "Sources" },
];

type Props = { active: TabKey };

export function DetailTabs({ active }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setTab = useCallback(
    (next: TabKey) => {
      const p = new URLSearchParams(params.toString());
      p.set("tab", next);
      if (next === "sources") p.delete("sub");
      router.replace(`${pathname}?${p.toString()}`);
    },
    [pathname, params, router],
  );

  // Google Docs / Meet primary tabs sit on the surface with a 3px indicator
  // bar under the active label — not a pill background. Row is inline with a
  // full-width baseline separator.
  return (
    <div
      role="tablist"
      aria-label="Meeting view"
      className="relative flex items-center gap-6 border-b border-border"
    >
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative -mb-px inline-flex h-10 items-center px-1 text-[14px] font-medium transition-colors",
              isActive
                ? "text-action"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-action"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
