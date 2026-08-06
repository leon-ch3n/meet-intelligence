import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Vertical rhythm wrapper — consistent 24px stack across all dashboard/meeting
 * sections. Keep sections narrow (max-w-6xl on screens that use this).
 */
export function Section({ children, className }: Props) {
  return <section className={cn("space-y-3", className)}>{children}</section>;
}

export function PageContainer({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl space-y-8 px-6 py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
