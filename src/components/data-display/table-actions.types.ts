import type { ReactNode } from "react";

import type { DesignPreset } from "@/components/types";

export type TableActionsVariant = "icons" | "dropdown" | "buttons";

export interface TableAction {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  hidden?: boolean;
}

export interface TableActionsClassNames {
  trigger?: string;
  menu?: string;
  action?: string;
  icon?: string;
  label?: string;
}

export interface TableActionsProps {
  actions: readonly TableAction[];
  variant?: TableActionsVariant;
  design?: DesignPreset;
  align?: "start" | "end";
  dropdownLabel?: string;
  ariaLabel?: string;
  className?: string;
  classNames?: TableActionsClassNames;
}
