import type { ReactNode } from "react";

import type {
  PageLoaderSize,
  PageLoaderTone,
} from "./page-loader.types";
import { cn } from "@/lib/cn";

const iconSizes: Record<PageLoaderSize, string> = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
};

const toneStyles: Record<PageLoaderTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  gradient: "text-primary",
};

interface FillingLoaderIconProps {
  icon: ReactNode;
  percent: number;
  size: PageLoaderSize;
  tone: PageLoaderTone;
  indeterminate: boolean;
  className?: string;
}

export function FillingLoaderIcon({
  icon,
  percent,
  size,
  tone,
  indeterminate,
  className,
}: FillingLoaderIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        iconSizes[size],
        "[&>span>svg]:size-full",
        className,
      )}
    >
      <span className="absolute inset-0 text-muted/20">{icon}</span>
      <span
        className={cn(
          "absolute inset-0 overflow-hidden transition-[clip-path] duration-500 ease-out",
          toneStyles[tone],
          indeterminate && "animate-pulse",
        )}
        style={{ clipPath: `inset(${100 - percent}% 0 0 0)` }}
      >
        {icon}
      </span>
    </span>
  );
}
