import type { Decision } from "@/types";

/**
 * Materialized-view rows. Every decision references a thread (see
 * data/threads.ts) and a source. Phase 3 services will surface these
 * through DecisionService; Phase 1 exposes them via the repository.
 */
export const decisions: readonly Decision[] = [
  {
    id: "decision-mig-jun18",
    text: "Do not commit a public launch date before security approval.",
    ownerId: "person-maya",
    status: "confirmed",
    sourceId: "source-meeting-internal-june-18",
    threadId: "thread-acme-migration",
    visibility: "internal",
    effectiveDate: "2026-06-18T17:20:00.000Z",
  },
  {
    id: "decision-mig-jul13",
    text: "Target October 15 for the Gemrise launch.",
    ownerId: "person-maya",
    // `detected` until the demo user confirms in the meeting detail view.
    status: "detected",
    sourceId: "source-transcript-acme-renewal",
    threadId: "thread-acme-migration",
    visibility: "all-attendees",
    effectiveDate: "2026-10-15T00:00:00.000Z",
  },
];
