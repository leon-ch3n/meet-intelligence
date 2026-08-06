import { DEMO_NOW } from "@/lib/dates";
import {
  actionRepository,
  meetingRepository,
  personRepository,
  sourceRepository,
  threadRepository,
  topicRepository,
} from "@/server/repositories";
import { canUserViewSource } from "@/server/permissions/access-control";
import type {
  ActionItem,
  Meeting,
  Person,
  Source,
  ThreadEvent,
  Topic,
} from "@/types";

/**
 * MeetingBriefService and AgendaService, colocated. Deterministic composition
 * over the seeded thread graph — every "insight" cites its source. Never
 * fabricate; when a source is restricted the brief returns a typed marker
 * instead of the excerpt.
 *
 * Aha moment for Brief (docs/screens.md §2): "I know what happened last time
 * and what's unresolved before I click into the meeting."
 */

export type RecurringConcern = {
  threadId: string;
  threadName: string;
  firstRaised: ThreadEvent;
  latestMention: ThreadEvent;
  status: "open" | "recurring" | "partially_resolved" | "resolved";
  currentStatusLabel: string;
  raisedByName: string;
  citedExcerpt: string;
};

export type OpenActionRow = {
  action: ActionItem;
  owner: Person | undefined;
  isOverdue: boolean;
  overdueDays: number;
  sourceMeetingTitle: string | undefined;
};

export type ContextSource =
  | {
      status: "ok";
      source: Source;
    }
  | {
      status: "restricted";
      title: string;
      sourceType: Source["sourceType"];
      message: string;
    };

export type SuggestedAgendaItem = {
  id: string;
  title: string;
  rationale: string;
  priority: "high" | "medium" | "low";
  sourceThreadId?: string;
};

export type PreviousMeetingSummary = {
  meeting: Meeting;
  discussionPoints: string[];
  decisions: string[];
  commitments: string[];
  openQuestions: string[];
};

export type MeetingBrief = {
  meeting: Meeting;
  organizer: Person | undefined;
  attendees: Person[];
  topic: Topic | undefined;
  objective: string;
  executiveBrief: string;
  recurringConcerns: RecurringConcern[];
  previousMeeting: PreviousMeetingSummary | undefined;
  openActions: OpenActionRow[];
  relevantSources: ContextSource[];
  suggestedAgenda: SuggestedAgendaItem[];
  suggestedQuestions: string[];
};

const CURRENT_ISO = DEMO_NOW;

// ── Recurring concerns ─────────────────────────────────────────────────────

function computeConcernStatus(
  events: readonly ThreadEvent[],
): RecurringConcern["status"] {
  const hasChangeResolved = events.some(
    (e) => e.kind === "change" && e.status === "resolved",
  );
  if (hasChangeResolved) return "partially_resolved";
  const hasOpenRisk = events.some(
    (e) => e.kind === "risk" && e.status === "open",
  );
  if (hasOpenRisk) return "open";
  const raisings = events.filter((e) => e.kind === "concern");
  if (raisings.length >= 2) return "recurring";
  return "open";
}

const statusLabelMap: Record<RecurringConcern["status"], string> = {
  open: "Open — unresolved",
  recurring: "Recurring — raised in multiple meetings",
  partially_resolved: "Partially resolved",
  resolved: "Resolved",
};

function getRecurringConcerns(topic: Topic): RecurringConcern[] {
  const threads = threadRepository.listThreadsForTopic(topic.id);
  return threads.map((thread) => {
    const events = threadRepository.listEventsForThread(thread.id);
    const raisings = events.filter((e) => e.kind === "concern");
    const firstRaised = raisings[0] ?? events[0];
    const latestMention = events[events.length - 1] ?? firstRaised;
    const status = computeConcernStatus(events);
    const raisedBy = firstRaised.speakerId
      ? personRepository.getPersonById(firstRaised.speakerId)
      : undefined;
    return {
      threadId: thread.id,
      threadName: thread.name,
      firstRaised,
      latestMention,
      status,
      currentStatusLabel: statusLabelMap[status],
      raisedByName: raisedBy?.name ?? "Unknown speaker",
      citedExcerpt: firstRaised.description ?? firstRaised.title,
    };
  });
}

// ── Open actions relevant to this meeting's topic ──────────────────────────

function getOpenActions(meeting: Meeting): OpenActionRow[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  const topic = topicRepository.getTopicById(topicId);
  if (!topic) return [];
  return topic.actionItemIds
    .map((id) => actionRepository.getActionById(id))
    .filter((a): a is ActionItem => Boolean(a))
    .filter((a) => a.status === "open" || a.status === "overdue")
    .map((action) => {
      const overdueDays = action.dueDate
        ? Math.max(
            0,
            Math.round(
              (new Date(CURRENT_ISO).getTime() -
                new Date(action.dueDate).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 0;
      const sourceMeetingId = sourceMeetingIdOf(action.sourceId);
      const sourceMeeting = sourceMeetingId
        ? meetingRepository.getMeetingById(sourceMeetingId)
        : undefined;
      return {
        action,
        owner: action.ownerId
          ? personRepository.getPersonById(action.ownerId)
          : undefined,
        isOverdue: action.status === "overdue",
        overdueDays,
        sourceMeetingTitle: sourceMeeting?.title,
      };
    });
}

function sourceMeetingIdOf(sourceId: string): string | undefined {
  if (sourceId.startsWith("source-meeting-"))
    return sourceId.slice("source-meeting-".length);
  if (sourceId.startsWith("source-transcript-"))
    return sourceId.slice("source-transcript-".length);
  return undefined;
}

// ── Context sources (with restricted-source example) ───────────────────────

function getRelevantSources(
  userId: string,
  meeting: Meeting,
): ContextSource[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  // Curated list for the demo: covers gmail, drive, meet transcript, calendar,
  // internal chat, plus the one restricted-approval doc.
  const curatedIds = [
    "source-email-acme-followup",
    "source-doc-renewal-proposal",
    "source-doc-migration-plan",
    "source-doc-security-checklist",
    "source-doc-pricing-approval",
    "source-calendar-acme-renewal",
    "source-chat-internal-pricing",
  ];
  const results: ContextSource[] = [];
  for (const id of curatedIds) {
    const source = sourceRepository.getSourceById(id);
    if (!source) continue;
    if (canUserViewSource(userId, id)) {
      results.push({ status: "ok", source });
    } else {
      results.push({
        status: "restricted",
        title: source.title,
        sourceType: source.sourceType,
        message: `${source.title} — restricted`,
      });
    }
  }
  return results;
}

// ── Previous meeting summary ───────────────────────────────────────────────

const previousMeetingSummaries: Record<string, Omit<PreviousMeetingSummary, "meeting">> = {
  "acme-june-12": {
    discussionPoints: [
      "Gemrise launch sequencing across Docs, Sheets, Slides, and Meet",
      "Security-review ownership on our side",
      "Revised GTM messaging",
    ],
    decisions: [
      "No launch date committed on the call",
    ],
    commitments: [
      "Sarah to prepare revised GTM messaging (by July 10)",
    ],
    openQuestions: [
      "Who owns the Gemrise security review on our side?",
      "What launch sequence works for a Q3 push?",
    ],
  },
  "internal-june-18": {
    discussionPoints: [
      "Alignment on Gemrise launch risks",
      "Security-first policy for public launch commitments",
    ],
    decisions: [
      "Do not commit a public launch date before security approval",
    ],
    commitments: [
      "Confirm the Gemrise security-review owner on our side",
    ],
    openQuestions: [
      "Who owns the security review?",
    ],
  },
};

function getPreviousMeetingSummary(
  meeting: Meeting,
): PreviousMeetingSummary | undefined {
  const topicId = meeting.topicIds[0];
  if (!topicId) return undefined;
  const previous = meetingRepository.getPreviousMeetingOnTopic(
    topicId,
    meeting.startTime,
  );
  if (!previous) return undefined;
  const canned = previousMeetingSummaries[previous.id];
  if (!canned) {
    return {
      meeting: previous,
      discussionPoints: [],
      decisions: [],
      commitments: [],
      openQuestions: [],
    };
  }
  return { meeting: previous, ...canned };
}

// ── Suggested agenda (AgendaService) ───────────────────────────────────────

export function getSuggestedAgenda(
  meeting: Meeting,
  maxItems = 4,
): SuggestedAgendaItem[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  const threads = threadRepository.listThreadsForTopic(topicId);

  const items: SuggestedAgendaItem[] = [];

  // 1. Overdue commitments first.
  const topic = topicRepository.getTopicById(topicId);
  const overdueAction = topic?.actionItemIds
    .map((id) => actionRepository.getActionById(id))
    .find((a) => a?.status === "overdue");
  if (overdueAction) {
    items.push({
      id: "agenda-pricing",
      title: "Confirm revised GTM messaging status",
      rationale:
        "Sarah's July 10 commitment is overdue — resolve before the leadership readout.",
      priority: "high",
      sourceThreadId: overdueAction.threadId,
    });
  }

  // 2. Threads with open concerns / risks.
  const migrationThread = threads.find((t) => t.name === "Launch timeline");
  if (migrationThread) {
    items.push({
      id: "agenda-migration",
      title: "Align on Gemrise launch timeline",
      rationale:
        "Launch timing has been raised in every Gemrise meeting; propose the October 15 target pending security sign-off.",
      priority: "high",
      sourceThreadId: migrationThread.id,
    });
  }

  const securityThread = threads.find(
    (t) => t.name === "Security-review ownership",
  );
  if (securityThread) {
    items.push({
      id: "agenda-security",
      title: "Assign security-review owner",
      rationale:
        "Ownership has been unassigned since June 12 and blocks the launch target.",
      priority: "medium",
      sourceThreadId: securityThread.id,
    });
  }

  // 3. Leadership readout catch-all.
  items.push({
    id: "agenda-renewal",
    title: "Confirm leadership readout narrative",
    rationale:
      "Q3 leadership readout is July 14 — clarify what we're committing publicly vs. holding internally.",
    priority: "medium",
  });

  return items.slice(0, maxItems);
}

// ── Objective + executive brief ────────────────────────────────────────────

function getObjective(meeting: Meeting, topic: Topic | undefined): string {
  if (topic?.id === "topic-acme-renewal") {
    return "Confirm launch timing, security-review ownership, and revised GTM messaging so the Gemrise launch can move forward.";
  }
  return meeting.description ?? meeting.title;
}

function getExecutiveBrief(
  concerns: RecurringConcern[],
  openActions: OpenActionRow[],
): string {
  const outstandingPricing = openActions.find(
    (a) => a.action.threadId === "thread-acme-pricing" && a.isOverdue,
  );
  const parts = [
    "The team previously raised concerns about Gemrise launch timing, security-review ownership, and revised GTM messaging.",
  ];
  const migration = concerns.find((c) => c.threadName === "Launch timeline");
  if (migration) {
    parts.push(
      migration.status === "partially_resolved"
        ? "The launch timeline is partially resolved pending security approval."
        : "The launch timeline remains unresolved.",
    );
  }
  if (outstandingPricing && outstandingPricing.owner) {
    parts.push(
      `${outstandingPricing.owner.name} committed to sending revised GTM messaging by July 10, but no document has been shared.`,
    );
  }
  return parts.join(" ");
}

// ── Suggested questions (chips) ────────────────────────────────────────────

const suggestedQuestions = [
  "What concerns has the team repeated on Gemrise?",
  "What did we commit for the Gemrise launch?",
  "What remains unresolved?",
  "What changed since the previous Gemrise meeting?",
];

// ── Public entry ───────────────────────────────────────────────────────────

export function getMeetingBrief(
  meetingId: string,
  userId: string,
): MeetingBrief | undefined {
  const meeting = meetingRepository.getMeetingById(meetingId);
  if (!meeting) return undefined;
  const topic = meeting.topicIds[0]
    ? topicRepository.getTopicById(meeting.topicIds[0])
    : undefined;
  const attendees = meeting.attendeeIds
    .map((id) => personRepository.getPersonById(id))
    .filter((p): p is Person => Boolean(p));

  const recurringConcerns = topic ? getRecurringConcerns(topic) : [];
  const openActions = getOpenActions(meeting);
  const relevantSources = getRelevantSources(userId, meeting);
  const previousMeeting = getPreviousMeetingSummary(meeting);
  const suggestedAgenda = getSuggestedAgenda(meeting);
  const objective = getObjective(meeting, topic);
  const executiveBrief = getExecutiveBrief(recurringConcerns, openActions);

  return {
    meeting,
    organizer: personRepository.getPersonById(meeting.organizerId),
    attendees,
    topic,
    objective,
    executiveBrief,
    recurringConcerns,
    previousMeeting,
    openActions,
    relevantSources,
    suggestedAgenda,
    suggestedQuestions,
  };
}
