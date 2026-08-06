import { threadEvents, threads } from "@/data";
import type { Thread, ThreadEvent } from "@/types";

export function getThreadById(id: string): Thread | undefined {
  return threads.find((t) => t.id === id);
}

export function listThreads(): readonly Thread[] {
  return threads;
}

export function listThreadsForTopic(topicId: string): readonly Thread[] {
  return threads.filter((t) => t.topicId === topicId);
}

export function listEventsForThread(
  threadId: string,
): readonly ThreadEvent[] {
  return threadEvents
    .filter((e) => e.threadId === threadId)
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function listEventsForMeeting(
  sourceId: string,
): readonly ThreadEvent[] {
  return threadEvents.filter((e) => e.sourceId === sourceId);
}

export function getEventById(id: string): ThreadEvent | undefined {
  return threadEvents.find((e) => e.id === id);
}

/**
 * Stub for Phase 3. Returns the currently-confirmed decision on the same
 * thread whose text/effectiveDate would conflict with the candidate — used
 * by ConflictService. Phase 1 ships a naive shape; rules land in Phase 3.
 */
export function findConflictingActiveDecision(
  threadId: string,
  candidateEventId: string,
): ThreadEvent | undefined {
  const events = listEventsForThread(threadId);
  return events.find(
    (e) =>
      e.kind === "decision" &&
      e.status === "confirmed" &&
      e.id !== candidateEventId,
  );
}
