"use client";

import type { HTMLAttributes, ReactNode } from "react";
import {
  LuCircleAlert,
  LuCircleCheck,
  LuInfo,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "danger" | "neutral";
export type AlertStyle = "solid" | "soft" | "outline" | "customized";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  appearance?: AlertStyle;
  title?: string;
  description?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  design?: DesignPreset;
}

const variantStyles: Record<AlertVariant, { icon: ReactNode; text: string; soft: string; solid: string; border: string }> = {
  info: { icon: <LuInfo />, text: "text-info", soft: "bg-info/10", solid: "bg-info text-info-foreground", border: "border-info/30" },
  success: { icon: <LuCircleCheck />, text: "text-success", soft: "bg-success/10", solid: "bg-success text-success-foreground", border: "border-success/30" },
  warning: { icon: <LuTriangleAlert />, text: "text-warning", soft: "bg-warning/10", solid: "bg-warning text-warning-foreground", border: "border-warning/30" },
  danger: { icon: <LuCircleAlert />, text: "text-danger", soft: "bg-danger/10", solid: "bg-danger text-danger-foreground", border: "border-danger/30" },
  neutral: { icon: <LuInfo />, text: "text-foreground", soft: "bg-surface-hover", solid: "bg-foreground text-background", border: "border-border" },
};

export function Alert({ variant = "info", appearance = "soft", title, description, icon, dismissible, onDismiss, primaryAction, secondaryAction, design, className, children, ...props }: AlertProps) {
  const colors = variantStyles[variant];
  const isSolid = appearance === "solid";
  const isCustomized = appearance === "customized";
  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={cn(
        "flex min-w-0 max-w-full items-start gap-3 rounded-xl px-3 py-3 text-sm sm:px-4",
        appearance === "solid" && colors.solid,
        appearance === "soft" && colors.soft,
        appearance === "outline" && "border bg-transparent",
        appearance === "outline" && colors.border,
        !isSolid && !isCustomized && colors.text,
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <span className="mt-0.5 shrink-0 text-lg">{icon ?? colors.icon}</span>
      <div className="min-w-0 flex-1">
        {title && <p className={cn("font-extrabold", !isSolid && !isCustomized && "text-foreground")}>{title}</p>}
        {(description || children) && <div className={cn("text-xs leading-5", title && "mt-1", !isSolid && !isCustomized && "text-muted")}>{description ?? children}</div>}
        {(primaryAction || secondaryAction) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {primaryAction && <Button size="xs" variant={isSolid ? "outline" : "primary"} onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
            {secondaryAction && <Button size="xs" variant="ghost" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
          </div>
        )}
      </div>
      {dismissible && <button type="button" onClick={onDismiss} className="-m-1 grid size-10 shrink-0 place-items-center rounded-md hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current sm:size-8" aria-label="Cerrar alerta"><LuX /></button>}
    </div>
  );
}

export function InlineMessage(props: AlertProps) {
  return <Alert appearance="soft" className="rounded-lg px-3 py-2" {...props} />;
}

export function Banner(props: AlertProps) {
  return <Alert className="w-full rounded-none border-x-0" {...props} />;
}
