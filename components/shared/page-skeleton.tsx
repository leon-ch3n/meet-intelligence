import { PageContainer } from "@/components/shared/section";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/shared/skeleton";

/**
 * Generic full-page skeleton shaped like our standard PageContainer layout:
 * header block → primary card → two column split. Route-level loading.tsx
 * files use this so nav never renders an empty main area.
 */
export function PageSkeleton({
  columns = 2,
  primaryHeight = "h-32",
}: {
  columns?: 1 | 2;
  primaryHeight?: string;
}) {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-72" />
        <SkeletonText lines={2} className="max-w-xl" />
      </div>

      <SkeletonCard height={primaryHeight} />

      {columns === 2 ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <SkeletonCard />
      )}

      <SkeletonCard height="h-24" />
    </PageContainer>
  );
}
