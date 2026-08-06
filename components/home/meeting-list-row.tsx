import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { formatTime } from "@/lib/dates";
import type { HomeMeetingRow } from "@/server/services/home-list-service";

type Props = { row: HomeMeetingRow };

export function MeetingListRow({ row }: Props) {
  const { meeting, topic, durationMinutes } = row;
  const isExternal = meeting.meetingType === "external";

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/70 focus-visible:outline-none"
    >
      <div
        aria-hidden
        className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground"
      >
        {isExternal ? (
          <Users className="size-4" aria-hidden />
        ) : (
          <FileText className="size-4" aria-hidden />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] leading-tight text-foreground">
            {meeting.title}
          </p>
          {topic && (
            <span className="hidden truncate rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
              {topic.name}
            </span>
          )}
        </div>
        {meeting.description && (
          <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">
            {meeting.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 text-[12px] text-muted-foreground tabular-nums">
        <span>{durationMinutes} min</span>
        <span>{formatTime(meeting.startTime)}</span>
      </div>
    </Link>
  );
}
