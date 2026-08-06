import type { ActionItem } from "@/types";

export const actionItems: readonly ActionItem[] = [
  {
    id: "action-pricing-jul10",
    text: "Send revised GTM messaging for Gemrise.",
    ownerId: "person-sarah",
    dueDate: "2026-07-10T00:00:00.000Z",
    status: "overdue",
    sourceId: "source-meeting-acme-june-12",
    threadId: "thread-acme-pricing",
    visibility: "all-attendees",
  },
  {
    id: "action-pricing-jul13",
    text: "Sarah to send revised GTM messaging by Friday.",
    ownerId: "person-sarah",
    // dueDate intentionally undefined at seed — Phase 3 exposes as a
    // `missingFields` state on the DetectedActionItem until user confirms.
    status: "detected",
    sourceId: "source-transcript-acme-renewal",
    threadId: "thread-acme-pricing",
    visibility: "all-attendees",
  },
  {
    id: "action-security-owner",
    text: "Confirm Gemrise security-review owner on our side.",
    ownerId: undefined,
    dueDate: "2026-07-18T00:00:00.000Z",
    status: "open",
    sourceId: "source-meeting-internal-june-18",
    threadId: "thread-acme-security",
    visibility: "internal",
  },
  {
    id: "action-onboarding-prototype",
    text: "Share Gemrise onboarding prototype with Design.",
    ownerId: "person-daniel",
    dueDate: "2026-07-15T00:00:00.000Z",
    status: "open",
    sourceId: "source-doc-aurora-brief",
    threadId: "thread-acme-migration",
    visibility: "internal",
  },
  {
    id: "action-experiment-metrics",
    text: "Finalize Q3 Aurora experiment metrics.",
    ownerId: "person-maya",
    dueDate: "2026-07-20T00:00:00.000Z",
    status: "open",
    sourceId: "source-doc-aurora-brief",
    threadId: "thread-acme-migration",
    visibility: "internal",
  },
];
