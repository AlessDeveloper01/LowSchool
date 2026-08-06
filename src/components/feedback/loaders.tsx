import type { HTMLAttributes } from "react";

import {
  controlDesignStyles,
  mediaDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type LoaderSize = "sm" | "md" | "lg";

const spinnerSizes: Record<LoaderSize, string> = {
  sm: "size-4 border-2",
  md: "size-7 border-[3px]",
  lg: "size-11 border-4",
};

export function Spinner({
  size = "md",
  design,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { size?: LoaderSize; design?: DesignPreset }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        "inline-block animate-spin rounded-full border-primary/20 border-t-primary",
        spinnerSizes[size],
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export function LoadingDots({ design, className }: { design?: DesignPreset; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn("inline-flex gap-1", design && controlDesignStyles[design], className)}
    >
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="size-1.5 animate-bounce rounded-full bg-current"
          style={{ animationDelay: `${item * 120}ms` }}
        />
      ))}
    </span>
  );
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  showValue?: boolean;
  design?: DesignPreset;
}

function normalizeProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function ProgressBar({
  value,
  showValue,
  design,
  className,
  ...props
}: ProgressProps) {
  const percent = normalizeProgress(value);

  return (
    <div className={cn(design && controlDesignStyles[design], className)} {...props}>
      <div
        className="h-2 overflow-hidden rounded-full bg-surface-hover"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue && (
        <p className="mt-1 text-right text-xs font-bold text-muted">
          {percent}%
        </p>
      )}
    </div>
  );
}

export function CircularProgress({
  value,
  showValue = true,
  design,
  className,
  ...props
}: ProgressProps) {
  const percent = normalizeProgress(value);

  return (
    <div
      className={cn(
        "relative grid size-20 place-items-center rounded-full",
        design && mediaDesignStyles[design],
        className,
      )}
      style={{
        background: `conic-gradient(var(--theme-primary) ${percent * 3.6}deg, var(--theme-surface-hover) 0deg)`,
      }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <span className="absolute inset-2 rounded-full bg-surface" />
      {showValue && (
        <span className="relative text-xs font-extrabold">{percent}%</span>
      )}
    </div>
  );
}

export * from "./skeleton";
export * from "./skeleton-layouts";
