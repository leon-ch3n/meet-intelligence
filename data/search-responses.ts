import type { MeetingSearchIntent, SearchFinding } from "@/types";

/**
 * Hard-coded typed responses for Ask Meetings. Every finding lists
 * `sourceIds` that must resolve in `data/sources.ts` — the service layer
 * hydrates them at read time and applies permission filtering.
 *
 * These responses are illustrative for the Gemrise demo; the intent
 * classifier routes any supported query into one of these buckets.
 * Unsupported queries return the WidgetState `unsupported_query` envelope,
 * not a fabricated answer.
 *
 * Findings are also filtered by the meeting-scoped rail (see
 * `MeetingSearchService`) — so every meeting id needs to appear in at least
 * one finding for each intent that meeting's chip fires. The
 * `source-meeting-<id>` and `source-transcript-<id>` entries in
 * `data/sources.ts` are what make this match.
 */

export type CannedResponse = {
  answer: string;
  findings: SearchFinding[];
  suggestedFollowUps: string[];
};

export const cannedResponses: Record<MeetingSearchIntent, CannedResponse> = {
  identify_blockers: {
    answer:
      "Three things are blocking the Gemrise launch right now. The biggest is the launch timeline itself — the team landed October 15 as a tentative target at the Jul 14 readiness review, but it's still contingent on security approval, and the security-review owner on our side is unassigned. Priya committed at the Jul 15 leadership readout to name that owner by Friday. Third, GTM messaging: Sarah re-committed on Jul 14 to send revised copy by Friday after her Jul 10 commit slipped. Two smaller items to watch — the mobile-to-desktop context hand-off is waiting on engineering (design is ready), and Priya hasn't started her first pass on the model-output security review yet, which is why she rates confidence at 6 versus Daniel's 8 on the frozen 07-11 Aurora checkpoint holding through the review.",
    findings: [
      {
        title: "Launch timeline",
        explanation:
          "The launch sequencing has been raised in three consecutive meetings. Jul 14 landed a tentative October 15 target — still contingent on security approval.",
        threadId: "thread-migration-timeline",
        status: "recurring",
        timestamp: "07:12",
        sourceIds: [
          "source-transcript-acme-renewal",
          "source-meeting-acme-renewal",
          "source-meeting-acme-june-12",
        ],
      },
      {
        title: "Security-review ownership",
        explanation:
          "No named owner on the security-team side. Blocks the October 15 target and drives risk `risk-security-unassigned`. Priya committed at the Jul 15 readout to name the owner by Friday.",
        threadId: "thread-security-review",
        status: "open",
        timestamp: "08:04",
        sourceIds: [
          "source-doc-security-checklist",
          "source-meeting-internal-june-18",
          "source-meeting-q3-leadership-update",
        ],
      },
      {
        title: "GTM messaging",
        explanation:
          "Sarah re-committed on Jul 14 to send revised GTM messaging by Friday. Q3 GTM Approval doc is restricted for this viewer — surfaced as restricted, not hidden.",
        threadId: "thread-final-pricing",
        status: "committed",
        timestamp: "10:31",
        sourceIds: [
          "source-chat-internal-pricing",
          "source-doc-pricing-approval",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "Mobile-to-desktop context hand-off",
        explanation:
          "Design ready; blocked on the shared context spine engineering commit. Elena raised it in the Jul 14 1:1 and Jimmy confirmed it as critical-path at the readiness review.",
        threadId: "thread-migration-timeline",
        status: "open",
        timestamp: "06:48",
        sourceIds: [
          "source-meeting-mobile-onboarding-review",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "Aurora launch-window risk",
        explanation:
          "Daniel and Priya rated confidence in the frozen 07-11 checkpoint holding through the security review at 8 and 6 respectively — the delta is entirely Priya's unstarted review pass one, which begins this week.",
        threadId: "thread-migration-timeline",
        status: "open",
        sourceIds: ["source-meeting-aurora-weekly"],
      },
      {
        title: "Cloud Next narrative risk",
        explanation:
          "Paul and Maya agreed in the Jul 15 1:1 that Gemrise should skip the Cloud Next main stage — announcing a launch date the security review can't back would follow the program into October. Breakout only, no date said out loud, verbatim external phrasing locked.",
        threadId: "thread-migration-timeline",
        status: "open",
        timestamp: "01:32",
        sourceIds: [
          "source-transcript-paul-1-1-cloud-next",
          "source-meeting-paul-1-1-cloud-next",
        ],
      },
    ],
    suggestedFollowUps: [
      "What did we commit for the Gemrise launch?",
      "Which action items assigned to me are overdue?",
      "What changed since the last Gemrise meeting?",
    ],
  },

  find_decisions: {
    answer:
      "The team landed October 15 as a tentative launch target at the Jul 14 readiness review. Jimmy committed the date and Maya recorded it as internal-only — it doesn't go public until security clears. That effectively supersedes the earlier Jun 18 policy of not committing to any public launch date pre-security, though the underlying policy still holds. On the way to that call, two other decisions locked in the same week: the Aurora 07-11 checkpoint was frozen at the Jul 14 Aurora weekly (Priya can now start her three-pass security review against a stable artifact), and the mobile empty state was closed on 'compose always visible, chips as anchor, warmer voice' at the Jul 14 design 1:1. At the Jul 15 leadership readout Maya confirmed the exact external framing: 'planned for later this year, contingent on the security review.'",
    findings: [
      {
        title: "Target October 15 for the Gemrise launch",
        explanation:
          "Tentative — contingent on security approval. Detected Jul 14 in the readiness review. Jimmy committed the date; Maya recorded it as an internal-only target that does not go public until security clears.",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        timestamp: "07:44",
        sourceIds: [
          "source-transcript-acme-renewal",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "Do not commit a public launch date before security approval",
        explanation:
          "Decision from the Jun 18 risk review. The July 14 target supersedes this on the Launch Timeline thread but preserves the underlying policy.",
        threadId: "thread-migration-timeline",
        status: "superseded",
        sourceIds: ["source-meeting-internal-june-18"],
      },
      {
        title: "Freeze the Aurora 07-11 checkpoint for the Gemrise launch",
        explanation:
          "Confirmed in the Jul 14 Aurora weekly. Priya can now start the model output review against a stable artifact.",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        sourceIds: ["source-meeting-aurora-weekly", "source-doc-aurora-brief"],
      },
      {
        title: "Mobile empty state anchors on suggestion chips",
        explanation:
          "Design 1:1 on Jul 14 closed on v2 mobile empty state — compose surface always visible, chips as anchor, warmer 'What needs remembering?' copy.",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        sourceIds: ["source-meeting-mobile-onboarding-review"],
      },
      {
        title: "Leadership hears October 15 as internal-only",
        explanation:
          "At the Jul 15 readout Maya confirmed the target as internal-only pending security, and named the exact external framing — 'planned for later this year, contingent on the security review.'",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        sourceIds: ["source-meeting-q3-leadership-update"],
      },
      {
        title: "Cloud Next posture: breakout only, no date said out loud",
        explanation:
          "Paul and Maya agreed in the Jul 15 1:1 to skip the main stage in favor of a 20-minute breakout, a single-line keynote mention with no timing verb, and a same-day blog post. Verbatim public phrasing locked: 'planned for later this year, contingent on our security review.'",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        timestamp: "02:06",
        sourceIds: [
          "source-transcript-paul-1-1-cloud-next",
          "source-meeting-paul-1-1-cloud-next",
        ],
      },
    ],
    suggestedFollowUps: [
      "What is blocking the Gemrise launch?",
      "What decisions were reversed?",
    ],
  },

  find_commitments: {
    answer:
      "The big open commitment is Sarah's — she re-committed at the Jul 14 readiness review to send revised GTM messaging by Friday (Jul 18) after her Jul 10 commit slipped. Priya committed at the Jul 15 leadership readout to name the security-review owner on our side by Friday; that one has been open since Jun 18. Two things also went on the board this week: Elena to ship the warmer 'What needs remembering?' copy into the Gemrise voice-and-tone doc (approved at the Jul 14 mobile 1:1), and Daniel to share the onboarding prototype with Design so Elena's team can hook it into the Gemrise entry surface (from the Jul 14 Aurora weekly). Elena also has an older commit from the Jun 12 kickoff to circulate the Gemrise design QA doc so every function can flag missing states before the readiness review.",
    findings: [
      {
        title: "Sarah to send revised GTM messaging by Friday",
        explanation:
          "Re-committed Jul 14 in the launch readiness review after the Jul 10 commit slipped. Due Jul 18.",
        threadId: "thread-final-pricing",
        status: "open",
        timestamp: "10:31",
        sourceIds: [
          "source-transcript-acme-renewal",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "Send revised GTM messaging",
        explanation: "Previous commitment from Jul 10 — now overdue.",
        threadId: "thread-final-pricing",
        status: "overdue",
        sourceIds: ["source-email-acme-followup"],
      },
      {
        title: "Confirm security-review owner on our side",
        explanation:
          "Raised Jun 18 in the risk review; re-raised as the top open item at the Jul 15 leadership readout. Priya committed to naming the owner by Friday.",
        threadId: "thread-security-review",
        status: "open",
        sourceIds: [
          "source-meeting-internal-june-18",
          "source-meeting-q3-leadership-update",
        ],
      },
      {
        title: "Circulate the Gemrise design QA doc",
        explanation:
          "Elena committed at the Jun 12 kickoff so every function can flag missing states before the readiness review.",
        threadId: "thread-migration-timeline",
        status: "open",
        sourceIds: ["source-meeting-acme-june-12"],
      },
      {
        title: "Share onboarding prototype with Design",
        explanation:
          "Daniel committed at the Jul 14 Aurora weekly so Elena's team can hook it into the Gemrise entry surface.",
        threadId: "thread-migration-timeline",
        status: "open",
        sourceIds: ["source-meeting-aurora-weekly"],
      },
      {
        title: "Ship warmer 'What needs remembering?' copy to voice-and-tone doc",
        explanation:
          "Approved in the Jul 14 mobile 1:1 — Elena to update the Gemrise voice-and-tone doc so both mobile and desktop pull from one source.",
        threadId: "thread-migration-timeline",
        status: "open",
        sourceIds: ["source-meeting-mobile-onboarding-review"],
      },
      {
        title: "Brief Meredith on the verbatim Cloud Next phrasing",
        explanation:
          "Maya committed in the Jul 15 1:1 with Paul to brief Meredith (analyst relations) on the exact external line — 'planned for later this year, contingent on our security review' — so anyone speaking at Cloud Next uses the same words.",
        threadId: "thread-migration-timeline",
        status: "open",
        timestamp: "06:48",
        sourceIds: [
          "source-transcript-paul-1-1-cloud-next",
          "source-meeting-paul-1-1-cloud-next",
        ],
      },
      {
        title: "Ask Elena to co-present the Cloud Next breakout",
        explanation:
          "Maya to ask Elena tomorrow; both speakers must be named on the breakout submission by next Wednesday.",
        threadId: "thread-migration-timeline",
        status: "open",
        timestamp: "05:16",
        sourceIds: [
          "source-meeting-paul-1-1-cloud-next",
        ],
      },
      {
        title: "Align Sarah's Friday GTM pass to the review-pipeline framing",
        explanation:
          "Maya committed in the Jul 15 1:1 to align Sarah's Friday GTM messaging pass to the same review-pipeline benefit that the Cloud Next keynote line, breakout, and blog post will use — one benefit across every surface.",
        threadId: "thread-final-pricing",
        status: "open",
        sourceIds: [
          "source-meeting-paul-1-1-cloud-next",
        ],
      },
    ],
    suggestedFollowUps: [
      "Which action items assigned to me are overdue?",
      "What is blocking the Gemrise launch?",
    ],
  },

  prepare_for_meeting: {
    answer:
      "Quick recap heading in: launch sequencing is the recurring concern — it's been raised in three consecutive meetings starting Jun 12. The two open items you'll want an answer to are the unassigned security-review owner (still blocking the Oct 15 target) and Sarah's overdue GTM messaging draft, committed Jul 10 and still not out. On the good news side, the Aurora 07-11 checkpoint was frozen at yesterday's Aurora weekly, so Priya is cleared to start the model-output security review this week — Aurora is no longer the risk on this launch.",
    findings: [
      {
        title: "Recurring concern · Launch timeline",
        explanation:
          "Launch sequencing has been raised in three consecutive meetings starting Jun 12.",
        threadId: "thread-migration-timeline",
        status: "recurring",
        sourceIds: [
          "source-meeting-acme-june-12",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "Open · Security-review owner unassigned",
        explanation:
          "No named owner on the security-team side. Blocks the proposed October 15 target.",
        threadId: "thread-security-review",
        status: "open",
        sourceIds: [
          "source-doc-security-checklist",
          "source-meeting-q3-leadership-update",
        ],
      },
      {
        title: "Overdue · Send revised GTM messaging",
        explanation: "Committed Jul 10, still outstanding on the demo day.",
        threadId: "thread-final-pricing",
        status: "overdue",
        sourceIds: ["source-email-acme-followup"],
      },
      {
        title: "Green · Aurora 07-11 checkpoint frozen",
        explanation:
          "Confirmed in the Jul 14 Aurora weekly. Priya cleared to start the model-output security review this week.",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        sourceIds: ["source-meeting-aurora-weekly"],
      },
    ],
    suggestedFollowUps: [
      "What is blocking the Gemrise launch?",
      "What did we commit for the Gemrise launch?",
    ],
  },

  find_overdue_actions: {
    answer:
      "Two items are overdue. Sarah's revised GTM messaging was due Jul 10 and is still open — she re-committed to Friday at the Jul 14 readiness review. And the security-review owner assignment has been open since the Jun 18 risk review with no name attached; Priya committed at yesterday's leadership readout to name the owner by Friday.",
    findings: [
      {
        title: "Send revised GTM messaging",
        explanation: "Due Jul 10, still open. Owner: Sarah.",
        threadId: "thread-final-pricing",
        status: "overdue",
        sourceIds: ["source-email-acme-followup"],
      },
      {
        title: "Confirm security-review owner on our side",
        explanation:
          "Raised Jun 18 — no owner assigned. Re-raised at the Jul 15 leadership readout with a Friday deadline.",
        threadId: "thread-security-review",
        status: "overdue",
        sourceIds: [
          "source-meeting-internal-june-18",
          "source-meeting-q3-leadership-update",
        ],
      },
    ],
    suggestedFollowUps: [
      "What did we commit for the Gemrise launch?",
      "What is blocking the Gemrise launch?",
    ],
  },

  compare_meetings: {
    answer:
      "A lot moved between the Jun 12 kickoff and yesterday's Jul 14 readiness review. Launch timing went from being the #1 open concern to a tentative decision — October 15, internal-only, pending security. On GTM the picture actually got worse: the Jul 10 commit slipped, and Sarah re-committed to Friday. The security-review owner is the one thing that hasn't moved — still unassigned since Jun 18, still blocking the Oct 15 target, though Priya committed at the Jul 15 readout to name the owner by Friday. One other change worth flagging: the assistant tone landed on 'What needs remembering?' at the Jul 14 mobile 1:1, a warmer voice than the earlier 'How can I help?'",
    findings: [
      {
        title: "Launch timeline · concern → tentative decision",
        explanation:
          "Jun 12: launch sequencing flagged as the #1 open concern. Jul 14: landed October 15 as a tentative target.",
        threadId: "thread-migration-timeline",
        status: "changed",
        sourceIds: [
          "source-meeting-acme-june-12",
          "source-transcript-acme-renewal",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "GTM · previous commitment overdue → new commitment made",
        explanation:
          "Jul 10 commitment slipped. Jul 14 re-committed to Friday.",
        threadId: "thread-final-pricing",
        status: "changed",
        sourceIds: [
          "source-email-acme-followup",
          "source-chat-internal-pricing",
          "source-meeting-acme-renewal",
        ],
      },
      {
        title: "Security-review owner · still unassigned",
        explanation:
          "No change since Jun 18. Blocks the Oct 15 target. Priya committed at the Jul 15 readout to name it by Friday.",
        threadId: "thread-security-review",
        status: "unchanged",
        sourceIds: [
          "source-doc-security-checklist",
          "source-meeting-q3-leadership-update",
        ],
      },
      {
        title: "Assistant tone · scripted → warmer",
        explanation:
          "Mobile empty-state copy landed on 'What needs remembering?' in the Jul 14 design 1:1 — a warmer voice than the earlier 'How can I help?'",
        threadId: "thread-migration-timeline",
        status: "changed",
        sourceIds: ["source-meeting-mobile-onboarding-review"],
      },
    ],
    suggestedFollowUps: [
      "What is blocking the Gemrise launch?",
      "What did we commit for the Gemrise launch?",
    ],
  },

  summarize_topic: {
    answer:
      "Where things stand on the Gemrise launch: six meetings on this topic, most recent was the Jul 15 leadership readout. October 15 is on the table as a tentative internal-only target, but launch timing is now the critical-path risk — it depends on security approval clearing, and the security-review owner on our side still isn't named. GTM messaging is also open, with Sarah re-committed to Friday. On the model side, Aurora is green: 94% on the summarization eval, the 07-11 checkpoint is frozen, and Priya is cleared to start her three-pass review. The mobile hand-off is design-ready but waiting on the shared context spine engineering commit.",
    findings: [
      {
        title: "Gemrise Launch · topic snapshot",
        explanation:
          "6 meetings on this topic. Latest: Jul 15 leadership readout. Launch timing is now the critical-path risk.",
        threadId: "thread-migration-timeline",
        status: "open",
        sourceIds: [
          "source-meeting-acme-june-12",
          "source-meeting-acme-renewal",
          "source-doc-renewal-proposal",
          "source-meeting-q3-leadership-update",
        ],
      },
      {
        title: "Aurora dependency · green",
        explanation:
          "94% on the summarization eval, 07-11 checkpoint frozen, red-team clean. Aurora is not the launch risk.",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        sourceIds: ["source-meeting-aurora-weekly", "source-doc-aurora-brief"],
      },
      {
        title: "Mobile hand-off · design ready, engineering pending",
        explanation:
          "Elena has the visuals; the payload waits on the shared context spine commit from Jimmy's team.",
        threadId: "thread-migration-timeline",
        status: "open",
        sourceIds: ["source-meeting-mobile-onboarding-review"],
      },
      {
        title: "Cloud Next positioning · breakout, not main stage",
        explanation:
          "Set in the Jul 15 Paul 1:1. Gemrise gets a 20-minute breakout co-presented by Maya and Elena, a single-line keynote mention with no timing verb, and a same-day blog post. External phrasing anywhere in the venue: 'planned for later this year, contingent on our security review.'",
        threadId: "thread-migration-timeline",
        status: "confirmed",
        sourceIds: [
          "source-meeting-paul-1-1-cloud-next",
          "source-transcript-paul-1-1-cloud-next",
        ],
      },
    ],
    suggestedFollowUps: [
      "What is blocking the Gemrise launch?",
      "What decisions were reversed?",
    ],
  },

  find_mentions: {
    answer:
      "Leadership's direction on launch timing has been consistent: no public launch date until security approval lands. That was set on Jun 18 in the risk review and reaffirmed at the Jul 15 readout, where October 15 was confirmed as an internal-only target with the external framing 'planned for later this year, contingent on the security review.' Elena's most recent input was on assistant tone at the Jul 14 mobile 1:1 — she pushed for the warmer 'What needs remembering?' copy over 'How can I help?' Priya has been named as the owner of the security review pipeline itself and is starting a three-pass review this week against the frozen Aurora checkpoint.",
    findings: [
      {
        title: "Leadership on launch timing",
        explanation:
          "Discussed on Jun 18 in the risk review. Direction: no public launch date until security approval lands. Reaffirmed at the Jul 15 readout as an internal-only October 15 target.",
        threadId: "thread-security-review",
        status: "internal",
        sourceIds: [
          "source-meeting-internal-june-18",
          "source-meeting-q3-leadership-update",
        ],
      },
      {
        title: "Elena on the assistant tone",
        explanation:
          "Raised in the Jul 14 mobile 1:1 — 'What needs remembering?' replaces 'How can I help?' on mobile empty state.",
        threadId: "thread-migration-timeline",
        status: "internal",
        sourceIds: ["source-meeting-mobile-onboarding-review"],
      },
      {
        title: "Priya on the security review pipeline",
        explanation:
          "Named at the Jul 14 Aurora weekly and the Jul 15 leadership readout — three-pass review starting this week against the frozen checkpoint.",
        threadId: "thread-security-review",
        status: "internal",
        sourceIds: [
          "source-meeting-aurora-weekly",
          "source-meeting-q3-leadership-update",
        ],
      },
    ],
    suggestedFollowUps: ["What decisions were reversed?"],
  },
};

/**
 * Per-meeting, per-question answer overrides for the scoped chat rail.
 *
 * The intent classifier will route many different suggested-question strings
 * into the same bucket (e.g. "When are we launching Gemrise?" and "What did
 * we decide about Cloud Next?" both classify to `find_decisions`). The
 * canned `answer` on that bucket is global — good for the top-level Ask
 * page, wrong for a meeting-scoped rail where every chip should read as an
 * answer to that specific question.
 *
 * When `MeetingSearchService` runs in scoped mode (a single `meetingIds`
 * filter), it first looks up `(meetingId, normalized question)` here. If
 * present, that answer replaces `canned.answer` and (optionally) the
 * finding set. If absent, the intent-level canned response is used and
 * meeting-scoped filtering runs as before.
 *
 * Normalization is `query.trim().toLowerCase()` — the keys below are
 * already normalized so the lookup is O(1).
 */
export type MeetingScopedAnswer = {
  answer: string;
  findings?: SearchFinding[];
  suggestedFollowUps?: string[];
};

export const meetingScopedAnswers: Record<
  string,
  Record<string, MeetingScopedAnswer>
> = {
  "paul-1-1-cloud-next": {
    "what did we decide about cloud next?": {
      answer:
        "The core decision: skip the Cloud Next main stage. Gemrise gets a 20-minute breakout co-presented by you and Elena instead, plus a single-line mention in Thomas's main keynote (no timing verb) and a same-day blog post that goes one layer deeper on the review-pipeline story. Paul is taking the keynote-line ask to Thomas today while the script is still open. Verbatim public phrasing locked for anyone who asks when this ships — on stage or in the hallway — is 'planned for later this year, contingent on our security review.' The word 'October' is not to be said out loud at Cloud Next under any circumstance.",
      findings: [
        {
          title: "Cloud Next posture: breakout only, no date said out loud",
          explanation:
            "Paul and Maya agreed on a 20-minute breakout, a single-line keynote mention with no timing verb, and a same-day blog post. Main stage skipped — announcing a launch date the security review can't back would follow Gemrise into October.",
          threadId: "thread-migration-timeline",
          status: "confirmed",
          timestamp: "02:06",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Verbatim public phrasing locked",
          explanation:
            "'Planned for later this year, contingent on our security review.' To be used on stage, in the hallway, and by Meredith when briefing analyst relations.",
          threadId: "thread-migration-timeline",
          status: "confirmed",
          timestamp: "06:20",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Elena to co-present the breakout",
          explanation:
            "Design carries the review-pipeline story more concretely than product does. Both speakers must be named on the breakout submission by next Wednesday.",
          threadId: "thread-migration-timeline",
          status: "confirmed",
          timestamp: "05:16",
          sourceIds: ["source-meeting-paul-1-1-cloud-next"],
        },
      ],
      suggestedFollowUps: [
        "What did I commit to next?",
        "What are the risks for the launch?",
      ],
    },
    "what did i commit to next?": {
      answer:
        "You left the 1:1 with four things on your plate. First, brief Meredith on the verbatim Cloud Next phrasing this week so analyst relations uses the same line. Second, ask Elena tomorrow about co-presenting the Cloud Next breakout — both speakers must be named on the submission by next Wednesday. Third, align Sarah's Friday GTM messaging pass to the review-pipeline framing so keynote line, breakout, blog post, and GTM copy all sit on one benefit. Fourth, send Paul a written recap by end of day so the four commitments live in one place. On Paul's side he's taking the keynote-line ask to Thomas today; the Cloud liaison conversation is parked until the first week of November.",
      findings: [
        {
          title: "Brief Meredith on the verbatim Cloud Next phrasing",
          explanation:
            "Analyst relations must use 'planned for later this year, contingent on our security review' when talking to analysts and press at Cloud Next.",
          threadId: "thread-migration-timeline",
          status: "open",
          timestamp: "06:48",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Ask Elena to co-present the Cloud Next breakout",
          explanation:
            "Both speakers must be named on the breakout submission by next Wednesday.",
          threadId: "thread-migration-timeline",
          status: "open",
          timestamp: "05:16",
          sourceIds: ["source-meeting-paul-1-1-cloud-next"],
        },
        {
          title: "Align Sarah's Friday GTM pass to the review-pipeline framing",
          explanation:
            "One benefit — the shared context spine and single review pipeline — across every surface: keynote line, breakout, blog, GTM copy.",
          threadId: "thread-final-pricing",
          status: "open",
          sourceIds: ["source-meeting-paul-1-1-cloud-next"],
        },
        {
          title: "Send Paul a written recap by end of day",
          explanation:
            "All four Cloud Next commitments in one place so nothing slips between the 1:1 and the readiness cadence.",
          threadId: "thread-migration-timeline",
          status: "open",
          timestamp: "09:36",
          sourceIds: ["source-meeting-paul-1-1-cloud-next"],
        },
      ],
      suggestedFollowUps: [
        "What did we decide about Cloud Next?",
        "What are the risks for the launch?",
      ],
    },
    "what are the risks for the launch?": {
      answer:
        "From Paul's angle, the launch itself is on track — the readiness review closed October 15 as a tentative target with the security-review path credible. The risks he named in this meeting are Cloud-Next-specific narrative risks that could compound the launch risk if handled wrong. First, if Gemrise took the main-stage keynote and then slipped past October 15, that would become the story that follows the program into November. Second, if anyone at Cloud Next says 'October' out loud in a hallway conversation and the date then slips, analyst pieces write themselves. Both risks are why the meeting locked the verbatim external phrasing and the breakout-only posture. The security-review owner unassignment is still the biggest underlying risk on the program, unchanged from the Jul 15 leadership readout.",
      findings: [
        {
          title: "Cloud Next narrative risk — main stage would compound a slip",
          explanation:
            "Announcing a launch date the security review can't back would make a slip visible externally. Breakout-only posture defuses this.",
          threadId: "thread-migration-timeline",
          status: "open",
          timestamp: "01:32",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Hallway-conversation risk — any 'October' said out loud",
          explanation:
            "Verbatim phrasing must be used by every Google speaker at Cloud Next, including Meredith's AR briefing. One off-script 'October' turns into a follow-up story.",
          threadId: "thread-migration-timeline",
          status: "open",
          timestamp: "06:20",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Underlying risk — security-review owner still unassigned",
          explanation:
            "Unchanged since the Jun 18 risk review. Priya committed at the Jul 15 leadership readout to name the owner by Friday.",
          threadId: "thread-security-review",
          status: "open",
          sourceIds: [
            "source-meeting-internal-june-18",
            "source-meeting-q3-leadership-update",
          ],
        },
      ],
      suggestedFollowUps: [
        "What did we decide about Cloud Next?",
        "Where do we stand on the Gemrise launch?",
      ],
    },
    "where do we stand on the gemrise launch?": {
      answer:
        "From Paul's read: better than a week ago. The readiness review closed October 15 as a tentative internal target with a credible security-review path, Aurora is frozen and green at 94% on the summarization eval, and Sarah is due to send the revised GTM messaging Friday. Paul explicitly said you are operating at the next level today, and if Gemrise lands well he intends to put you up in the November promo committee — that framing is what made him comfortable with the cautious Cloud Next posture. The one open thread carrying real risk is still security-review owner assignment on the security-team side; Priya committed at the Jul 15 readout to name the owner by Friday.",
      findings: [
        {
          title: "Launch on track — Oct 15 tentative, security path credible",
          explanation:
            "Paul walked into this 1:1 already read into yesterday's readiness review. Both agreed the launch is in a defensible spot to talk about at Cloud Next, provided no date leaves the room.",
          threadId: "thread-migration-timeline",
          status: "confirmed",
          timestamp: "00:24",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Promo signal — November committee if Gemrise lands clean",
          explanation:
            "Paul confirmed intent to put Maya up for promo in November if the launch lands well. That signal shaped the cautious Cloud Next posture.",
          threadId: "thread-migration-timeline",
          status: "confirmed",
          timestamp: "07:32",
          sourceIds: [
            "source-transcript-paul-1-1-cloud-next",
            "source-meeting-paul-1-1-cloud-next",
          ],
        },
        {
          title: "Open risk carried in — security-review owner unassigned",
          explanation:
            "Unchanged since Jun 18. Priya to name the owner by Friday per the Jul 15 leadership readout.",
          threadId: "thread-security-review",
          status: "open",
          sourceIds: [
            "source-meeting-internal-june-18",
            "source-meeting-q3-leadership-update",
          ],
        },
      ],
      suggestedFollowUps: [
        "What did we decide about Cloud Next?",
        "What did I commit to next?",
      ],
    },
  },
};

/**
 * Curated chip queries. Every entry MUST classify to a supported intent —
 * the classifier is exercised at page-render time to prove this stays true.
 */
export const suggestedQueries: readonly string[] = [
  "What is blocking the Gemrise launch?",
  "What did we commit for the Gemrise launch?",
  "When are we launching Gemrise?",
  "Which action items assigned to me are overdue?",
  "What changed since the last Gemrise meeting?",
  "Where do we stand on Aurora?",
  "What did leadership say about the launch date?",
];

export const unsupportedMessage =
  "This prototype ships without a Gemini wrapper. In production, this pane would run retrieval-augmented generation: your question gets embedded, matched against a vector index of every transcript and structured summary.";
