import type { HTMLAttributes, ReactNode } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import { normalizeChartValue } from "./micro-chart-utils";

export type MeterVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "gradient"
  | "customized";
export type MeterSize = "sm" | "md" | "lg";

export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max?: number;
  label?: ReactNode;
  valueLabel?: ReactNode;
  variant?: MeterVariant;
  size?: MeterSize;
  marker?: number;
  trackClassName?: string;
  indicatorClassName?: string;
  markerClassName?: string;
  design?: DesignPreset;
}

const meterColors: Record<MeterVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  gradient: "bg-gradient-to-r from-primary via-secondary to-tertiary",
  customized: "",
};

const meterSizes: Record<MeterSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  valueLabel,
  variant = "primary",
  size = "md",
  marker,
  trackClassName,
  indicatorClassName,
  markerClassName,
  design,
  className,
  ...props
}: MeterProps) {
  const percent = normalizeChartValue(value, min, max);
  const markerPercent =
    marker === undefined ? undefined : normalizeChartValue(marker, min, max);

  return (
    <div className={cn("min-w-0 w-full", design && controlDesignStyles[design], className)} {...props}>
      {(label || valueLabel) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
          <span className="min-w-0 break-words font-bold text-foreground">{label}</span>
          <span className="shrink-0 font-extrabold text-muted">
            {valueLabel ?? `${Math.round(percent)}%`}
          </span>
        </div>
      )}
      <div
        className={cn(
          "relative overflow-visible rounded-full bg-surface-hover",
          meterSizes[size],
          trackClassName,
        )}
        role="meter"
        aria-label={typeof label === "string" ? label : "Medidor"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <span
          className={cn(
            "block h-full rounded-full transition-[width] duration-300",
            meterColors[variant],
            indicatorClassName,
          )}
          style={{ width: `${percent}%` }}
        />
        {markerPercent !== undefined && (
          <span
            className={cn(
              "absolute top-1/2 h-[calc(100%+8px)] w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground",
              markerClassName,
            )}
            style={{ left: `${markerPercent}%` }}
            title={`Objetivo: ${marker}`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
