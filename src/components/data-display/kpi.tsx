import type { HTMLAttributes, ReactNode } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface KpiProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  target?: ReactNode;
  progress?: number;
  status?: "on-track" | "at-risk" | "off-track";
  valueClassName?: string;
  progressClassName?: string;
  design?: DesignPreset;
}

const kpiStatuses = {
  "on-track": {
    label: "En objetivo",
    dot: "bg-success",
    text: "text-success",
  },
  "at-risk": {
    label: "En riesgo",
    dot: "bg-warning",
    text: "text-warning",
  },
  "off-track": {
    label: "Fuera de objetivo",
    dot: "bg-danger",
    text: "text-danger",
  },
} satisfies Record<
  NonNullable<KpiProps["status"]>,
  { label: string; dot: string; text: string }
>;

function normalizePercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function Kpi({
  label,
  value,
  target,
  progress,
  status = "on-track",
  valueClassName,
  progressClassName,
  design,
  className,
  ...props
}: KpiProps) {
  const normalizedProgress =
    progress === undefined ? undefined : normalizePercent(progress);
  const statusConfig = kpiStatuses[status];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-4",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col items-start gap-3 min-[400px]:flex-row min-[400px]:justify-between min-[400px]:gap-4">
        <div className="min-w-0">
          <p className="break-words text-xs font-bold text-muted">{label}</p>
          <p
            className={cn(
              "mt-1 break-words text-2xl font-black tracking-tight text-foreground",
              valueClassName,
            )}
          >
            {value}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold",
            statusConfig.text,
          )}
        >
          <span
            className={cn("size-1.5 rounded-full", statusConfig.dot)}
            aria-hidden="true"
          />
          {statusConfig.label}
        </span>
      </div>
      {normalizedProgress !== undefined && (
        <div className="mt-4">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-surface-hover"
            role="progressbar"
            aria-label={typeof label === "string" ? label : "Progreso del KPI"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={normalizedProgress}
          >
            <span
              className={cn(
                "block h-full rounded-full bg-primary transition-[width] duration-300",
                progressClassName,
              )}
              style={{ width: `${normalizedProgress}%` }}
            />
          </div>
          <div className="mt-2 flex flex-col items-start gap-1 text-[11px] font-semibold text-muted min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between min-[400px]:gap-3">
            <span>{normalizedProgress}% completado</span>
            {target && <span>Meta: {target}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
