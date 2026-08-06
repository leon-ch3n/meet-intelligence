import { cn } from "@/lib/utils";

export type StatusTone =
  | "action"
  | "success"
  | "attention"
  | "risk"
  | "insight"
  | "neutral";

type Props = {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  action: "bg-action-subtle text-action ring-action/20",
  success: "bg-success-subtle text-success ring-success/20",
  attention: "bg-attention-subtle text-attention-foreground ring-attention/40",
  risk: "bg-risk-subtle text-risk ring-risk/20",
  insight: "bg-insight-subtle text-insight ring-insight/20",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function StatusPill({ tone, children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
