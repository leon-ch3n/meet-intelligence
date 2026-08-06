"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { PageContainer } from "@/components/shared/section";
import { Card } from "@/components/ui/card";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[command-center] route error:", error);
    }
  }, [error]);

  return (
    <PageContainer>
      <Card
        role="alert"
        aria-live="assertive"
        className="gap-3 border-risk/30 bg-risk-subtle/40 p-6"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-risk">
          <AlertTriangle className="size-4" aria-hidden />
          Something went wrong rendering this view.
        </div>
        <p className="text-sm text-muted-foreground">
          The prototype ships with a deterministic seed dataset. If you hit
          this, either the demo state was reset mid-navigation or a code path
          threw. Try again, or use the Demo → Reset control in the header.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Reference · <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <div>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-md bg-action px-3 py-1.5 text-sm font-medium text-action-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </button>
        </div>
      </Card>
    </PageContainer>
  );
}
