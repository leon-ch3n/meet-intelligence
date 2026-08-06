"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/navigation/sidebar";

/**
 * Mobile nav drawer for narrow viewports. Below md the persistent sidebar is
 * hidden; this trigger shows the same nav as an overlay panel. Closes on
 * route change, Escape, or backdrop click.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // React's "adjust state during render" pattern: derive prev-pathname state
  // and reset `open` when the route changes. Avoids setState-in-effect, and
  // covers browser back/forward that the Sidebar onNavigate handler misses.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // iOS Safari body-scroll lock: hidden overflow alone still scrolls the
    // page under the drawer. Freeze the document at its current scroll
    // position and restore it on close.
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap: keep Tab / Shift+Tab cycling within the panel.
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the panel on open, remember where to return it after.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    closeButtonRef.current?.focus();

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onKey);
      (trigger ?? previouslyFocused)?.focus?.();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
      >
        <Menu className="size-4" aria-hidden />
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation"
          className="fixed inset-0 z-50 md:hidden"
        >
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[85vw] max-w-[300px] flex-col bg-sidebar shadow-xl">
            <div className="flex items-center justify-end p-2">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
