import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import {
  mediaDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import {
  normalizeProgress,
  type ProgressTone,
} from "./progress-utils";

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  thickness?: number;
  tone?: ProgressTone;
  label?: ReactNode;
  showValue?: boolean;
  trackColor?: string;
  indicatorColor?: string;
  centerClassName?: string;
  design?: DesignPreset;
}

const ringColors: Record<
  Exclude<ProgressTone, "customized" | "gradient">,
  string
> = {
  primary: "var(--theme-primary)",
  secondary: "var(--theme-secondary)",
  tertiary: "var(--theme-tertiary)",
  success: "var(--theme-success)",
  warning: "var(--theme-warning)",
  danger: "var(--theme-danger)",
};

export function ProgressRing({
  value,
  size = 72,
  thickness = 7,
  tone = "primary",
  label,
  showValue = true,
  trackColor = "var(--theme-surface-hover)",
  indicatorColor,
  centerClassName,
  design,
  className,
  style,
  ...props
}: ProgressRingProps) {
  const percent = normalizeProgress(value);
  const resolvedColor =
    indicatorColor ??
    (tone === "customized"
      ? "currentColor"
      : tone === "gradient"
        ? "var(--theme-secondary)"
        : ringColors[tone]);
  const ringStyle = {
    "--ring-color": resolvedColor,
    "--ring-track": trackColor,
    "--ring-progress": `${percent * 3.6}deg`,
    width: size,
    maxWidth: "100%",
    aspectRatio: "1 / 1",
    background:
      "conic-gradient(var(--ring-color) var(--ring-progress), var(--ring-track) 0deg)",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative grid max-w-full shrink-0 place-items-center rounded-full",
        design && mediaDesignStyles[design],
        className,
      )}
      style={ringStyle}
      role="progressbar"
      aria-label={typeof label === "string" ? label : "Progreso"}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <span
        className="absolute rounded-full bg-surface"
        style={{ inset: thickness }}
        aria-hidden="true"
      />
      <span className={cn("relative text-center", centerClassName)}>
        {showValue && (
          <strong className="block text-sm font-black text-foreground">
            {percent}%
          </strong>
        )}
        {label && (
          <span className="block max-w-14 truncate text-[9px] font-bold text-muted">
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
