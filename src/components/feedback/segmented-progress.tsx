import type { HTMLAttributes, ReactNode } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import {
  normalizeProgress,
  progressToneStyles,
  type ProgressTone,
} from "./progress-utils";

export interface SegmentedProgressProps
  extends HTMLAttributes<HTMLDivElement> {
  value: number;
  segments?: number;
  tone?: ProgressTone;
  size?: "sm" | "md" | "lg";
  label?: ReactNode;
  showValue?: boolean;
  trackClassName?: string;
  segmentClassName?: string;
  activeSegmentClassName?: string;
  design?: DesignPreset;
}

const progressSizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
} satisfies Record<NonNullable<SegmentedProgressProps["size"]>, string>;

export function SegmentedProgress({
  value,
  segments = 5,
  tone = "primary",
  size = "md",
  label,
  showValue = false,
  trackClassName,
  segmentClassName,
  activeSegmentClassName,
  design,
  className,
  ...props
}: SegmentedProgressProps) {
  const percent = normalizeProgress(value);
  const safeSegments = Math.max(1, Math.round(segments));
  const filledSegments = Math.ceil((percent / 100) * safeSegments);

  return (
    <div className={cn("min-w-0 w-full", design && controlDesignStyles[design], className)} {...props}>
      {(label || showValue) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
          <span className="min-w-0 break-words font-bold text-foreground">{label}</span>
          {showValue && (
            <span className="shrink-0 font-extrabold text-muted">{percent}%</span>
          )}
        </div>
      )}
      <div
        className={cn("flex gap-1", trackClassName)}
        role="progressbar"
        aria-label={typeof label === "string" ? label : "Progreso"}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: safeSegments }, (_, index) => (
          <span
            key={index}
            className={cn(
              "flex-1 rounded-full bg-surface-hover",
              progressSizes[size],
              segmentClassName,
              index < filledSegments && progressToneStyles[tone],
              index < filledSegments && activeSegmentClassName,
            )}
          />
        ))}
      </div>
    </div>
  );
}
