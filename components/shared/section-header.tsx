import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  count?: number;
};

export function SectionHeader({ title, description, action, count }: Props) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          {title}
          {typeof count === "number" && count > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {count}
            </span>
          )}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
