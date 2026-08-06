import { sources } from "@/data";
import type { Source } from "@/types";

export function getSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function listSources(): readonly Source[] {
  return sources;
}

export function listSourcesForMeeting(meetingId: string): readonly Source[] {
  // A source belongs to a meeting if its id encodes the meeting id (all seed
  // meeting/transcript source ids follow the `source-meeting-<id>` /
  // `source-transcript-<id>` naming convention).
  return sources.filter(
    (s) => s.id.endsWith(meetingId) || s.id.includes(`-${meetingId}`),
  );
}

/**
 * Given a set of source IDs, return the resolved sources. Missing IDs are
 * silently dropped — callers that need to reflect missing sources should
 * inspect the return length.
 */
export function listSourcesByIds(ids: readonly string[]): readonly Source[] {
  return ids
    .map((id) => getSourceById(id))
    .filter((s): s is Source => Boolean(s));
}
