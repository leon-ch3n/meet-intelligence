// Canonical types for Meet Command Center.
// This file is the single source of truth. Docs may show illustrative snippets,
// but the types here are authoritative — do not duplicate elsewhere.

export type Visibility =
  | "private"
  | "internal"
  | "all-attendees"
  | "selected-users";

export type RelationshipType = "internal" | "external";

// ── People ──────────────────────────────────────────────────────────────────

export type Person = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  relationshipType: RelationshipType;
};

// ── Meetings & transcripts ──────────────────────────────────────────────────

export type MeetingStatus = "upcoming" | "live" | "completed";
export type MeetingType = "internal" | "external";

export type Meeting = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: MeetingStatus;
  meetingType: MeetingType;
  organizerId: string;
  attendeeIds: string[];
  topicIds: string[];
  accountId?: string;
  transcriptId?: string;
  recordingUrl?: string;
  visibility: Visibility;
};

export type TranscriptSegment = {
  id: string;
  speakerId: string;
  startTime: number;
  endTime: number;
  text: string;
  visibility: Visibility;
};

export type Transcript = {
  id: string;
  meetingId: string;
  segments: TranscriptSegment[];
};

// ── Threads: the linking primitive (see docs/architecture.md §1) ────────────

export type ThreadEventKind =
  | "decision"
  | "commitment"
  | "risk"
  | "concern"
  | "question"
  | "change"
  | "source_mention";

export type ThreadEvent = {
  id: string;
  threadId: string;
  kind: ThreadEventKind;
  title: string;
  description?: string;
  status:
    | "detected"
    | "confirmed"
    | "superseded"
    | "reversed"
    | "open"
    | "resolved"
    | "completed"
    | "overdue"
    | "dropped"
    | "answered";
  ownerId?: string;
  speakerId?: string;
  timestamp: string;
  sourceId: string;
  linkedEventIds: string[];
  visibility: Visibility;
  confidence?: number;
};

export type Thread = {
  id: string;
  name: string;
  topicId: string;
  eventIds: string[];
};

// ── Topics ──────────────────────────────────────────────────────────────────

export type Topic = {
  id: string;
  name: string;
  summary: string;
  meetingIds: string[];
  participantIds: string[];
  threadIds: string[];
  decisionIds: string[];
  actionItemIds: string[];
  riskIds: string[];
};

// ── First-class entities (materialized views of thread events) ─────────────

export type DecisionStatus = "detected" | "confirmed" | "reversed" | "superseded";

export type Decision = {
  id: string;
  text: string;
  ownerId?: string;
  status: DecisionStatus;
  sourceId: string;
  threadId: string;
  visibility: Visibility;
  effectiveDate?: string;
  supersedesId?: string;
};

export type ActionItemStatus =
  | "detected"
  | "open"
  | "completed"
  | "overdue"
  | "dropped";

export type ActionItem = {
  id: string;
  text: string;
  ownerId?: string;
  dueDate?: string;
  status: ActionItemStatus;
  sourceId: string;
  threadId: string;
  visibility: Visibility;
};

export type Risk = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "open" | "resolved";
  sourceIds: string[];
  threadId: string;
  visibility: Visibility;
};

// ── Sources & insights ──────────────────────────────────────────────────────

export type SourceType =
  | "meeting"
  | "transcript"
  | "email"
  | "document"
  | "calendar"
  | "chat";

export type Source = {
  id: string;
  sourceType: SourceType;
  title: string;
  ownerId: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
  excerpt?: string;
  timestamp?: string;
  visibility: Visibility;
  permittedUserIds: string[];
};

export type TranscriptSource = {
  sourceId: string;
  meetingId: string;
  segmentId: string;
  timestamp: string;
  excerpt: string;
};

export type InsightType =
  | "decision"
  | "action"
  | "risk"
  | "question"
  | "commitment"
  | "change"
  | "conflict";

export type InsightStatus =
  | "detected"
  | "confirmed"
  | "dismissed"
  | "resolved"
  | "superseded";

export type Insight = {
  id: string;
  insightType: InsightType;
  title: string;
  description: string;
  confidence: number;
  sourceIds: string[];
  threadId?: string;
  visibility: Visibility;
  status: InsightStatus;
};

// ── Widget I/O types ────────────────────────────────────────────────────────

export type AgendaItem = {
  id: string;
  title: string;
  rationale: string;
  priority: "high" | "medium" | "low";
  sourceIds: string[];
};

export type PreMeetingBriefInput = {
  meetingId: string;
  userId: string;
};

export type PreMeetingBrief = {
  meetingObjective: string;
  executiveBrief: string;
  recurringConcerns: Insight[];
  unresolvedItems: Insight[];
  recentChanges: Insight[];
  suggestedAgenda: AgendaItem[];
  relevantSources: Source[];
};

export type SuggestedAgendaInput = {
  meetingId: string;
  maxItems?: number;
};

export type SuggestedAgendaOutput = {
  items: AgendaItem[];
};

export type DetectedDecision = {
  id: string;
  text: string;
  status: "detected";
  confidence: number;
  ownerId?: string;
  effectiveDate?: string;
  source: TranscriptSource;
  requiresConfirmation: true;
};

export type DetectedActionItem = {
  id: string;
  text: string;
  ownerId?: string;
  dueDate?: string;
  confidence: number;
  source: TranscriptSource;
  status: "detected";
  requiresConfirmation: true;
  missingFields?: Array<"ownerId" | "dueDate">;
};

export type ConflictDetectionInput = {
  meetingId: string;
  candidateDecisionId: string;
};

export type DecisionConflict = {
  hasConflict: boolean;
  currentDecision: Decision;
  conflictingDecision?: Decision;
  explanation?: string;
  severity?: "low" | "medium" | "high";
  sourceIds: string[];
};

export type MeetingChangeInput = {
  currentMeetingId: string;
  comparisonMeetingIds?: string[];
};

export type Change = {
  id: string;
  title: string;
  description: string;
  priorState?: string;
  newState?: string;
  sourceIds: string[];
  timestamp: string;
};

export type MeetingChange = {
  resolvedConcerns: Change[];
  newConcerns: Change[];
  changedDecisions: Change[];
  newCommitments: Change[];
};

export type FollowUpDraftInput = {
  meetingId: string;
  audience: "internal" | "external";
};

export type FollowUpDraft = {
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

export type TimelineEvent = {
  id: string;
  title: string;
  timestamp: string;
  sourceIds: string[];
};

export type TopicMemoryUpdateInput = {
  meetingId: string;
  topicId: string;
};

export type TopicMemoryUpdate = {
  topicId: string;
  updatedSummary: string;
  newDecisions: Decision[];
  newActionItems: ActionItem[];
  resolvedRisks: Risk[];
  newRisks: Risk[];
  timelineEvents: TimelineEvent[];
};

// ── Meeting summary (post-meeting long-form brief) ──────────────────────────

export type MeetingSummarySection = {
  heading: string;
  // Ordered paragraphs and bullet groups. Empty array is allowed for a
  // heading-only anchor (rare).
  body: MeetingSummaryBlock[];
};

export type MeetingSummaryBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "bullets"; items: string[] };

export type MeetingSummary = {
  headline: string;
  // 2–3 sentence TL;DR shown up top before the reader dives in.
  tldr: string;
  sections: MeetingSummarySection[];
};

// ── Ask Meetings ────────────────────────────────────────────────────────────

export type MeetingSearchIntent =
  | "find_decisions"
  | "find_commitments"
  | "identify_blockers"
  | "prepare_for_meeting"
  | "summarize_topic"
  | "find_overdue_actions"
  | "compare_meetings"
  | "find_mentions";

export type AskMeetingsInput = {
  query: string;
  userId: string;
  filters?: {
    topicIds?: string[];
    personIds?: string[];
    meetingIds?: string[];
    dateStart?: string;
    dateEnd?: string;
  };
};

export type SearchFinding = {
  title: string;
  explanation: string;
  sourceIds: string[];
  threadId?: string;
  status?: string;
  timestamp?: string;
};

export type AskMeetingsResponse = {
  interpretedIntent: MeetingSearchIntent;
  answer: string;
  findings: SearchFinding[];
  sources: Source[];
  suggestedFollowUps: string[];
};

// ── Widget state envelope (see docs/architecture.md §10) ────────────────────

export type WidgetState<T> =
  | { status: "loading" }
  | { status: "ok"; data: T }
  | { status: "empty"; message?: string }
  | { status: "error"; message: string }
  | { status: "restricted"; message: string }
  | { status: "low_confidence"; data: T; message: string }
  | { status: "missing_source"; data: T; message: string }
  | { status: "partial"; data: T; message: string }
  | { status: "unsupported_query"; message: string };
