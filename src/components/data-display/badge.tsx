"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { LuX } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"
  | "soft"
  | "gradient"
  | "customized";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  shape?: "pill" | "square";
  dot?: boolean;
  icon?: ReactNode;
  counter?: number;
  design?: DesignPreset;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  info: "bg-info text-info-foreground",
  outline: "border border-border bg-transparent text-foreground",
  soft: "bg-primary/10 text-primary",
  gradient:
    "bg-gradient-to-r from-primary via-secondary to-tertiary text-white",
  customized: "",
};

const sizes = {
  sm: "min-h-5 px-1.5 text-[9px]",
  md: "min-h-6 px-2 text-[10px]",
  lg: "min-h-7 px-2.5 text-xs",
};

export function Badge({ variant = "default", size = "md", shape = "pill", dot, icon, counter, design, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("inline-flex max-w-full items-center justify-center gap-1.5 break-words text-center whitespace-normal font-extrabold", variants[variant], sizes[size], shape === "pill" ? "rounded-full" : "rounded-md", design && controlDesignStyles[design], className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {icon}
      {counter ?? children}
    </span>
  );
}

export type Status =
  | "active" | "inactive" | "pending" | "paid" | "cancelled"
  | "processing" | "new" | "out-of-stock" | "draft" | "archived";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  status: Status;
  label?: string;
}

const statusMap: Record<Status, { label: string; variant: BadgeVariant }> = {
  active: { label: "Activo", variant: "success" },
  inactive: { label: "Inactivo", variant: "default" },
  pending: { label: "Pendiente", variant: "warning" },
  paid: { label: "Pagado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
  processing: { label: "Procesando", variant: "info" },
  new: { label: "Nuevo", variant: "primary" },
  "out-of-stock": { label: "Agotado", variant: "danger" },
  draft: { label: "Borrador", variant: "outline" },
  archived: { label: "Archivado", variant: "default" },
};

export function StatusBadge({ status, label, ...props }: StatusBadgeProps) {
  const config = statusMap[status];
  return <Badge variant={config.variant} dot {...props}>{label ?? config.label}</Badge>;
}

export interface TagProps extends BadgeProps {
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ removable, onRemove, children, ...props }: TagProps) {
  return (
    <Badge variant="outline" shape="square" {...props}>
      {children}
      {removable && <button type="button" onClick={onRemove} className="-my-1 -mr-1 grid min-h-7 min-w-7 shrink-0 place-items-center rounded hover:text-danger" aria-label={`Eliminar ${String(children)}`}><LuX /></button>}
    </Badge>
  );
}

export interface ChipProps extends TagProps {
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

export function Chip({ selected = false, onSelectedChange, children, ...props }: ChipProps) {
  return (
    <button type="button" aria-pressed={selected} onClick={() => onSelectedChange?.(!selected)} className="max-w-full rounded-full focus-visible:outline-2 focus-visible:outline-primary">
      <Badge variant={selected ? "primary" : "outline"} {...props}>{children}</Badge>
    </button>
  );
}
