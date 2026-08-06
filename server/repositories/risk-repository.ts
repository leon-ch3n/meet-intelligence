import { risks } from "@/data";
import type { Risk } from "@/types";

export function getRiskById(id: string): Risk | undefined {
  return risks.find((r) => r.id === id);
}

export function listRisks(): readonly Risk[] {
  return risks;
}

export function listRisksForThread(threadId: string): readonly Risk[] {
  return risks.filter((r) => r.threadId === threadId);
}

export function listOpenRisks(): readonly Risk[] {
  return risks.filter((r) => r.status === "open");
}
