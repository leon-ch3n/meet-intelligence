import { Play } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { TranscriptView } from "@/server/services/meeting-detail-service";

type Props = { view: TranscriptView };

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TranscriptPanel({ view }: Props) {
  if (view.status === "empty") {
    return (
      <EmptyState
        title="Transcript not available"
        description="This meeting hasn't been transcribed yet."
      />
    );
  }
  if (view.status === "restricted") {
    return (
      <EmptyState
        title="Transcript restricted"
        description={view.message}
      />
    );
  }

  return (
    <ol className="divide-y divide-border/70 rounded-2xl border border-border bg-background">
      {view.segments.map(({ segment, speaker }) => (
        <li
          key={segment.id}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-3"
        >
          <button
            type="button"
            aria-label={`Play from ${formatTimestamp(segment.startTime)}`}
            className="mt-0.5 inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-action/40 hover:text-action"
          >
            <Play className="size-3.5" aria-hidden />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {speaker?.name ?? "Speaker"}
              </span>
              <span>·</span>
              <span>{formatTimestamp(segment.startTime)}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed">{segment.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
