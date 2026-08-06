import type { HTMLAttributes } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface AspectRatioBoxProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: "square" | "video" | "portrait" | "wide" | "customized";
  design?: DesignPreset;
}

const ratios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  customized: "",
};

export function AspectRatioBox({
  ratio = "video",
  design,
  className,
  ...props
}: AspectRatioBoxProps) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        ratios[ratio],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface SplitLayoutProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: "equal" | "sidebar-left" | "sidebar-right" | "content-left";
  align?: "start" | "center" | "stretch";
  design?: DesignPreset;
}

const splitRatios = {
  equal: "lg:grid-cols-2",
  "sidebar-left": "lg:grid-cols-[minmax(14rem,0.65fr)_2fr]",
  "sidebar-right": "lg:grid-cols-[2fr_minmax(14rem,0.65fr)]",
  "content-left": "lg:grid-cols-[1.4fr_1fr]",
};

export function SplitLayout({
  ratio = "equal",
  align = "stretch",
  design,
  className,
  ...props
}: SplitLayoutProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5",
        splitRatios[ratio],
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "stretch" && "items-stretch",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface AutoGridProps extends HTMLAttributes<HTMLDivElement> {
  minItemWidth?: "xs" | "sm" | "md" | "lg";
  gap?: "sm" | "md" | "lg";
  design?: DesignPreset;
}

const autoColumns = {
  xs: "grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))]",
  sm: "grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))]",
  md: "grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]",
  lg: "grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))]",
};
const autoGaps = { sm: "gap-3", md: "gap-5", lg: "gap-8" };

export function AutoGrid({
  minItemWidth = "sm",
  gap = "md",
  design,
  className,
  ...props
}: AutoGridProps) {
  return (
    <div
      className={cn(
        "grid",
        autoColumns[minItemWidth],
        autoGaps[gap],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  design?: DesignPreset;
}

const masonryColumns = {
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
  4: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
};

export function Masonry({
  columns = 3,
  gap = "md",
  design,
  className,
  ...props
}: MasonryProps) {
  return (
    <div
      className={cn(
        masonryColumns[columns],
        gap === "sm" && "gap-3 [&>*]:mb-3",
        gap === "md" && "gap-5 [&>*]:mb-5",
        gap === "lg" && "gap-8 [&>*]:mb-8",
        "[&>*]:break-inside-avoid",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface StickyRegionProps extends HTMLAttributes<HTMLDivElement> {
  offset?: "none" | "topbar" | "sm" | "md";
  design?: DesignPreset;
}

const stickyOffsets = {
  none: "top-0",
  topbar: "top-16",
  sm: "top-4",
  md: "top-8",
};

export function StickyRegion({
  offset = "sm",
  design,
  className,
  ...props
}: StickyRegionProps) {
  return (
    <div
      className={cn(
        "sticky self-start",
        stickyOffsets[offset],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}
