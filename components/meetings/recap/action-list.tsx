"use client";

import { useState } from "react";
import { Check, CheckSquare, CircleDot, Pencil, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/shared/status-pill";
import { SourceCitation } from "@/components/shared/source-citation";
import { VisibilityMenu } from "@/components/shared/visibility-menu";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/lib/dates";
import type { Visibility } from "@/types";
import type { RecapAction } from "@/server/services/recap-service";

type Props = { actions: RecapAction[] };

export function ActionList({ actions }: Props) {
  if (!actions.length) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        No open actions on this topic.
      </Card>
    );
  }
  return (
    <ul className="space-y-2">
      {actions.map((row) => (
        <li key={row.action.id}>
          <ActionRow row={row} />
        </li>
      ))}
    </ul>
  );
}

function ActionRow({ row }: { row: RecapAction }) {
  const { action, owner, source } = row;
  const override = useAppStore((s) => s.actionOverrides[action.id]);
  const editAction = useAppStore((s) => s.editAction);
  const dismissAction = useAppStore((s) => s.dismissAction);
  const completeAction = useAppStore((s) => s.completeAction);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(override?.text ?? action.text);
  const [dueDate, setDueDate] = useState<string>(
    override?.dueDate ?? action.dueDate ?? "",
  );

  if (override?.status === "dismissed") return null;

  const status = override?.status ?? action.status;
  const currentText = override?.text ?? action.text;
  const currentDueDate = override?.dueDate ?? action.dueDate;
  const visibility: Visibility = override?.visibility ?? action.visibility;
  const isComplete = status === "completed";

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {isComplete ? (
          <CheckSquare className="mt-1 size-4 text-success" aria-hidden />
        ) : (
          <CircleDot className="mt-1 size-4 text-action" aria-hidden />
        )}
        <div className="flex-1 space-y-1">
          {editing ? (
            <input
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <p className={`text-sm ${isComplete ? "text-muted-foreground line-through" : ""}`}>
              {currentText}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{owner?.name ?? "Unassigned"}</span>
            {editing ? (
              <label className="inline-flex items-center gap-1.5">
                Due
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-md border border-border bg-background px-1.5 py-0.5 text-xs"
                />
              </label>
            ) : (
              currentDueDate && <span>Due {formatDate(currentDueDate)}</span>
            )}
            {source && <SourceCitation source={source} />}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!isComplete && (
            <VisibilityMenu
              value={visibility}
              onChange={(v) => editAction(action.id, { visibility: v })}
            />
          )}
          <StatusPill
            tone={
              status === "completed"
                ? "success"
                : status === "detected"
                  ? "insight"
                  : "action"
            }
          >
            {status}
          </StatusPill>
        </div>
      </div>

      {!isComplete && (
        <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5">
          {editing ? (
            <button
              onClick={() => {
                editAction(action.id, {
                  text,
                  dueDate: dueDate || undefined,
                });
                setEditing(false);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-action px-2.5 py-1 text-xs font-medium text-action-foreground hover:opacity-90"
            >
              <Check className="size-3.5" aria-hidden /> Save
            </button>
          ) : (
            <>
              <button
                onClick={() => completeAction(action.id)}
                className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success-subtle px-2.5 py-1 text-xs font-medium text-success hover:opacity-90"
              >
                <Check className="size-3.5" aria-hidden /> Mark complete
              </button>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
              >
                <Pencil className="size-3.5" aria-hidden /> Edit
              </button>
              <button
                onClick={() => dismissAction(action.id)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" aria-hidden /> Dismiss
              </button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
