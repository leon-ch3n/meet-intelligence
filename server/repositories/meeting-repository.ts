import { meetings, topics } from "@/data";
import type { Meeting, MeetingStatus } from "@/types";

export function getMeetingById(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function listMeetings(): readonly Meeting[] {
  return meetings;
}

export function listByStatus(status: MeetingStatus): readonly Meeting[] {
  return meetings.filter((m) => m.status === status);
}

export function listUpcoming(): readonly Meeting[] {
  return meetings
    .filter((m) => m.status === "upcoming")
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function listCompletedForTopic(topicId: string): readonly Meeting[] {
  return meetings
    .filter(
      (m) => m.status === "completed" && m.topicIds.includes(topicId),
    )
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/**
 * Latest completed meeting on the topic strictly before `beforeIso`.
 * Used by the "What changed" service in Phase 3.
 */
export function getPreviousMeetingOnTopic(
  topicId: string,
  beforeIso: string,
): Meeting | undefined {
  const priors = meetings
    .filter(
      (m) =>
        m.topicIds.includes(topicId) &&
        m.startTime < beforeIso &&
        m.status === "completed",
    )
    .slice()
    .sort((a, b) => b.startTime.localeCompare(a.startTime));
  return priors[0];
}

export function listMeetingsForTopic(topicId: string): readonly Meeting[] {
  return meetings.filter((m) => m.topicIds.includes(topicId));
}

/** Convenience — resolve a topic name for a meeting when there's exactly one. */
export function getPrimaryTopicName(meeting: Meeting): string | undefined {
  const topicId = meeting.topicIds[0];
  return topicId ? topics.find((t) => t.id === topicId)?.name : undefined;
}
