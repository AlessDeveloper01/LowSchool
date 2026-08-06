import type { HTMLAttributes, ReactNode } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type MetricVariant =
  | "default"
  | "bordered"
  | "soft"
  | "accent"
  | "gradient"
  | "customized";
export type MetricSize = "sm" | "md" | "lg";

export interface MetricProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  supportingText?: ReactNode;
  icon?: ReactNode;
  trend?: ReactNode;
  footer?: ReactNode;
  variant?: MetricVariant;
  size?: MetricSize;
  labelClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  design?: DesignPreset;
}

const metricVariants: Record<MetricVariant, string> = {
  default: "bg-surface",
  bordered: "border border-border bg-surface",
  soft: "bg-surface-hover/70",
  accent:
    "border border-primary/20 bg-primary/8 before:absolute before:inset-y-4 before:left-0 before:w-1 before:rounded-r-full before:bg-primary",
  gradient:
    "border border-primary/15 bg-gradient-to-br from-primary/12 via-surface to-tertiary/10",
  customized: "",
};

const metricSizes: Record<MetricSize, string> = {
  sm: "gap-3 p-3",
  md: "gap-4 p-4",
  lg: "gap-5 p-5",
};

const metricValueSizes: Record<MetricSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export function Metric({
  label,
  value,
  supportingText,
  icon,
  trend,
  footer,
  variant = "bordered",
  size = "md",
  labelClassName,
  valueClassName,
  iconClassName,
  contentClassName,
  footerClassName,
  design,
  className,
  ...props
}: MetricProps) {
  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-2xl",
        metricVariants[variant],
        metricSizes[size],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
        <div className={cn("min-w-0 flex-1", contentClassName)}>
          <p
            className={cn(
              "break-words text-xs font-bold tracking-wide text-muted",
              labelClassName,
            )}
          >
            {label}
          </p>
          <div className="mt-2 flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
            <p
              className={cn(
                "min-w-0 break-words font-black tracking-tight text-foreground",
                metricValueSizes[size],
                valueClassName,
              )}
            >
              {value}
            </p>
            {trend}
          </div>
          {supportingText && (
            <div className="mt-1.5 text-xs leading-5 text-muted">
              {supportingText}
            </div>
          )}
        </div>
        {icon && (
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-lg text-primary",
              iconClassName,
            )}
          >
            {icon}
          </span>
        )}
      </div>
      {footer && (
        <div
          className={cn(
            "mt-4 border-t border-border/70 pt-3 text-xs text-muted",
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export interface MetricGroupProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  divided?: boolean;
  design?: DesignPreset;
}

const metricColumns: Record<
  NonNullable<MetricGroupProps["columns"]>,
  string
> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

export function MetricGroup({
  columns = 3,
  divided = false,
  design,
  className,
  ...props
}: MetricGroupProps) {
  return (
    <div
      className={cn(
        "grid min-w-0 [&>*]:min-w-0",
        metricColumns[columns],
        divided
          ? "overflow-hidden rounded-2xl border border-border bg-surface [&>*]:rounded-none [&>*]:border-0 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border sm:[&>*:not(:last-child)]:border-r"
          : "gap-4",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}
