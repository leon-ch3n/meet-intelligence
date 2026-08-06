import { decisions } from "@/data";
import type { Decision, DecisionStatus } from "@/types";

export function getDecisionById(id: string): Decision | undefined {
  return decisions.find((d) => d.id === id);
}

export function listDecisions(): readonly Decision[] {
  return decisions;
}

export function listDecisionsForThread(
  threadId: string,
): readonly Decision[] {
  return decisions.filter((d) => d.threadId === threadId);
}

export function listByDecisionStatus(
  status: DecisionStatus,
): readonly Decision[] {
  return decisions.filter((d) => d.status === status);
}

export function listRecentDecisions(limit = 5): readonly Decision[] {
  return decisions
    .slice()
    .sort((a, b) =>
      (b.effectiveDate ?? "").localeCompare(a.effectiveDate ?? ""),
    )
    .slice(0, limit);
}
