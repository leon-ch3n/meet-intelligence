"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CommandPalette } from "@/components/palette/command-palette";

export function PaletteTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search (Cmd K)"
        // Gmail search bar shape: tonal grey pill, full-width, minimal chrome.
        className="flex w-full items-center gap-2.5 rounded-full bg-muted px-3.5 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Search className="size-4" aria-hidden />
        <span className="flex-1 truncate">Search</span>
        <kbd className="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
