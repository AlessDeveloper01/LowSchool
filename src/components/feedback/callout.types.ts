import type { HTMLAttributes, ReactNode } from "react";

import type { DesignPreset } from "@/components/types/design-preset";

export type CalloutVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "tip"
  | "accent"
  | "neutral"
  | "customized";
export type CalloutAppearance =
  | "soft"
  | "outline"
  | "solid"
  | "glass"
  | "minimal"
  | "customized";

export interface CalloutAction {
  label: string;
  onClick: () => void;
}

export interface CalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CalloutVariant;
  appearance?: CalloutAppearance;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  eyebrow?: ReactNode;
  primaryAction?: CalloutAction;
  secondaryAction?: CalloutAction;
  dismissible?: boolean;
  onDismiss?: () => void;
  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  design?: DesignPreset;
}
