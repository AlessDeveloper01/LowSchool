import type { HTMLAttributes } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type SparkBarsVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "gradient"
  | "customized";

export interface SparkBarsProps extends HTMLAttributes<HTMLDivElement> {
  values: readonly number[];
  variant?: SparkBarsVariant;
  height?: number;
  gap?: "tight" | "normal" | "relaxed";
  highlightLast?: boolean;
  barClassName?: string;
  activeBarClassName?: string;
  label?: string;
  design?: DesignPreset;
}

const sparkColors: Record<SparkBarsVariant, string> = {
  primary: "bg-primary/65",
  secondary: "bg-secondary/65",
  tertiary: "bg-tertiary/65",
  success: "bg-success/65",
  gradient: "bg-gradient-to-t from-primary via-secondary to-tertiary",
  customized: "",
};

const sparkGaps = {
  tight: "gap-0.5",
  normal: "gap-1",
  relaxed: "gap-1.5",
} satisfies Record<NonNullable<SparkBarsProps["gap"]>, string>;

export function SparkBars({
  values,
  variant = "primary",
  height = 48,
  gap = "normal",
  highlightLast = true,
  barClassName,
  activeBarClassName,
  label = "Tendencia",
  design,
  className,
  ...props
}: SparkBarsProps) {
  const maximum = Math.max(1, ...values.map((value) => Math.abs(value)));

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-end overflow-hidden",
        sparkGaps[gap],
        design && controlDesignStyles[design],
        className,
      )}
      style={{ height }}
      role="img"
      aria-label={`${label}: ${values.join(", ")}`}
      {...props}
    >
      {values.map((value, index) => {
        const barHeight = Math.max(8, (Math.abs(value) / maximum) * 100);
        const isLast = index === values.length - 1;

        return (
          <span
            key={`${index}-${value}`}
            className={cn(
              "min-w-1 flex-1 rounded-t-sm",
              sparkColors[variant],
              barClassName,
              highlightLast && isLast && "opacity-100",
              highlightLast && !isLast && "opacity-55",
              isLast && activeBarClassName,
            )}
            style={{ height: `${barHeight}%` }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
