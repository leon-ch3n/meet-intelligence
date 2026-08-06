import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  message?: string;
  className?: string;
};

export function RestrictedSourceRow({ title, message, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5",
        className,
      )}
    >
      <Lock className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {message ??
            "Restricted — you don't have permission to view this source."}
        </p>
      </div>
      <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Restricted
      </span>
    </div>
  );
}
