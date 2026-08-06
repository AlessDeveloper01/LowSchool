import type { ReactNode } from "react";
import {
  LuCheck,
  LuCircleAlert,
  LuLoaderCircle,
  LuPlay,
} from "react-icons/lu";

import {
  Button,
  type ButtonProps,
  type ButtonVariant,
} from "@/components/ui/button";

export type StatusButtonState = "idle" | "loading" | "success" | "error";

export interface StatusButtonProps
  extends Omit<
    ButtonProps,
    "children" | "leftIcon" | "loading" | "loadingText"
  > {
  status?: StatusButtonState;
  labels?: Partial<Record<StatusButtonState, string>>;
  icons?: Partial<Record<StatusButtonState, ReactNode>>;
}

const defaultLabels: Record<StatusButtonState, string> = {
  idle: "Ejecutar",
  loading: "Procesando",
  success: "Completado",
  error: "Reintentar",
};

const defaultIcons: Record<StatusButtonState, ReactNode> = {
  idle: <LuPlay aria-hidden="true" />,
  loading: <LuLoaderCircle className="animate-spin" aria-hidden="true" />,
  success: <LuCheck aria-hidden="true" />,
  error: <LuCircleAlert aria-hidden="true" />,
};

const statusVariants: Record<StatusButtonState, ButtonVariant> = {
  idle: "primary",
  loading: "primary",
  success: "success",
  error: "danger",
};

export function StatusButton({
  status = "idle",
  labels,
  icons,
  variant,
  disabled,
  ...props
}: StatusButtonProps) {
  const loading = status === "loading";
  const label = labels?.[status] ?? defaultLabels[status];
  const icon = icons?.[status] ?? defaultIcons[status];

  return (
    <Button
      variant={variant ?? statusVariants[status]}
      leftIcon={icon}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-live="polite"
      {...props}
    >
      {label}
    </Button>
  );
}
