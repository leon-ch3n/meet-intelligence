import { EmptyState } from "@/components/shared/empty-state";
import { MeetingListRow } from "@/components/home/meeting-list-row";
import type { HomeGroup } from "@/server/services/home-list-service";

type Props = { groups: HomeGroup[] };

export function MeetingList({ groups }: Props) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="No meetings here yet"
        description="Meetings synced from Google Calendar will show up as they finish."
      />
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key} aria-labelledby={`group-${group.key}`}>
          <h2
            id={`group-${group.key}`}
            className="mb-1 px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground"
          >
            {group.label}
          </h2>
          <ul>
            {group.rows.map((row) => (
              <li key={row.meeting.id}>
                <MeetingListRow row={row} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
