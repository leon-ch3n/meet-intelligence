import {
  meetingRepository,
  topicRepository,
} from "@/server/repositories";
import type { Meeting, Topic } from "@/types";

/**
 * HomeListService — the paper-quiet meeting list on `/`.
 *
 * Groups meetings by day (matching Pocket's date-anchored feed). Optionally
 * filters by folder (topic). Sort order: newest day first; within a day,
 * newest meeting first.
 */

export type HomeMeetingRow = {
  meeting: Meeting;
  topic: Topic | undefined;
  durationMinutes: number;
};

export type HomeGroup = {
  key: string;
  label: string;
  rows: HomeMeetingRow[];
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const todayFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatGroupLabel(iso: string, todayISO: string): string {
  const day = iso.slice(0, 10);
  const today = todayISO.slice(0, 10);
  if (day === today) return `Today, ${todayFmt.format(new Date(iso))}`;
  return dateFmt.format(new Date(iso));
}

function durationMinutes(startIso: string, endIso: string): number {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(1, Math.round(ms / 60_000));
}

export type ListMeetingsFilter = {
  topicId?: string;
};

export function listMeetings(
  filter: ListMeetingsFilter = {},
  nowIso: string,
): HomeGroup[] {
  const all = meetingRepository.listMeetings();
  const filtered = filter.topicId
    ? all.filter((m) => m.topicIds.includes(filter.topicId!))
    : all;

  // Group by ISO day. Sort keys descending so today lands first.
  const byDay = new Map<string, Meeting[]>();
  for (const m of filtered) {
    const day = m.startTime.slice(0, 10);
    const list = byDay.get(day) ?? [];
    list.push(m);
    byDay.set(day, list);
  }
  const sortedDays = [...byDay.keys()].sort((a, b) => b.localeCompare(a));

  return sortedDays.map<HomeGroup>((day) => {
    const meetings = (byDay.get(day) ?? [])
      .slice()
      .sort((a, b) => b.startTime.localeCompare(a.startTime));
    const label = formatGroupLabel(meetings[0]!.startTime, nowIso);
    return {
      key: day,
      label,
      rows: meetings.map((meeting) => ({
        meeting,
        topic: meeting.topicIds[0]
          ? topicRepository.getTopicById(meeting.topicIds[0])
          : undefined,
        durationMinutes: durationMinutes(meeting.startTime, meeting.endTime),
      })),
    };
  });
}

export type FolderRow = {
  topic: Topic;
  meetingCount: number;
};

export function listFolders(): FolderRow[] {
  const all = meetingRepository.listMeetings();
  return topicRepository
    .listTopics()
    .map<FolderRow>((topic) => ({
      topic,
      meetingCount: all.filter((m) => m.topicIds.includes(topic.id)).length,
    }))
    .filter((f) => f.meetingCount > 0);
}
