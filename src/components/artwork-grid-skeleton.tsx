import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl border border-border/50">
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 px-4 pb-4 pt-16">
            <Skeleton className="h-5 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-1/2 bg-white/10" />
            <Skeleton className="h-3 w-16 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
