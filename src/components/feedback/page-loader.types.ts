import type { HTMLAttributes, ReactNode } from "react";

import type {
  DesignPreset,
  SurfaceMode,
} from "@/components/types/design-preset";

export type PageLoaderVariant =
  | "spinner"
  | "icon-fill"
  | "ring"
  | "orbit"
  | "steps"
  | "scanner"
  | "pulse"
  | "minimal";

export type PageLoaderTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "gradient";

export type PageLoaderSize = "sm" | "md" | "lg";
export type PageLoaderLayout = "compact" | "section" | "screen";

export interface PageLoaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label?: string;
  description?: string;
  value?: number;
  icon?: ReactNode;
  variant?: PageLoaderVariant;
  tone?: PageLoaderTone;
  size?: PageLoaderSize;
  layout?: PageLoaderLayout;
  showValue?: boolean;
  surface?: SurfaceMode;
  design?: DesignPreset;
  action?: ReactNode;
  visualClassName?: string;
  progressClassName?: string;
}

export function normalizePageLoaderProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
