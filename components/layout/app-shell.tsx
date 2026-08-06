import { Suspense } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CURRENT_USER_ID } from "@/data/people";
import { getPersonById } from "@/server/repositories/person-repository";

/**
 * Two-column shell: fixed-width sidebar + main content area. Sidebar is
 * sticky on desktop; on mobile the sidebar collapses out of the flow and
 * MobileNav renders a hamburger + drawer with the same items.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const currentUser = getPersonById(CURRENT_USER_ID);
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
    : "";

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-action focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-action-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to content
      </a>

      <aside className="hidden md:sticky md:top-0 md:block md:h-screen">
        {/* Sidebar reads ?folder= via useSearchParams. Wrapping it in Suspense
            lets Next.js statically prerender routes above it (like /ask). */}
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar />
        </Suspense>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border/40 bg-background/85 px-4 backdrop-blur sm:px-6 md:hidden">
          <div className="flex items-center gap-2">
            <MobileNav />
          </div>
          {currentUser && (
            <div
              aria-label={currentUser.name}
              role="img"
              className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
            >
              <span aria-hidden>{initials}</span>
            </div>
          )}
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarFallback() {
  return (
    <div
      aria-hidden
      className="h-full border-r border-border bg-sidebar"
    />
  );
}
