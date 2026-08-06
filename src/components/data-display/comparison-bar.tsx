import type { HTMLAttributes } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface ComparisonBarProps extends HTMLAttributes<HTMLDivElement> {
  firstValue: number;
  secondValue: number;
  firstLabel: string;
  secondLabel: string;
  firstClassName?: string;
  secondClassName?: string;
  trackClassName?: string;
  showLegend?: boolean;
  design?: DesignPreset;
}

export function ComparisonBar({
  firstValue,
  secondValue,
  firstLabel,
  secondLabel,
  firstClassName,
  secondClassName,
  trackClassName,
  showLegend = true,
  design,
  className,
  ...props
}: ComparisonBarProps) {
  const total = Math.max(0, firstValue) + Math.max(0, secondValue);
  const firstPercent = total === 0 ? 50 : (Math.max(0, firstValue) / total) * 100;
  const secondPercent = 100 - firstPercent;

  return (
    <div className={cn("min-w-0 w-full", design && controlDesignStyles[design], className)} {...props}>
      <div
        className={cn(
          "flex h-2.5 overflow-hidden rounded-full bg-surface-hover",
          trackClassName,
        )}
        role="img"
        aria-label={`${firstLabel}: ${firstValue}; ${secondLabel}: ${secondValue}`}
      >
        <span
          className={cn(
            "h-full bg-primary transition-[width] duration-300",
            firstClassName,
          )}
          style={{ width: `${firstPercent}%` }}
        />
        <span
          className={cn(
            "h-full bg-tertiary transition-[width] duration-300",
            secondClassName,
          )}
          style={{ width: `${secondPercent}%` }}
        />
      </div>
      {showLegend && (
        <div className="mt-2 flex flex-col items-start gap-2 text-[11px] font-bold text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="flex min-w-0 items-center gap-1.5 break-words">
            <span
              className={cn("size-2 rounded-full bg-primary", firstClassName)}
              aria-hidden="true"
            />
            {firstLabel} · {firstValue}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 break-words">
            <span
              className={cn("size-2 rounded-full bg-tertiary", secondClassName)}
              aria-hidden="true"
            />
            {secondLabel} · {secondValue}
          </span>
        </div>
      )}
    </div>
  );
}
