import {
  meetingRepository,
  personRepository,
  sourceRepository,
  topicRepository,
} from "@/server/repositories";
import { canUserViewSource } from "@/server/permissions/access-control";
import { transcripts } from "@/data/transcripts";
import { meetingSummaries } from "@/data/meeting-summaries";
import {
  defaultMeetingSuggestedQuestions,
  meetingSuggestedQuestions,
} from "@/data/meeting-suggested-questions";
import { getMeetingBrief } from "@/server/services/brief-service";
import { getRecap } from "@/server/services/recap-service";
import type {
  Meeting,
  MeetingSummary,
  Person,
  Source,
  Topic,
  Transcript,
  TranscriptSegment,
  Visibility,
} from "@/types";
import type {
  RecapAction,
  RecapDecision,
  RecapRisk,
  ChangeRow,
} from "@/server/services/recap-service";
import type { MeetingBrief } from "@/server/services/brief-service";

/**
 * One-shot composite for the consolidated Meeting detail page (Home → Meeting).
 *
 * Notes/Sources tabs, sub-tabs, transcript, and the chat rail's proactive
 * opening message all read from this one envelope. Composes brief + recap +
 * transcript with permission filtering on the transcript source.
 */

export type TranscriptSegmentRow = {
  segment: TranscriptSegment;
  speaker: Person | undefined;
};

export type TranscriptView =
  | { status: "ok"; segments: TranscriptSegmentRow[] }
  | { status: "empty" }
  | { status: "restricted"; message: string };

export type ProactiveNote = {
  message: string;
  source: Source | undefined;
  priorState: string;
  newState: string;
};

export type MeetingDetail = {
  meeting: Meeting;
  organizer: Person | undefined;
  attendees: Person[];
  topic: Topic | undefined;
  // Notes tab (LLM-derived)
  summary: MeetingSummary;
  changes: ChangeRow[];
  decisions: RecapDecision[];
  actions: RecapAction[];
  risks: RecapRisk[];
  openQuestions: string[];
  suggestedQuestions: string[];
  // Sources tab
  transcript: TranscriptView;
  citedSources: Source[];
  // Chat rail bootstrap
  proactiveNote: ProactiveNote | undefined;
  // Brief pass-throughs the Notes summary sub-tab needs
  executiveBrief: string;
  previousMeetingTitle: string | undefined;
  recurringConcernsCount: number;
};

function getTranscriptForMeeting(meetingId: string): Transcript | undefined {
  return transcripts.find((t) => t.meetingId === meetingId);
}

function getTranscriptView(
  meeting: Meeting,
  userId: string,
): TranscriptView {
  const transcript = getTranscriptForMeeting(meeting.id);
  if (!transcript) return { status: "empty" };

  // Transcript is served under `source-transcript-<meetingId>` — enforce the
  // same permission gate as anywhere else the transcript is cited.
  const transcriptSourceId = `source-transcript-${meeting.id}`;
  const transcriptSource = sourceRepository.getSourceById(transcriptSourceId);
  if (transcriptSource && !canUserViewSource(userId, transcriptSourceId)) {
    return {
      status: "restricted",
      message: `${transcriptSource.title} — restricted for this viewer`,
    };
  }

  // Per-segment visibility filter — matches the transcript type. `all-attendees`
  // and `internal` are viewable to Maya; `private`/`selected-users` would gate.
  const viewable: Visibility[] = ["all-attendees", "internal"];
  const segments: TranscriptSegmentRow[] = transcript.segments
    .filter((s) => viewable.includes(s.visibility))
    .map((s) => ({
      segment: s,
      speaker: personRepository.getPersonById(s.speakerId),
    }));

  return { status: "ok", segments };
}

function pickProactiveNote(
  changes: ChangeRow[],
): ProactiveNote | undefined {
  const lineageChange = changes.find(
    (c) => Boolean(c.priorState) && Boolean(c.newState),
  );
  if (!lineageChange) return undefined;
  const message = `Heads up: ${lineageChange.newState} supersedes an earlier position — ${lineageChange.priorState}. Both events cite the same thread.`;
  return {
    message,
    source: lineageChange.sources[0],
    priorState: lineageChange.priorState!,
    newState: lineageChange.newState!,
  };
}

function collectCitedSources(
  brief: MeetingBrief | undefined,
  recapDecisions: RecapDecision[],
  recapActions: RecapAction[],
  recapRisks: RecapRisk[],
  changes: ChangeRow[],
  userId: string,
): Source[] {
  const ids = new Set<string>();
  const push = (id?: string) => {
    if (id) ids.add(id);
  };
  for (const d of recapDecisions) push(d.decision.sourceId);
  for (const a of recapActions) push(a.action.sourceId);
  for (const r of recapRisks) r.risk.sourceIds.forEach(push);
  for (const c of changes) c.sources.forEach((s) => push(s.id));
  // Brief context sources — restricted entries surface separately in the UI.
  if (brief) {
    for (const cs of brief.relevantSources) {
      if (cs.status === "ok") push(cs.source.id);
    }
  }
  return [...ids]
    .filter((id) => canUserViewSource(userId, id))
    .map((id) => sourceRepository.getSourceById(id))
    .filter((s): s is Source => Boolean(s));
}

export function getMeetingDetail(
  meetingId: string,
  userId: string,
): MeetingDetail | undefined {
  const meeting = meetingRepository.getMeetingById(meetingId);
  if (!meeting) return undefined;

  const brief = getMeetingBrief(meetingId, userId);
  const recap = getRecap(meetingId);

  const topic = meeting.topicIds[0]
    ? topicRepository.getTopicById(meeting.topicIds[0])
    : undefined;
  const attendees = meeting.attendeeIds
    .map((id) => personRepository.getPersonById(id))
    .filter((p): p is Person => Boolean(p));

  const changes = recap?.changes ?? [];
  const decisions = recap?.decisions ?? [];
  const actions = recap?.actions ?? [];
  const risks = recap?.risks ?? [];

  const summary: MeetingSummary = meetingSummaries[meetingId] ?? {
    headline: meeting.title,
    tldr:
      recap?.executiveSummary ??
      brief?.executiveBrief ??
      meeting.description ??
      meeting.title,
    sections: [],
  };

  return {
    meeting,
    organizer: personRepository.getPersonById(meeting.organizerId),
    attendees,
    topic,
    summary,
    changes,
    decisions,
    actions,
    risks,
    openQuestions: recap?.openQuestions ?? [],
    // Meeting-specific prompt widgets for the right-rail chat. Falls back to
    // the brief's generic Gemrise set, then to a hard-coded default.
    suggestedQuestions:
      meetingSuggestedQuestions[meetingId] ??
      (brief?.suggestedQuestions.length
        ? brief.suggestedQuestions
        : [...defaultMeetingSuggestedQuestions]),
    transcript: getTranscriptView(meeting, userId),
    citedSources: collectCitedSources(
      brief,
      decisions,
      actions,
      risks,
      changes,
      userId,
    ),
    proactiveNote: pickProactiveNote(changes),
    executiveBrief: brief?.executiveBrief ?? recap?.executiveSummary ?? "",
    previousMeetingTitle: brief?.previousMeeting?.meeting.title,
    recurringConcernsCount: brief?.recurringConcerns.length ?? 0,
  };
}
