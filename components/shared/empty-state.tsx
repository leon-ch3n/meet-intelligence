import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-background/40 px-4 py-6 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
