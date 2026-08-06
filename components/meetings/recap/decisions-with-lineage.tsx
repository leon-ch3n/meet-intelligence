"use client";

import { useState } from "react";
import { ArrowDown, Check, Gavel, Pencil, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/shared/status-pill";
import { SourceCitation } from "@/components/shared/source-citation";
import { VisibilityMenu } from "@/components/shared/visibility-menu";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/lib/dates";
import type { Visibility } from "@/types";
import type { RecapDecision } from "@/server/services/recap-service";

type Props = { decisions: RecapDecision[] };

export function DecisionsWithLineage({ decisions }: Props) {
  if (!decisions.length) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        No decisions on record for this topic.
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {decisions.map((row) => (
        <DecisionRow key={row.decision.id} row={row} />
      ))}
    </div>
  );
}

function DecisionRow({ row }: { row: RecapDecision }) {
  const { decision, owner, source, supersedes } = row;
  const override = useAppStore((s) => s.decisionOverrides[decision.id]);
  const editDecision = useAppStore((s) => s.editDecision);
  const dismissDecision = useAppStore((s) => s.dismissDecision);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(override?.text ?? decision.text);

  if (override?.status === "dismissed") return null;
  const currentText = override?.text ?? decision.text;
  const visibility: Visibility = override?.visibility ?? decision.visibility;

  return (
    <Card className="gap-3 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <Gavel className="mt-0.5 size-4 text-action" aria-hidden />
          <div className="min-w-0 flex-1">
            {editing ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              />
            ) : (
              <p className="text-sm font-medium">{currentText}</p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {decision.effectiveDate
                ? `Effective ${formatDate(decision.effectiveDate)}`
                : "Effective date TBD"}
              {owner && ` · ${owner.name}`}
            </p>
          </div>
        </div>
        <StatusPill tone="action">{decision.status}</StatusPill>
      </div>

      {supersedes && (
        <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs">
          <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
            <ArrowDown className="size-3" aria-hidden />
            Supersedes prior decision
          </div>
          <p className="line-through decoration-muted-foreground/40">
            {supersedes.decision.text}
          </p>
          {supersedes.source && (
            <div className="mt-1">
              <SourceCitation source={supersedes.source} />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {source && <SourceCitation source={source} />}
          <VisibilityMenu
            value={visibility}
            onChange={(v) => editDecision(decision.id, { visibility: v })}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {editing ? (
            <button
              onClick={() => {
                editDecision(decision.id, { text });
                setEditing(false);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-action px-2.5 py-1 text-xs font-medium text-action-foreground hover:opacity-90"
            >
              <Check className="size-3.5" aria-hidden /> Save
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
              >
                <Pencil className="size-3.5" aria-hidden /> Edit
              </button>
              <button
                onClick={() => dismissDecision(decision.id)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" aria-hidden /> Dismiss
              </button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
