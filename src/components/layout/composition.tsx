import type { HTMLAttributes } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  gutters?: boolean;
  intrinsic?: boolean;
  design?: DesignPreset;
}

const centerWidths = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  none: "max-w-none",
};

export function Center({
  maxWidth = "lg",
  gutters = true,
  intrinsic = false,
  design,
  className,
  ...props
}: CenterProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        centerWidths[maxWidth],
        gutters && "px-4 sm:px-6",
        intrinsic && "flex flex-col items-center",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
  align?: "start" | "center" | "end" | "baseline";
  gap?: "xs" | "sm" | "md" | "lg";
  design?: DesignPreset;
}

const clusterGaps = {
  xs: "gap-1.5",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
};

export function Cluster({
  justify = "start",
  align = "center",
  gap = "sm",
  design,
  className,
  ...props
}: ClusterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap",
        clusterGaps[gap],
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "between" && "justify-between",
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "baseline" && "items-baseline",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface CoverProps extends HTMLAttributes<HTMLDivElement> {
  minHeight?: "screen" | "viewport" | "sm" | "md" | "lg";
  centered?: boolean;
  design?: DesignPreset;
}

const coverHeights = {
  screen: "min-h-screen",
  viewport: "min-h-dvh",
  sm: "min-h-64",
  md: "min-h-96",
  lg: "min-h-[36rem]",
};

export function Cover({
  minHeight = "viewport",
  centered = true,
  design,
  className,
  ...props
}: CoverProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        coverHeights[minHeight],
        centered && "justify-center",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface BleedProps extends HTMLAttributes<HTMLDivElement> {
  inline?: "sm" | "md" | "lg";
  block?: "none" | "sm" | "md";
  design?: DesignPreset;
}

const bleedInline = { sm: "-mx-3", md: "-mx-5", lg: "-mx-8" };
const bleedBlock = { none: "", sm: "-my-3", md: "-my-5" };

export function Bleed({
  inline = "md",
  block = "none",
  design,
  className,
  ...props
}: BleedProps) {
  return (
    <div
      className={cn(
        bleedInline[inline],
        bleedBlock[block],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export function VisuallyHidden({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("sr-only", className)} {...props} />;
}
