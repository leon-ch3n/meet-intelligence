import type { Thread, ThreadEvent } from "@/types";

/**
 * Threads are the linking primitive (docs/architecture.md §1). Three threads
 * under the Gemrise Launch topic; each carries an evolving series of events
 * with lineage links (`linkedEventIds`).
 *
 * Materialized-view entities (data/decisions.ts, data/actions.ts,
 * data/risks.ts) reference these threads by `threadId`. Do not derive threads
 * from those materialized rows — always the other way.
 */

// ── Thread A · Launch timeline ─────────────────────────────────────────────

const migrationEvents: ThreadEvent[] = [
  {
    id: "evt-mig-concern-jun12",
    threadId: "thread-acme-migration",
    kind: "concern",
    title: "Launch timing raised as blocker",
    description:
      'Jimmy (Eng): "We can\'t commit to Q3 for a full multi-surface push until we understand the sequencing."',
    status: "open",
    speakerId: "person-jordan",
    timestamp: "2026-06-12T15:12:00.000Z",
    sourceId: "source-meeting-acme-june-12",
    linkedEventIds: [],
    visibility: "all-attendees",
  },
  {
    id: "evt-mig-decision-jun18",
    threadId: "thread-acme-migration",
    kind: "decision",
    title:
      "Do not commit a public launch date before security approval",
    description:
      "Decision made in the June 18 risk review. Sets a policy that any Gemrise public launch date must follow security sign-off.",
    status: "confirmed",
    ownerId: "person-maya",
    timestamp: "2026-06-18T17:20:00.000Z",
    sourceId: "source-meeting-internal-june-18",
    linkedEventIds: ["evt-mig-concern-jun12"],
    visibility: "internal",
  },
  {
    id: "evt-mig-decision-jul13",
    threadId: "thread-acme-migration",
    kind: "decision",
    title: "Target October 15 for Gemrise launch",
    description:
      "Tentative decision surfaced during the July 14 readiness review. Conflicts with the June 18 policy until security approval is confirmed.",
    status: "detected",
    confidence: 0.82,
    ownerId: "person-maya",
    speakerId: "person-jordan",
    timestamp: "2026-07-14T19:01:28.000Z",
    sourceId: "source-transcript-acme-renewal",
    // Links back to the June 18 decision it conflicts with.
    linkedEventIds: ["evt-mig-decision-jun18", "evt-mig-concern-jun12"],
    visibility: "all-attendees",
  },
  {
    id: "evt-mig-change-jul13",
    threadId: "thread-acme-migration",
    kind: "change",
    title: "Launch-timing concern partially resolved",
    description:
      "The launch-timing concern first raised on June 12 is partially resolved: team landed October 15 as a tentative target, pending security approval.",
    status: "resolved",
    timestamp: "2026-07-14T19:45:00.000Z",
    sourceId: "source-meeting-acme-renewal",
    linkedEventIds: ["evt-mig-concern-jun12", "evt-mig-decision-jul13"],
    visibility: "all-attendees",
  },
];

// ── Thread B · Security-review ownership ───────────────────────────────────

const securityEvents: ThreadEvent[] = [
  {
    id: "evt-sec-concern-jun12",
    threadId: "thread-acme-security",
    kind: "concern",
    title: "Who owns the security review?",
    description:
      'Marcus (PM): "We need a named owner on our side for the security review before we can commit to a launch date."',
    status: "open",
    speakerId: "person-marcus",
    timestamp: "2026-06-12T15:34:00.000Z",
    sourceId: "source-meeting-acme-june-12",
    linkedEventIds: [],
    visibility: "all-attendees",
  },
  {
    id: "evt-sec-question-jun18",
    threadId: "thread-acme-security",
    kind: "question",
    title: "Security-review owner unassigned",
    description:
      "Team flags that no one has picked up ownership of the Gemrise security review on the security-team side.",
    status: "open",
    timestamp: "2026-06-18T17:35:00.000Z",
    sourceId: "source-meeting-internal-june-18",
    linkedEventIds: ["evt-sec-concern-jun12"],
    visibility: "internal",
  },
  {
    id: "evt-sec-risk-jul13",
    threadId: "thread-acme-security",
    kind: "risk",
    title: "Security approval remains unassigned",
    description:
      "As of the July 14 readiness review the security-review owner is still unnamed, blocking the October 15 target.",
    status: "open",
    timestamp: "2026-07-14T19:44:00.000Z",
    sourceId: "source-meeting-acme-renewal",
    linkedEventIds: ["evt-sec-question-jun18"],
    visibility: "internal",
  },
];

// ── Thread C · GTM messaging ───────────────────────────────────────────────

const pricingEvents: ThreadEvent[] = [
  {
    id: "evt-price-concern-jun12",
    threadId: "thread-acme-pricing",
    kind: "concern",
    title: "Revised GTM messaging outstanding",
    description:
      'Sarah (Marketing): "I want the reveal to lead with a single benefit, not a feature list. Revised pass coming."',
    status: "open",
    speakerId: "person-sarah",
    timestamp: "2026-06-12T15:48:00.000Z",
    sourceId: "source-meeting-acme-june-12",
    linkedEventIds: [],
    visibility: "all-attendees",
  },
  {
    id: "evt-price-commitment-jul2",
    threadId: "thread-acme-pricing",
    kind: "commitment",
    title: "Sarah to send revised messaging (by July 10)",
    description:
      "Sarah committed to sending the revised GTM messaging by July 10. Blocked by the Q3 GTM approval doc still awaiting finance sign-off.",
    status: "overdue",
    ownerId: "person-sarah",
    timestamp: "2026-07-02T22:00:00.000Z",
    sourceId: "source-email-acme-followup",
    linkedEventIds: ["evt-price-concern-jun12"],
    visibility: "all-attendees",
  },
  {
    id: "evt-price-action-jul13",
    threadId: "thread-acme-pricing",
    kind: "commitment",
    title: "Sarah to send revised messaging by Friday",
    description:
      "New commitment surfaced during the July 14 readiness review to replace the overdue July 10 promise.",
    status: "detected",
    confidence: 0.9,
    ownerId: "person-sarah",
    speakerId: "person-sarah",
    timestamp: "2026-07-14T19:02:04.000Z",
    sourceId: "source-transcript-acme-renewal",
    linkedEventIds: [
      "evt-price-commitment-jul2",
      "evt-price-concern-jun12",
    ],
    visibility: "all-attendees",
  },
];

export const threadEvents: readonly ThreadEvent[] = [
  ...migrationEvents,
  ...securityEvents,
  ...pricingEvents,
];

export const threads: readonly Thread[] = [
  {
    id: "thread-acme-migration",
    name: "Launch timeline",
    topicId: "topic-acme-renewal",
    eventIds: migrationEvents.map((e) => e.id),
  },
  {
    id: "thread-acme-security",
    name: "Security-review ownership",
    topicId: "topic-acme-renewal",
    eventIds: securityEvents.map((e) => e.id),
  },
  {
    id: "thread-acme-pricing",
    name: "GTM messaging",
    topicId: "topic-acme-renewal",
    eventIds: pricingEvents.map((e) => e.id),
  },
];
