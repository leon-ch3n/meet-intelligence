import { classifyQuery } from "@/lib/query-classifier";
import {
  cannedResponses,
  meetingScopedAnswers,
  unsupportedMessage,
} from "@/data/search-responses";
import { sourceRepository } from "@/server/repositories";
import { canUserViewSource } from "@/server/permissions/access-control";
import type {
  AskMeetingsInput,
  AskMeetingsResponse,
  SearchFinding,
  Source,
  WidgetState,
} from "@/types";

/**
 * A finding is "in scope" for a meeting when at least one of its cited
 * sources belongs to that meeting. Uses the same id convention as
 * `sourceRepository.listSourcesForMeeting`.
 */
function findingMatchesMeeting(f: SearchFinding, meetingId: string): boolean {
  return f.sourceIds.some(
    (sid) => sid.endsWith(meetingId) || sid.includes(`-${meetingId}`),
  );
}

/**
 * MeetingSearchService — Ask Meetings backend.
 *
 * Contract:
 *   1. classify the query via `lib/query-classifier` (deterministic rules)
 *   2. look up the canned response by intent from `data/search-responses`
 *   3. hydrate + permission-filter every citation before returning
 *   4. return WidgetState envelopes — never a bare object with a "guess"
 *
 * The service NEVER fabricates content. If the query doesn't classify, we
 * return the unsupported-query envelope (docs/architecture.md §7).
 */

export type AskWidgetState = WidgetState<AskMeetingsResponse>;

export function askMeetings(input: AskMeetingsInput): AskWidgetState {
  const classified = classifyQuery(input.query);
  if (!classified) {
    return { status: "unsupported_query", message: unsupportedMessage };
  }

  const canned = cannedResponses[classified.intent];
  if (!canned) {
    // Shouldn't happen — every intent has a canned response — but the
    // envelope is the right way to say "we don't have data".
    return { status: "unsupported_query", message: unsupportedMessage };
  }

  const scopedMeetingId = input.filters?.meetingIds?.[0];

  // Per-question override for a scoped chat rail. Many suggested chips
  // classify to the same intent (e.g. "when are we launching gemrise?"
  // and "what did we decide about cloud next?" both hit find_decisions),
  // so an intent-level answer reads generically. When the caller scopes
  // to a single meeting AND a question-specific answer is registered,
  // that answer + its findings replace the intent-level ones.
  const scopedOverride =
    scopedMeetingId != null
      ? meetingScopedAnswers[scopedMeetingId]?.[input.query.trim().toLowerCase()]
      : undefined;

  const rawFindings = scopedOverride?.findings ?? canned.findings;
  const answer = scopedOverride?.answer ?? canned.answer;
  const suggestedFollowUps =
    scopedOverride?.suggestedFollowUps ?? canned.suggestedFollowUps;

  // Hydrate + filter sources per finding.
  const restrictedSourceIds: string[] = [];
  let findings: SearchFinding[] = rawFindings.map((f) => {
    const filteredSourceIds = f.sourceIds.filter((sid) => {
      if (canUserViewSource(input.userId, sid)) return true;
      restrictedSourceIds.push(sid);
      return false;
    });
    return { ...f, sourceIds: filteredSourceIds };
  });

  // Meeting-scoped chat with no bespoke override: keep only findings that
  // cite this meeting's sources. Empty result → return an unsupported_query
  // envelope with a helpful message rather than an empty ok — the
  // meeting-scoped rail should say "I don't have anything specific to this
  // meeting" instead of pretending to answer. Overrides skip this filter
  // because the author already curated the finding set for the meeting.
  if (scopedMeetingId && !scopedOverride) {
    findings = findings.filter((f) => findingMatchesMeeting(f, scopedMeetingId));
    if (findings.length === 0) {
      return {
        status: "empty",
        message:
          "Nothing in this meeting matches. Try Ask (in the sidebar) to search across every meeting.",
      };
    }
  }

  // The `sources` block on the response is the DISTINCT set of hydrated
  // sources across all findings — the citations panel renders from this.
  const allowedIds = new Set(findings.flatMap((f) => f.sourceIds));
  const sources: Source[] = [...allowedIds]
    .map((id) => sourceRepository.getSourceById(id))
    .filter((s): s is Source => Boolean(s));

  const data: AskMeetingsResponse = {
    interpretedIntent: classified.intent,
    answer,
    findings,
    sources,
    suggestedFollowUps,
  };

  // If every finding lost a citation to permissioning, surface partial state
  // so the UI can render the restricted-source notice inline.
  if (restrictedSourceIds.length > 0) {
    return {
      status: "partial",
      data,
      message: `${restrictedSourceIds.length} source${
        restrictedSourceIds.length === 1 ? "" : "s"
      } restricted for this viewer.`,
    };
  }

  return { status: "ok", data };
}
