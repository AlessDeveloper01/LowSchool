import { LuSparkles } from "react-icons/lu";

import { PageLoaderVisual } from "./page-loader-visual";
import {
  normalizePageLoaderProgress,
  type PageLoaderLayout,
  type PageLoaderProps,
  type PageLoaderTone,
} from "./page-loader.types";
import { surfaceDesignStyles } from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

const layoutStyles: Record<PageLoaderLayout, string> = {
  compact: "min-h-56",
  section: "min-h-[50dvh]",
  screen: "min-h-dvh",
};

const progressStyles: Record<PageLoaderTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  gradient: "bg-gradient-to-r from-primary via-secondary to-tertiary",
};

export function PageLoader({
  label = "Cargando...",
  description,
  value,
  icon = <LuSparkles />,
  variant = "spinner",
  tone = "primary",
  size = "lg",
  layout = "section",
  showValue = true,
  surface = "plain",
  design = "minimal",
  action,
  visualClassName,
  progressClassName,
  className,
  ...props
}: PageLoaderProps) {
  const indeterminate = value === undefined;
  const percent = indeterminate ? 46 : normalizePageLoaderProgress(value);
  const accessibilityProps = indeterminate
    ? { role: "status" as const, "aria-live": "polite" as const }
    : {
        role: "progressbar" as const,
        "aria-valuenow": percent,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
      };

  return (
    <div
      className={cn(
        "grid max-w-full place-items-center p-5",
        layoutStyles[layout],
        surface === "contained" && surfaceDesignStyles[design],
        surface === "plain" &&
          "rounded-none border-0 bg-transparent shadow-none backdrop-blur-none",
        className,
      )}
      {...accessibilityProps}
      {...props}
    >
      <div className="grid w-full max-w-sm justify-items-center gap-4 text-center">
        <PageLoaderVisual
          variant={variant}
          tone={tone}
          size={size}
          percent={percent}
          indeterminate={indeterminate}
          icon={icon}
          className={visualClassName}
        />

        <div className="space-y-1">
          <p className="text-sm font-extrabold tracking-tight text-foreground">
            {label}
          </p>
          {description && (
            <p className="text-xs leading-5 text-muted">{description}</p>
          )}
        </div>

        {!indeterminate && (
          <div className="grid w-full gap-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500 ease-out",
                  progressStyles[tone],
                  progressClassName,
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
            {showValue && (
              <span className="text-right text-[11px] font-extrabold tabular-nums text-muted">
                {percent}%
              </span>
            )}
          </div>
        )}

        {action}
      </div>
    </div>
  );
}

export type {
  PageLoaderLayout,
  PageLoaderProps,
  PageLoaderSize,
  PageLoaderTone,
  PageLoaderVariant,
} from "./page-loader.types";
