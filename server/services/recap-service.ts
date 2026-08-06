import {
  actionRepository,
  decisionRepository,
  meetingRepository,
  personRepository,
  riskRepository,
  sourceRepository,
  threadRepository,
  topicRepository,
} from "@/server/repositories";
import { canUserViewSource } from "@/server/permissions/access-control";
import type {
  ActionItem,
  Change,
  Decision,
  Meeting,
  Person,
  Risk,
  Source,
  ThreadEvent,
  Topic,
} from "@/types";

/**
 * MeetingComparisonService · FollowUpDraftService · TopicMemoryService,
 * colocated. All deterministic over the seeded thread graph.
 *
 * Aha moment for Recap (docs/screens.md §5): "This isn't a summary — it's a
 * diff. I can see exactly what changed and what to do about it."
 */

// ── MeetingComparison ("What changed") ─────────────────────────────────────

export type ChangeRow = {
  id: string;
  title: string;
  description: string;
  priorState?: string;
  newState?: string;
  sources: Source[];
  timestamp: string;
};

export function getMeetingChanges(meeting: Meeting): ChangeRow[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  const threads = threadRepository.listThreadsForTopic(topicId);
  const changes: ChangeRow[] = [];
  for (const thread of threads) {
    const events = threadRepository.listEventsForThread(thread.id);
    // Any "change" events on this meeting → materialize as change rows.
    const changeEvents = events.filter(
      (e) => e.kind === "change" && sourceIsForMeeting(e.sourceId, meeting.id),
    );
    for (const ev of changeEvents) {
      const linked = ev.linkedEventIds
        .map((id) => events.find((e) => e.id === id))
        .filter((e): e is ThreadEvent => Boolean(e));
      changes.push({
        id: ev.id,
        title: ev.title,
        description: ev.description ?? ev.title,
        priorState: linked.find((e) => e.kind === "concern")?.title,
        newState: linked.find((e) => e.kind === "decision")?.title,
        sources: [sourceRepository.getSourceById(ev.sourceId)!].filter(Boolean),
        timestamp: ev.timestamp,
      });
    }
  }
  return changes;
}

function sourceIsForMeeting(sourceId: string, meetingId: string): boolean {
  return (
    sourceId === `source-meeting-${meetingId}` ||
    sourceId === `source-transcript-${meetingId}`
  );
}

// ── Decisions with lineage ─────────────────────────────────────────────────

export type RecapDecision = {
  decision: Decision;
  owner: Person | undefined;
  source: Source | undefined;
  supersedes?: {
    decision: Decision;
    source: Source | undefined;
  };
};

export function getRecapDecisions(meeting: Meeting): RecapDecision[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  const topic = topicRepository.getTopicById(topicId);
  if (!topic) return [];
  return topic.decisionIds
    .map((id) => decisionRepository.getDecisionById(id))
    .filter((d): d is Decision => Boolean(d))
    .map((decision) => {
      const owner = decision.ownerId
        ? personRepository.getPersonById(decision.ownerId)
        : undefined;
      const source = sourceRepository.getSourceById(decision.sourceId);
      // Naive lineage: any other decision on the same thread is a candidate
      // predecessor. The client-side "confirmed" transition marks the newer
      // detected decision as the successor.
      const siblings = decisionRepository.listDecisionsForThread(
        decision.threadId,
      );
      const predecessor = siblings.find(
        (d) =>
          d.id !== decision.id &&
          (d.effectiveDate ?? "") < (decision.effectiveDate ?? ""),
      );
      return {
        decision,
        owner,
        source,
        supersedes: predecessor
          ? {
              decision: predecessor,
              source: sourceRepository.getSourceById(predecessor.sourceId),
            }
          : undefined,
      };
    });
}

// ── Actions ────────────────────────────────────────────────────────────────

export type RecapAction = {
  action: ActionItem;
  owner: Person | undefined;
  source: Source | undefined;
};

export function getRecapActions(meeting: Meeting): RecapAction[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  const topic = topicRepository.getTopicById(topicId);
  if (!topic) return [];
  return topic.actionItemIds
    .map((id) => actionRepository.getActionById(id))
    .filter((a): a is ActionItem => Boolean(a))
    .map((action) => ({
      action,
      owner: action.ownerId
        ? personRepository.getPersonById(action.ownerId)
        : undefined,
      source: sourceRepository.getSourceById(action.sourceId),
    }));
}

// ── Risks ──────────────────────────────────────────────────────────────────

export type RecapRisk = {
  risk: Risk;
  sources: Source[];
};

export function getRecapRisks(meeting: Meeting): RecapRisk[] {
  const topicId = meeting.topicIds[0];
  if (!topicId) return [];
  const topic = topicRepository.getTopicById(topicId);
  if (!topic) return [];
  return topic.riskIds
    .map((id) => riskRepository.getRiskById(id))
    .filter((r): r is Risk => Boolean(r))
    .map((risk) => ({
      risk,
      sources: risk.sourceIds
        .map((id) => sourceRepository.getSourceById(id))
        .filter((s): s is Source => Boolean(s)),
    }));
}

// ── Follow-up drafts (internal vs external) ────────────────────────────────

export type FollowUpDraft = {
  audience: "internal" | "external";
  subject: string;
  greeting: string;
  summary: string;
  decisions: string[];
  actionItems: Array<{
    text: string;
    owner: string;
    dueDate?: string;
  }>;
  nextSteps: string[];
  closing: string;
  excludedInternalContent: string[];
};

const INTERNAL_ONLY_TAGS = new Set([
  "internal",
  "private",
]);

function isSourceInternalOnly(source: Source | undefined): boolean {
  if (!source) return false;
  return INTERNAL_ONLY_TAGS.has(source.visibility);
}

export function getFollowUpDraft(
  meeting: Meeting,
  audience: "internal" | "external",
  userId: string,
): FollowUpDraft {
  const decisions = getRecapDecisions(meeting);
  const actions = getRecapActions(meeting);
  const risks = getRecapRisks(meeting);
  const external = audience === "external";

  const excluded: string[] = [];

  // Filter decisions by audience.
  const decisionsForAudience = decisions.filter((d) => {
    if (!external) return true;
    const isInternal = isSourceInternalOnly(d.source);
    if (isInternal) {
      excluded.push(`Decision · ${d.decision.text}`);
      return false;
    }
    return true;
  });

  // Filter actions.
  const actionsForAudience = actions.filter((a) => {
    if (a.action.status === "detected") return false; // needs confirm first
    if (!external) return a.action.status !== "dropped";
    const isInternal = isSourceInternalOnly(a.source);
    if (isInternal) {
      excluded.push(`Action · ${a.action.text}`);
      return false;
    }
    return true;
  });

  // Filter risks.
  const risksForAudience = risks.filter((r) => {
    if (!external) return true;
    if (r.risk.visibility === "internal") {
      excluded.push(`Risk · ${r.risk.title}`);
      return false;
    }
    return true;
  });

  // Restricted-source exclusion probe (Q3 Pricing Approval).
  const pricingApproval = sourceRepository.getSourceById(
    "source-doc-pricing-approval",
  );
  if (
    pricingApproval &&
    external &&
    !canUserViewSource(userId, pricingApproval.id)
  ) {
    excluded.push(`Source · ${pricingApproval.title} (restricted)`);
  }

  const subject = external
    ? `Cross-team recap · ${meeting.title}`
    : `Internal recap · ${meeting.title}`;
  const greeting = external
    ? "Hi team,"
    : "Team —";
  const summary = external
    ? "Thanks for the discussion today. Below is a shareable recap of what was decided and what happens next."
    : "Wrapping the Gemrise call — decisions, actions, and open risks below.";
  const closing = external
    ? "Let us know if any of this looks off; we'll circulate the GTM detail separately."
    : "Reply-all if anything looks off before we share more broadly.";

  const nextSteps = external
    ? [
        "Sarah will send revised GTM messaging by Friday.",
        "Security-review owner to be confirmed on our side this week.",
      ]
    : [
        "Confirm security-review owner internally.",
        "Sarah to unblock the GTM approval doc before Friday.",
        "Circulate the shareable recap draft once GTM messaging lands.",
      ];

  return {
    audience,
    subject,
    greeting,
    summary,
    decisions: decisionsForAudience.map((d) => d.decision.text),
    actionItems: actionsForAudience.map((a) => ({
      text: a.action.text,
      owner: a.owner?.name ?? "Unassigned",
      dueDate: a.action.dueDate,
    })),
    nextSteps: external ? nextSteps : [...nextSteps, ...risksForAudience.map((r) => `Watch · ${r.risk.title}`)],
    closing,
    excludedInternalContent: excluded,
  };
}

// ── Topic Memory Update preview ────────────────────────────────────────────

export type TopicMemoryUpdatePreview = {
  topic: Topic;
  updatedSummary: string;
  newDecisions: RecapDecision[];
  newActionItems: RecapAction[];
  resolvedRisks: RecapRisk[];
  openRisks: RecapRisk[];
  timelineHighlights: string[];
};

export function getTopicMemoryPreview(
  meeting: Meeting,
): TopicMemoryUpdatePreview | undefined {
  const topicId = meeting.topicIds[0];
  if (!topicId) return undefined;
  const topic = topicRepository.getTopicById(topicId);
  if (!topic) return undefined;
  const decisions = getRecapDecisions(meeting);
  const actions = getRecapActions(meeting);
  const risks = getRecapRisks(meeting);
  return {
    topic,
    updatedSummary:
      "Gemrise launch now anchored to October 15 pending security approval. GTM messaging follow-up committed for Friday. Security-review ownership remains the primary open risk.",
    newDecisions: decisions.filter(
      (d) => d.decision.effectiveDate?.startsWith("2026-10") ?? false,
    ),
    newActionItems: actions.filter((a) => a.action.status === "detected" || a.action.status === "open"),
    resolvedRisks: [],
    openRisks: risks.filter((r) => r.risk.status === "open"),
    timelineHighlights: [
      "Launch-timing concern partially resolved",
      "October 15 target added",
      "Sarah's Friday GTM commitment created",
      "Security-review ownership still open",
    ],
  };
}

// ── Recap composite ────────────────────────────────────────────────────────

export type Recap = {
  meeting: Meeting;
  executiveSummary: string;
  changes: ChangeRow[];
  decisions: RecapDecision[];
  actions: RecapAction[];
  risks: RecapRisk[];
  openQuestions: string[];
  relatedTopics: Topic[];
  memoryPreview: TopicMemoryUpdatePreview | undefined;
};

export function getRecap(meetingId: string): Recap | undefined {
  const meeting = meetingRepository.getMeetingById(meetingId);
  if (!meeting) return undefined;
  return {
    meeting,
    executiveSummary:
      "Team landed October 15 as a tentative Gemrise launch target, pending security-review ownership on our side. Sarah re-committed to sending revised GTM messaging by Friday. Security ownership remains unassigned and is now the critical-path risk.",
    changes: getMeetingChanges(meeting),
    decisions: getRecapDecisions(meeting),
    actions: getRecapActions(meeting),
    risks: getRecapRisks(meeting),
    openQuestions: [
      "Who owns the final Gemrise security review?",
      "Do engineering and design agree on the proposed launch sequence?",
      "Is the revised GTM messaging approved internally?",
    ],
    relatedTopics: topicRepository
      .listTopics()
      .filter((t) =>
        [
          "topic-acme-renewal",
          "topic-enterprise-migration",
          "topic-security-review",
          "topic-pricing-approval",
        ].includes(t.id),
      ),
    memoryPreview: getTopicMemoryPreview(meeting),
  };
}

// ── Re-export unused-in-file Change type to satisfy consumers who prefer the
// canonical alias when needed. ─────────────────────────────────────────────
export type { Change };
