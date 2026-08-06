import type { ReactNode } from "react";
import { LuLoaderCircle } from "react-icons/lu";

import { Spinner } from "./loaders";
import { FillingLoaderIcon } from "./page-loader-icon";
import type {
  PageLoaderSize,
  PageLoaderTone,
  PageLoaderVariant,
} from "./page-loader.types";
import { cn } from "@/lib/cn";

const toneBackgrounds: Record<PageLoaderTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  gradient: "bg-gradient-to-r from-primary via-secondary to-tertiary",
};

const toneText: Record<PageLoaderTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  gradient: "text-primary",
};

interface PageLoaderVisualProps {
  variant: PageLoaderVariant;
  tone: PageLoaderTone;
  size: PageLoaderSize;
  percent: number;
  indeterminate: boolean;
  icon?: ReactNode;
  className?: string;
}

function SegmentSteps({
  percent,
  tone,
}: Pick<PageLoaderVisualProps, "percent" | "tone">) {
  const activeSegments = Math.ceil(percent / 12.5);

  return (
    <div className="flex w-40 gap-1" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full bg-surface-hover transition-colors duration-300",
            index < activeSegments && toneBackgrounds[tone],
          )}
        />
      ))}
    </div>
  );
}

export function PageLoaderVisual({
  variant,
  tone,
  size,
  percent,
  indeterminate,
  icon = <LuLoaderCircle />,
  className,
}: PageLoaderVisualProps) {
  const fillingIcon = (
    <FillingLoaderIcon
      icon={icon}
      percent={percent}
      size={size}
      tone={tone}
      indeterminate={indeterminate}
    />
  );

  if (variant === "spinner") {
    return (
      <div className={className}>
        <Spinner
          size={size}
          className={cn(
            tone === "secondary" && "border-secondary/20 border-t-secondary",
            tone === "tertiary" && "border-tertiary/20 border-t-tertiary",
            tone === "gradient" && "border-secondary/20 border-t-primary",
          )}
        />
      </div>
    );
  }

  if (variant === "steps") {
    return (
      <div className={cn("grid justify-items-center gap-4", className)}>
        {fillingIcon}
        <SegmentSteps percent={percent} tone={tone} />
      </div>
    );
  }

  if (variant === "ring") {
    return (
      <div
        className={cn(
          "relative grid size-24 place-items-center rounded-full p-2",
          className,
        )}
        style={{
          background: `conic-gradient(var(--theme-${tone === "gradient" ? "primary" : tone}) ${percent * 3.6}deg, var(--theme-surface-hover) 0deg)`,
        }}
      >
        <span className="absolute inset-1.5 rounded-full bg-background" />
        <span className="relative">{fillingIcon}</span>
      </div>
    );
  }

  if (variant === "orbit") {
    return (
      <div className={cn("relative grid size-28 place-items-center", className)}>
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full border border-dashed border-border"
        >
          <span
            className={cn(
              "absolute left-1/2 top-[-0.25rem] size-2 -translate-x-1/2 rounded-full",
              toneBackgrounds[tone],
            )}
          />
          <span className="absolute bottom-1 left-2 size-1.5 rounded-full bg-secondary" />
          <span className="absolute right-1 top-7 size-1.5 rounded-full bg-tertiary" />
        </span>
        {fillingIcon}
      </div>
    );
  }

  if (variant === "scanner") {
    return (
      <div className={cn("relative overflow-hidden px-5 py-3", className)}>
        {fillingIcon}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 h-px shadow-[0_0_12px_currentColor] transition-[top] duration-500",
            toneText[tone],
          )}
          style={{ top: `${percent}%` }}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("relative grid size-28 place-items-center", className)}>
        <span
          aria-hidden="true"
          className={cn(
            "absolute size-20 animate-ping rounded-full opacity-10",
            toneBackgrounds[tone],
          )}
        />
        <span
          aria-hidden="true"
          className="absolute size-24 animate-pulse rounded-full border border-border"
        />
        {fillingIcon}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        {fillingIcon}
        <span className="grid gap-1" aria-hidden="true">
          <span className="h-1 w-24 overflow-hidden rounded-full bg-surface-hover">
            <span
              className={cn(
                "block h-full transition-[width] duration-500",
                toneBackgrounds[tone],
              )}
              style={{ width: `${percent}%` }}
            />
          </span>
          <span className="h-px w-16 bg-border" />
        </span>
      </div>
    );
  }

  return <div className={className}>{fillingIcon}</div>;
}
