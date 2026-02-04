import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl overflow-hidden border border-border/50',
        className
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-square p-4 bg-muted/30">
        <div className="w-full h-full rounded-xl bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] animate-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 pt-2 space-y-2">
        <div className="h-4 bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] animate-shimmer rounded-lg w-3/4" />
        <div className="h-3 bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] animate-shimmer rounded-lg w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
