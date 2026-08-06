import type { HTMLAttributes, ReactNode } from "react";
import {
  LuArrowDownRight,
  LuArrowRight,
  LuArrowUpRight,
} from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type TrendDirection = "up" | "down" | "neutral";

export interface TrendIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  direction?: TrendDirection;
  value?: ReactNode;
  label?: string;
  inverse?: boolean;
  showIcon?: boolean;
  design?: DesignPreset;
}

const trendIcons: Record<TrendDirection, ReactNode> = {
  up: <LuArrowUpRight aria-hidden="true" />,
  down: <LuArrowDownRight aria-hidden="true" />,
  neutral: <LuArrowRight aria-hidden="true" />,
};

export function TrendIndicator({
  direction = "neutral",
  value,
  label,
  inverse = false,
  showIcon = true,
  design,
  className,
  ...props
}: TrendIndicatorProps) {
  const isPositive =
    direction === "neutral" || (inverse ? direction === "down" : direction === "up");

  return (
    <span
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-1 text-xs font-bold",
        direction === "neutral" && "text-muted",
        direction !== "neutral" && isPositive && "text-success",
        direction !== "neutral" && !isPositive && "text-danger",
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    >
      {showIcon && trendIcons[direction]}
      {value}
      {label && <span className="font-medium text-muted">{label}</span>}
    </span>
  );
}
