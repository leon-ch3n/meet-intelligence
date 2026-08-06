import { actionItems } from "@/data";
import type { ActionItem, ActionItemStatus } from "@/types";

export function getActionById(id: string): ActionItem | undefined {
  return actionItems.find((a) => a.id === id);
}

export function listActions(): readonly ActionItem[] {
  return actionItems;
}

export function listActionsForOwner(ownerId: string): readonly ActionItem[] {
  return actionItems.filter((a) => a.ownerId === ownerId);
}

export function listActionsForThread(
  threadId: string,
): readonly ActionItem[] {
  return actionItems.filter((a) => a.threadId === threadId);
}

export function listByActionStatus(
  status: ActionItemStatus,
): readonly ActionItem[] {
  return actionItems.filter((a) => a.status === status);
}

export function listOpenCommitmentsForOwner(
  ownerId: string,
): readonly ActionItem[] {
  return actionItems
    .filter(
      (a) =>
        a.ownerId === ownerId &&
        (a.status === "open" || a.status === "overdue"),
    )
    .slice()
    .sort((a, b) => {
      // Overdue first, then by due date ascending.
      if (a.status !== b.status) {
        return a.status === "overdue" ? -1 : 1;
      }
      return (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
    });
}
