import type { CSSProperties, HTMLAttributes } from "react";

import {
  mediaDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import type { LoaderSize } from "./loaders";

export type SkeletonVariant =
  | "text"
  | "rounded"
  | "rectangular"
  | "circular"
  | "customized";
export type SkeletonAnimation = "pulse" | "wave" | "none";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  design?: DesignPreset;
}

const skeletonVariants: Record<SkeletonVariant, string> = {
  text: "h-3 rounded",
  rounded: "rounded-xl",
  rectangular: "rounded-none",
  circular: "rounded-full",
  customized: "",
};

const skeletonAnimations: Record<SkeletonAnimation, string> = {
  pulse: "animate-pulse",
  wave:
    "animate-[pulse_1.35s_ease-in-out_infinite] bg-gradient-to-r from-surface-hover via-border/70 to-surface-hover bg-[length:200%_100%]",
  none: "",
};

export function Skeleton({
  variant = "rounded",
  animation = "pulse",
  width,
  height,
  design,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "max-w-full",
        variant !== "customized" && "bg-surface-hover",
        skeletonVariants[variant],
        skeletonAnimations[animation],
        design && mediaDesignStyles[design],
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
  animation?: SkeletonAnimation;
  design?: DesignPreset;
}

export function TextSkeleton({
  lines = 3,
  lastLineWidth = "65%",
  className,
  animation,
  design,
}: TextSkeletonProps) {
  return (
    <div className={cn("max-w-full space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          animation={animation}
          design={design}
          style={index === lines - 1 ? { width: lastLineWidth } : undefined}
          className="w-full"
        />
      ))}
    </div>
  );
}

export function AvatarSkeleton({
  size = "md",
  design,
  className,
}: {
  size?: LoaderSize;
  design?: DesignPreset;
  className?: string;
}) {
  const sizes: Record<LoaderSize, string> = {
    sm: "size-8",
    md: "size-11",
    lg: "size-16",
  };

  return (
    <Skeleton
      variant="circular"
      design={design}
      className={cn(sizes[size], "shrink-0", className)}
    />
  );
}
