import Link from "next/link";
import { Compass } from "lucide-react";
import { PageContainer } from "@/components/shared/section";
import { Card } from "@/components/ui/card";

export default function RootNotFound() {
  return (
    <PageContainer>
      <Card className="gap-3 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Compass className="size-4" aria-hidden />
          We couldn&apos;t find that page.
        </div>
        <p className="text-sm text-muted-foreground">
          The URL doesn&apos;t match any meeting or route in this prototype.
          Head home to pick a starting point.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-action px-3 py-1.5 text-sm font-medium text-action-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Home
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Join Meeting
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
