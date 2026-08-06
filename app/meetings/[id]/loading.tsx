import { Skeleton, SkeletonCard } from "@/components/shared/skeleton";

export default function MeetingDetailLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6">
      <div className="min-w-0 flex-1 space-y-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
        <SkeletonCard height="h-40" />
        <SkeletonCard height="h-40" />
      </div>
      <div className="hidden xl:block xl:w-[360px] xl:flex-none">
        <SkeletonCard height="h-[480px]" />
      </div>
    </div>
  );
}
