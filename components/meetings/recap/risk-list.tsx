"use client";

import { AlertTriangle, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/shared/status-pill";
import { SourceCitation } from "@/components/shared/source-citation";
import { VisibilityMenu } from "@/components/shared/visibility-menu";
import { useAppStore } from "@/store/app-store";
import type { Visibility } from "@/types";
import type { RecapRisk } from "@/server/services/recap-service";

type Props = { risks: RecapRisk[] };

const severityTone = {
  low: "attention",
  medium: "attention",
  high: "risk",
} as const;

export function RiskList({ risks }: Props) {
  if (!risks.length) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        No open risks on this topic.
      </Card>
    );
  }
  return (
    <ul className="space-y-2">
      {risks.map((row) => (
        <li key={row.risk.id}>
          <RiskRow row={row} />
        </li>
      ))}
    </ul>
  );
}

function RiskRow({ row }: { row: RecapRisk }) {
  const { risk, sources } = row;
  const override = useAppStore((s) => s.insightOverrides[risk.id]);
  const setInsightVisibility = useAppStore((s) => s.setInsightVisibility);
  const acknowledgeInsight = useAppStore((s) => s.acknowledgeInsight);
  const dismissInsight = useAppStore((s) => s.dismissInsight);

  if (override?.status === "dismissed") return null;
  const visibility: Visibility = override?.visibility ?? risk.visibility;
  const acknowledged = override?.status === "confirmed";

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`mt-1 size-4 ${acknowledged ? "text-muted-foreground" : "text-risk"}`}
          aria-hidden
        />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">{risk.title}</p>
          {risk.description && (
            <p className="text-xs text-muted-foreground">{risk.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {sources.map((source) => (
              <SourceCitation key={source.id} source={source} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusPill tone={severityTone[risk.severity]}>
            {risk.severity}
          </StatusPill>
          {acknowledged && <StatusPill tone="success">Acknowledged</StatusPill>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <VisibilityMenu
          value={visibility}
          onChange={(v) => setInsightVisibility(risk.id, v)}
        />
        <div className="flex items-center gap-1.5">
          {!acknowledged && (
            <button
              onClick={() => acknowledgeInsight(risk.id)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              <Check className="size-3.5" aria-hidden /> Acknowledge
            </button>
          )}
          <button
            onClick={() => dismissInsight(risk.id)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" aria-hidden /> Dismiss
          </button>
        </div>
      </div>
    </Card>
  );
}
