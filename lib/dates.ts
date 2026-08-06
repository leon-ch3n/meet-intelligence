/**
 * Pure date helpers. No external deps. All inputs are ISO strings.
 *
 * The demo runs against a fixed 2025 timeline (docs/mock-data.md). The
 * `now` argument on relative helpers keeps rendering deterministic — pass
 * `DEMO_NOW` from a component to freeze copy against a specific moment.
 */

/** The instant the demo is anchored to: just before the 3pm Gemrise readiness review. */
export const DEMO_NOW = "2026-07-15T18:45:00.000Z";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function daysUntil(iso: string, now: string = DEMO_NOW): number {
  const ms = new Date(iso).getTime() - new Date(now).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * "in 15 minutes" / "3 days ago" / "overdue by 3 days".
 * Deliberately simple — no i18n, no fuzzing.
 */
export function formatRelative(iso: string, now: string = DEMO_NOW): string {
  const target = new Date(iso).getTime();
  const anchor = new Date(now).getTime();
  const diffMs = target - anchor;
  const absMs = Math.abs(diffMs);
  const minutes = Math.round(absMs / (1000 * 60));
  const hours = Math.round(absMs / (1000 * 60 * 60));
  const days = Math.round(absMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "just now";
  if (diffMs > 0) {
    if (minutes < 60) return `in ${minutes} min`;
    if (hours < 24) return `in ${hours} hr`;
    return `in ${days} day${days === 1 ? "" : "s"}`;
  }
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function isOverdue(iso: string, now: string = DEMO_NOW): boolean {
  return new Date(iso).getTime() < new Date(now).getTime();
}

export function formatOverdue(
  iso: string | undefined,
  now: string = DEMO_NOW,
): string | undefined {
  if (!iso) return undefined;
  const days = -daysUntil(iso, now);
  if (days <= 0) return undefined;
  return `overdue by ${days} day${days === 1 ? "" : "s"}`;
}
