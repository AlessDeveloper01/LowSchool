import type { HTMLAttributes, ReactNode } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type SurfaceVariant =
  | "default"
  | "subtle"
  | "inset"
  | "elevated"
  | "glass"
  | "gradient"
  | "grid"
  | "customized";

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  design?: DesignPreset;
  padding?: "none" | "sm" | "md" | "lg";
}

const surfaceVariants: Record<SurfaceVariant, string> = {
  default: "border border-border bg-surface",
  subtle: "border border-border/70 bg-surface-hover/55",
  inset: "border border-border bg-background shadow-inner shadow-foreground/5",
  elevated:
    "border border-border/60 bg-surface shadow-lg shadow-foreground/5",
  glass: "border border-white/20 bg-surface/70 backdrop-blur-xl",
  gradient:
    "border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-tertiary/10",
  grid:
    "border border-border bg-surface bg-[linear-gradient(to_right,var(--theme-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--theme-border)_1px,transparent_1px)] bg-[size:24px_24px]",
  customized: "",
};

const surfacePaddings: Record<
  NonNullable<SurfaceProps["padding"]>,
  string
> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Surface({
  variant = "default",
  design,
  padding = "md",
  className,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl text-foreground",
        surfaceVariants[variant],
        design && surfaceDesignStyles[design],
        surfacePaddings[padding],
        className,
      )}
      {...props}
    />
  );
}

export interface SurfaceHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export function SurfaceHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  children,
  ...props
}: SurfaceHeaderProps) {
  return (
    <div
      className={cn("flex min-w-0 flex-wrap items-start justify-between gap-4", className)}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-secondary">
            {eyebrow}
          </p>
        )}
        {title && (
          <h3 className="mt-1 break-words text-base font-extrabold tracking-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        )}
        {children}
      </div>
      {actions && <div className="max-w-full shrink-0">{actions}</div>}
    </div>
  );
}

export function SurfaceContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5", className)} {...props} />;
}

export interface GradientBorderProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
  design?: DesignPreset;
}

export function GradientBorder({
  innerClassName,
  design,
  className,
  children,
  ...props
}: GradientBorderProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-primary via-secondary to-tertiary p-px",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-[calc(1rem-1px)] bg-surface p-5",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
