/**
 * Small deterministic text templates. Do NOT branch on model output — these
 * are pure functions from typed fields to short strings. Used by brief,
 * recap, follow-up, and topic-memory services.
 */
import { formatDate } from "@/lib/dates";

export function restrictedNotice(count: number = 1): string {
  return count === 1
    ? "One relevant internal source was excluded due to permissions."
    : `${count} relevant internal sources were excluded due to permissions.`;
}

export function overdueMessage(days: number): string {
  if (days <= 0) return "Due today";
  return `overdue by ${days} day${days === 1 ? "" : "s"}`;
}

export function participantSummary(
  internalCount: number,
  externalCount: number,
): string {
  const parts: string[] = [];
  if (internalCount) parts.push(`${internalCount} internal`);
  if (externalCount) parts.push(`${externalCount} external`);
  return parts.join(" · ");
}

export function decisionEffective(iso?: string): string | undefined {
  return iso ? `Effective ${formatDate(iso)}` : undefined;
}

export function followUpSubject(meetingTitle: string): string {
  return `Follow-up: ${meetingTitle}`;
}
