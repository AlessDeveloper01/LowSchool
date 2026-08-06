import type { ReactNode } from "react";
import {
  LuBell,
  LuCircleAlert,
  LuCircleCheck,
  LuInfo,
  LuLightbulb,
  LuTriangleAlert,
} from "react-icons/lu";

import type { CalloutVariant } from "./callout.types";

interface CalloutVisual {
  icon: ReactNode;
  text: string;
  soft: string;
  border: string;
  solid: string;
}

export const calloutVariants = {
  info: {
    icon: <LuInfo aria-hidden="true" />,
    text: "text-info",
    soft: "bg-info/10",
    border: "border-info/25",
    solid: "bg-info text-info-foreground",
  },
  success: {
    icon: <LuCircleCheck aria-hidden="true" />,
    text: "text-success",
    soft: "bg-success/10",
    border: "border-success/25",
    solid: "bg-success text-success-foreground",
  },
  warning: {
    icon: <LuTriangleAlert aria-hidden="true" />,
    text: "text-warning",
    soft: "bg-warning/10",
    border: "border-warning/25",
    solid: "bg-warning text-warning-foreground",
  },
  danger: {
    icon: <LuCircleAlert aria-hidden="true" />,
    text: "text-danger",
    soft: "bg-danger/10",
    border: "border-danger/25",
    solid: "bg-danger text-danger-foreground",
  },
  tip: {
    icon: <LuLightbulb aria-hidden="true" />,
    text: "text-tertiary",
    soft: "bg-tertiary/10",
    border: "border-tertiary/25",
    solid: "bg-tertiary text-tertiary-foreground",
  },
  accent: {
    icon: <LuBell aria-hidden="true" />,
    text: "text-secondary",
    soft: "bg-secondary/10",
    border: "border-secondary/25",
    solid: "bg-secondary text-secondary-foreground",
  },
  neutral: {
    icon: <LuInfo aria-hidden="true" />,
    text: "text-foreground",
    soft: "bg-surface-hover",
    border: "border-border",
    solid: "bg-foreground text-background",
  },
  customized: {
    icon: <LuInfo aria-hidden="true" />,
    text: "",
    soft: "",
    border: "",
    solid: "",
  },
} satisfies Record<CalloutVariant, CalloutVisual>;
