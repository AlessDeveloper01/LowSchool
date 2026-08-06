import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import {
  mediaDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import { normalizeChartValue } from "./micro-chart-utils";

export type GaugeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "gradient"
  | "customized";

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max?: number;
  label?: ReactNode;
  valueLabel?: ReactNode;
  variant?: GaugeVariant;
  size?: number;
  thickness?: number;
  trackColor?: string;
  indicatorColor?: string;
  valueClassName?: string;
  labelClassName?: string;
  centerClassName?: string;
  design?: DesignPreset;
}

const gaugeColors: Record<Exclude<GaugeVariant, "customized">, string> = {
  primary: "var(--theme-primary)",
  success: "var(--theme-success)",
  warning: "var(--theme-warning)",
  danger: "var(--theme-danger)",
  gradient: "var(--theme-secondary)",
};

export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  valueLabel,
  variant = "primary",
  size = 112,
  thickness = 10,
  trackColor = "var(--theme-surface-hover)",
  indicatorColor,
  valueClassName,
  labelClassName,
  centerClassName,
  design,
  className,
  style,
  ...props
}: GaugeProps) {
  const percent = normalizeChartValue(value, min, max);
  const color =
    indicatorColor ??
    (variant === "customized" ? "currentColor" : gaugeColors[variant]);
  const gaugeStyle = {
    "--gauge-color": color,
    "--gauge-track": trackColor,
    "--gauge-percent": `${percent * 3.6}deg`,
    "--gauge-thickness": `${thickness}px`,
    width: size,
    maxWidth: "100%",
    aspectRatio: "1 / 1",
    background:
      "conic-gradient(var(--gauge-color) var(--gauge-percent), var(--gauge-track) 0deg)",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative grid max-w-full shrink-0 place-items-center rounded-full",
        design && mediaDesignStyles[design],
        className,
      )}
      style={gaugeStyle}
      role="meter"
      aria-label={typeof label === "string" ? label : "Indicador circular"}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      {...props}
    >
      <span
        className="absolute rounded-full bg-surface"
        style={{ inset: thickness }}
        aria-hidden="true"
      />
      <span className={cn("relative text-center", centerClassName)}>
        <strong
          className={cn(
            "block text-lg font-black tracking-tight text-foreground",
            valueClassName,
          )}
        >
          {valueLabel ?? `${Math.round(percent)}%`}
        </strong>
        {label && (
          <span
            className={cn(
              "mt-0.5 block max-w-20 truncate text-[10px] font-bold text-muted",
              labelClassName,
            )}
          >
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
