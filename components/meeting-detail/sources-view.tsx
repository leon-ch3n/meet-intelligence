import { Play, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SourceCitation } from "@/components/shared/source-citation";
import { TranscriptPanel } from "@/components/meeting-detail/transcript-panel";
import type { MeetingDetail } from "@/server/services/meeting-detail-service";

type Props = { detail: MeetingDetail };

export function SourcesView({ detail }: Props) {
  return (
    <div className="space-y-6">
      <Card className="gap-3 p-5">
        <h3 className="text-sm font-medium">Your notes</h3>
        <div className="min-h-24 rounded-md border border-dashed border-border bg-background/60 px-3 py-3 text-sm text-muted-foreground">
          Take notes here… (read-only in this prototype)
        </div>
      </Card>

      <Card className="gap-3 p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Play recording"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-action/50 hover:text-action"
          >
            <Play className="size-4" aria-hidden />
          </button>
          <div
            aria-hidden
            className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-action/60" />
          </div>
          <Volume2 className="size-4 text-muted-foreground" aria-hidden />
        </div>
      </Card>

      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-medium">Transcript</h3>
          <span className="text-xs text-muted-foreground">
            Speaker-attributed · timestamps
          </span>
        </div>
        <TranscriptPanel view={detail.transcript} />
      </div>

      {detail.citedSources.length > 0 && (
        <div>
          <h3 className="mb-2 px-1 text-sm font-medium">Cited sources</h3>
          <Card className="gap-2 p-4">
            <ul className="space-y-2">
              {detail.citedSources.map((source) => (
                <li key={source.id}>
                  <SourceCitation source={source} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
