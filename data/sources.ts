import type { Source } from "@/types";

/**
 * Every seeded fact traces back to one of these sources. IDs are consumed
 * by decisions/actions/risks/threads via string references.
 *
 * `permittedUserIds` gates access. Maya is intentionally missing from
 * `source-doc-pricing-approval` (the restricted Q3 GTM approval doc) —
 * that surfaces the restricted-source state required by the demo path
 * (docs/demo-script.md Beat 2).
 *
 * Source IDs are preserved from the earlier Acme seed so services / threads /
 * decisions / actions / risks / search responses keep resolving. Titles and
 * excerpts are new — everything belongs to the Gemrise program.
 */
export const sources: readonly Source[] = [
  // ── Meetings (as sources for their own decisions/actions) ───────────────
  {
    id: "source-meeting-acme-june-12",
    sourceType: "meeting",
    title: "Gemrise Cross-Functional Kickoff — June 12",
    ownerId: "person-marcus",
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-jordan",
      "person-elena",
      "person-marcus",
    ],
    createdAt: "2026-06-12T15:00:00.000Z",
    updatedAt: "2026-06-12T16:00:00.000Z",
    visibility: "all-attendees",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-jordan",
      "person-elena",
      "person-marcus",
    ],
    excerpt:
      "Team surfaces three Gemrise launch concerns: launch timing, security-review ownership, and GTM messaging.",
    timestamp: "2026-06-12T15:00:00.000Z",
  },
  {
    id: "source-meeting-internal-june-18",
    sourceType: "meeting",
    title: "Gemrise Launch Risk Review — June 18",
    ownerId: "person-maya",
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
    ],
    createdAt: "2026-06-18T17:00:00.000Z",
    updatedAt: "2026-06-18T18:00:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
    ],
    excerpt:
      "Team agrees not to commit a public launch date before security approval clears.",
    timestamp: "2026-06-18T17:00:00.000Z",
  },
  {
    id: "source-meeting-acme-renewal",
    sourceType: "meeting",
    title: "Gemrise Launch Readiness Review — July 14",
    ownerId: "person-maya",
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    createdAt: "2026-07-14T19:00:00.000Z",
    updatedAt: "2026-07-14T20:00:00.000Z",
    visibility: "all-attendees",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    excerpt: "The demo meeting.",
    timestamp: "2026-07-14T19:00:00.000Z",
  },
  {
    id: "source-meeting-aurora-weekly",
    sourceType: "meeting",
    title: "Aurora ML Model Weekly — July 14",
    ownerId: "person-daniel",
    participantIds: ["person-maya", "person-daniel", "person-priya"],
    createdAt: "2026-07-14T14:00:00.000Z",
    updatedAt: "2026-07-14T14:30:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-daniel",
      "person-priya",
      "person-sarah",
    ],
    excerpt:
      "Aurora hits 94% on the summarization eval. Team freezes the 07-11 checkpoint as the artifact Gemrise ships against.",
    timestamp: "2026-07-14T14:00:00.000Z",
  },
  {
    id: "source-meeting-mobile-onboarding-review",
    sourceType: "meeting",
    title: "Gemrise Mobile Design 1:1 — July 14",
    ownerId: "person-maya",
    participantIds: ["person-maya", "person-elena"],
    createdAt: "2026-07-14T17:00:00.000Z",
    updatedAt: "2026-07-14T17:30:00.000Z",
    visibility: "internal",
    permittedUserIds: ["person-maya", "person-elena"],
    excerpt:
      "Empty state locked; mobile-to-desktop context hand-off blocked on the shared context spine engineering commit.",
    timestamp: "2026-07-14T17:00:00.000Z",
  },
  {
    id: "source-meeting-q3-leadership-update",
    sourceType: "meeting",
    title: "Gemrise Q3 Leadership Readout — July 15",
    ownerId: "person-maya",
    participantIds: ["person-maya", "person-priya", "person-sarah"],
    createdAt: "2026-07-15T16:00:00.000Z",
    updatedAt: "2026-07-15T16:30:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-priya",
      "person-sarah",
      "person-jordan",
    ],
    excerpt:
      "Readout closes with a coherent October narrative and two named risks: unassigned security-review owner and restricted Q3 GTM approval doc.",
    timestamp: "2026-07-15T16:00:00.000Z",
  },

  // ── Documents (Drive-like) ───────────────────────────────────────────────
  {
    id: "source-doc-renewal-proposal",
    sourceType: "document",
    title: "Gemrise Launch Plan — v3",
    ownerId: "person-marcus",
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    createdAt: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-07-11T00:00:00.000Z",
    visibility: "all-attendees",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-jordan",
      "person-elena",
      "person-marcus",
    ],
    excerpt:
      "Cross-surface rollout plan for Gemrise — staged launch across Docs, Sheets, Slides, and Meet.",
  },
  {
    id: "source-doc-migration-plan",
    sourceType: "document",
    title: "Workspace Integration Playbook",
    ownerId: "person-daniel",
    participantIds: ["person-maya", "person-daniel", "person-priya"],
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
    ],
    excerpt:
      "Phased rollout playbook; assumes security sign-off before Phase 2 across surfaces.",
  },
  {
    id: "source-doc-security-checklist",
    sourceType: "document",
    title: "Gemrise Security Review Checklist",
    ownerId: "person-priya",
    participantIds: ["person-priya", "person-maya", "person-daniel"],
    createdAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-07-05T00:00:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-daniel",
      "person-priya",
      "person-sarah",
    ],
    excerpt:
      "Outstanding: owner assignment, data-residency confirmation, model-output review.",
  },
  {
    id: "source-doc-pricing-approval",
    sourceType: "document",
    title: "Q3 GTM Approval — Gemrise",
    ownerId: "person-sarah",
    participantIds: ["person-sarah"],
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z",
    visibility: "private",
    // Restricted — Maya intentionally excluded. Surfaces the restricted-source
    // state per docs/mock-data.md.
    permittedUserIds: ["person-sarah"],
    excerpt: "[Restricted]",
  },
  {
    id: "source-doc-aurora-brief",
    sourceType: "document",
    title: "Aurora Model — Brief",
    ownerId: "person-maya",
    participantIds: ["person-maya", "person-daniel", "person-priya"],
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-07-10T00:00:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
    ],
    excerpt:
      "Aurora deliverables and eval-harness dependencies with the Gemrise launch timeline.",
  },

  // ── Email / calendar / chat ──────────────────────────────────────────────
  {
    id: "source-email-acme-followup",
    sourceType: "email",
    title: "Re: Gemrise launch — GTM messaging",
    ownerId: "person-sarah",
    participantIds: ["person-sarah", "person-maya", "person-marcus"],
    createdAt: "2026-07-08T13:20:00.000Z",
    updatedAt: "2026-07-08T13:20:00.000Z",
    visibility: "all-attendees",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-marcus",
      "person-jordan",
    ],
    excerpt:
      '"Any update on the revised GTM messaging you mentioned last week? Leadership is asking so we can align internally ahead of Friday."',
  },
  {
    id: "source-calendar-acme-renewal",
    sourceType: "calendar",
    title: "Calendar — Gemrise Launch Readiness Review",
    ownerId: "person-maya",
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    createdAt: "2026-07-10T00:00:00.000Z",
    updatedAt: "2026-07-10T00:00:00.000Z",
    visibility: "all-attendees",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    excerpt: "45 min · Google Meet · organized by Maya Patel",
  },
  {
    id: "source-chat-internal-pricing",
    sourceType: "chat",
    title: "Chat — #gemrise-launch (internal)",
    ownerId: "person-sarah",
    participantIds: ["person-maya", "person-sarah", "person-daniel"],
    createdAt: "2026-07-10T22:10:00.000Z",
    updatedAt: "2026-07-10T22:10:00.000Z",
    visibility: "internal",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
    ],
    excerpt:
      '"GTM approval is stuck on a finance sign-off — I can\'t share the messaging draft until that clears. Working on it."',
  },

  // ── Transcript source pointer for detected artifacts ─────────────────────
  {
    id: "source-transcript-acme-renewal",
    sourceType: "transcript",
    title: "Transcript — Gemrise Launch Readiness Review",
    ownerId: "person-maya",
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    createdAt: "2026-07-14T19:00:00.000Z",
    updatedAt: "2026-07-14T20:00:00.000Z",
    visibility: "all-attendees",
    permittedUserIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    excerpt: "Live transcript of the demo meeting.",
  },

  // ── Paul 1:1 Sync — Google Cloud Next — Jul 15 ───────────────────────────
  {
    id: "source-meeting-paul-1-1-cloud-next",
    sourceType: "meeting",
    title: "Paul 1:1 Sync — Google Cloud Next — July 15",
    ownerId: "person-paul",
    participantIds: ["person-maya", "person-paul"],
    createdAt: "2026-07-15T16:00:00.000Z",
    updatedAt: "2026-07-15T16:20:00.000Z",
    visibility: "internal",
    permittedUserIds: ["person-maya", "person-paul"],
    excerpt:
      "Manager 1:1. Paul and Maya lock the Cloud Next posture: breakout only, keynote line without a date, verbatim external phrasing, Elena to co-present. Promo signal set for November if Gemrise lands clean.",
    timestamp: "2026-07-15T16:00:00.000Z",
  },
  {
    id: "source-transcript-paul-1-1-cloud-next",
    sourceType: "transcript",
    title: "Transcript — Paul 1:1 Sync — Google Cloud Next",
    ownerId: "person-maya",
    participantIds: ["person-maya", "person-paul"],
    createdAt: "2026-07-15T16:00:00.000Z",
    updatedAt: "2026-07-15T16:20:00.000Z",
    visibility: "internal",
    permittedUserIds: ["person-maya", "person-paul"],
    excerpt: "Live transcript of the Paul 1:1 sync on Cloud Next positioning.",
  },
];
