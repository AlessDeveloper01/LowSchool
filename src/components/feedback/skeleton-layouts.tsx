import {
  AvatarSkeleton,
  Skeleton,
  TextSkeleton,
} from "./skeleton";
import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface SkeletonLayoutProps {
  design?: DesignPreset;
  className?: string;
}

export function CardSkeleton({ design, className }: SkeletonLayoutProps = {}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5", design && surfaceDesignStyles[design], className)}>
      <Skeleton variant="text" design={design} className="w-1/3" />
      <Skeleton design={design} className="mt-4 h-8 w-2/3" />
      <TextSkeleton design={design} className="mt-4" />
    </div>
  );
}

export function ProfileSkeleton({ design, className }: SkeletonLayoutProps = {}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border border-border bg-surface p-4", design && surfaceDesignStyles[design], className)}>
      <AvatarSkeleton size="lg" design={design} />
      <div className="min-w-0 flex-1">
        <Skeleton variant="text" design={design} className="w-2/5" />
        <Skeleton variant="text" design={design} className="mt-2 w-3/5 opacity-70" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 4, design, className }: SkeletonLayoutProps & { items?: number }) {
  return (
    <div className={cn("divide-y divide-border rounded-2xl border border-border bg-surface px-4", design && surfaceDesignStyles[design], className)}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex items-center gap-3 py-3">
          <AvatarSkeleton design={design} />
          <div className="flex-1">
            <Skeleton variant="text" design={design} className="w-2/5" />
            <Skeleton variant="text" design={design} className="mt-2 w-3/4 opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 3, design, className }: SkeletonLayoutProps & { fields?: number }) {
  return (
    <div className={cn("space-y-4 rounded-2xl border border-border bg-surface p-5", design && surfaceDesignStyles[design], className)}>
      {Array.from({ length: fields }, (_, index) => (
        <div key={index}>
          <Skeleton variant="text" design={design} className="mb-2 w-1/4" />
          <Skeleton design={design} className="h-11 w-full" />
        </div>
      ))}
      <Skeleton design={design} className="h-10 w-32" />
    </div>
  );
}

export function ChartSkeleton({ design, className }: SkeletonLayoutProps = {}) {
  const barHeights = ["35%", "62%", "46%", "82%", "58%", "74%", "51%"];

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5", design && surfaceDesignStyles[design], className)}>
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-1/2">
          <Skeleton variant="text" design={design} className="w-1/2" />
          <Skeleton design={design} className="mt-2 h-7 w-3/4" />
        </div>
        <Skeleton design={design} className="h-9 w-24 max-w-full" />
      </div>
      <div className="flex h-36 items-end gap-2">
        {barHeights.map((barHeight) => (
          <Skeleton
            key={barHeight}
            design={design}
            className="flex-1 rounded-t-lg rounded-b-sm"
            height={barHeight}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, design, className }: SkeletonLayoutProps & { rows?: number }) {
  return (
    <div className={cn("space-y-2", design && surfaceDesignStyles[design], className)}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} design={design} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function DashboardSkeleton({ design, className }: SkeletonLayoutProps = {}) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-3", design && surfaceDesignStyles[design], className)}>
      <CardSkeleton design={design} />
      <CardSkeleton design={design} />
      <CardSkeleton design={design} />
      <div className="lg:col-span-2">
        <ChartSkeleton design={design} />
      </div>
      <ListSkeleton items={3} design={design} />
    </div>
  );
}
