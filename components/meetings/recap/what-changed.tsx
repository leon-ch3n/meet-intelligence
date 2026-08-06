import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SourceCitation } from "@/components/shared/source-citation";
import type { ChangeRow } from "@/server/services/recap-service";

type Props = { changes: ChangeRow[] };

/**
 * Recap "aha" moment: this isn't a summary, it's a diff. Every row shows
 * what the state *was* on this thread vs what it is now, with a citation.
 */
export function WhatChanged({ changes }: Props) {
  if (!changes.length) {
    return (
      <Card className="gap-2 p-5 text-sm text-muted-foreground">
        No cross-meeting state changes detected on this topic.
      </Card>
    );
  }
  return (
    <Card className="gap-0 border-insight/25 bg-insight-subtle/30 p-0">
      <div className="flex items-center gap-2 border-b border-insight/15 px-5 py-3 text-sm font-medium text-insight">
        <Sparkles className="size-4" aria-hidden />
        What changed on Gemrise Launch
      </div>
      <ul className="divide-y divide-border">
        {changes.map((change) => (
          <li key={change.id} className="space-y-2 px-5 py-4">
            <p className="text-sm font-medium">{change.title}</p>
            {(change.priorState || change.newState) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {change.priorState && (
                  <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground line-through decoration-muted-foreground/40">
                    {change.priorState}
                  </span>
                )}
                {change.priorState && change.newState && (
                  <ArrowRight
                    className="size-3.5 text-muted-foreground"
                    aria-hidden
                  />
                )}
                {change.newState && (
                  <span className="rounded-md bg-success-subtle px-2 py-1 font-medium text-success">
                    {change.newState}
                  </span>
                )}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {change.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {change.sources.map((source) => (
                <SourceCitation key={source.id} source={source} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
