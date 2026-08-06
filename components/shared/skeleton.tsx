import { cn } from "@/lib/utils";

/**
 * Deterministic loading placeholder. Every widget's loading state must be a
 * skeleton with the same shape as the real content — the layout should not
 * shift when data resolves (docs/screens.md state-per-widget checklist).
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn(
        "motion-safe:animate-pulse rounded-md bg-muted/60",
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3",
            i === lines - 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  height = "h-32",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <Skeleton
      className={cn(
        "w-full rounded-xl ring-1 ring-inset ring-foreground/10",
        height,
        className,
      )}
    />
  );
}
