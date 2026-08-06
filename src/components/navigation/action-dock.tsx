"use client";

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { LuSearch } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type ActionDockVariant =
  | "default"
  | "floating"
  | "glass"
  | "customized";

export interface DockAction {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface ActionDockProps extends HTMLAttributes<HTMLDivElement> {
  actions: DockAction[];
  variant?: ActionDockVariant;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  actionClassName?: string;
  design?: DesignPreset;
}

const dockVariants: Record<ActionDockVariant, string> = {
  default: "border border-border bg-surface",
  floating:
    "border border-border/70 bg-surface shadow-lg shadow-foreground/10",
  glass: "border border-white/20 bg-surface/75 backdrop-blur-xl",
  customized: "",
};

const actionSizes = {
  sm: "min-h-8 min-w-8 px-2 text-[11px]",
  md: "min-h-10 min-w-10 px-2.5 text-xs",
  lg: "min-h-12 min-w-12 px-3 text-sm",
};

export function ActionDock({
  actions,
  variant = "default",
  orientation = "horizontal",
  size = "md",
  showLabels = false,
  actionClassName,
  design,
  className,
  ...props
}: ActionDockProps) {
  return (
    <div
      role="toolbar"
      className={cn(
        "inline-flex max-w-full gap-1 rounded-2xl p-1.5",
        orientation === "vertical" ? "max-h-[calc(100dvh-1rem)] flex-col overflow-y-auto" : "overflow-x-auto overscroll-x-contain",
        dockVariants[variant],
        design && navigationDesignStyles[design],
        className,
      )}
      {...props}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          aria-label={action.label}
          aria-pressed={action.active}
          title={showLabels ? undefined : action.label}
          disabled={action.disabled}
          onClick={action.onSelect}
          className={cn(
            "relative inline-flex items-center justify-center gap-2 rounded-xl font-bold",
            "text-muted transition-colors hover:bg-surface-hover hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            "disabled:pointer-events-none disabled:opacity-40",
            "aria-pressed:bg-primary aria-pressed:text-primary-foreground",
            actionSizes[size],
            actionClassName,
          )}
        >
          <span className="text-base">{action.icon}</span>
          {showLabels && <span className="max-w-32 truncate">{action.label}</span>}
          {action.badge !== undefined && (
            <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[8px] font-extrabold text-danger-foreground">
              {action.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function FloatingToolbar(props: ActionDockProps) {
  return <ActionDock variant="floating" {...props} />;
}

export interface CommandTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  shortcut?: string;
  leadingIcon?: ReactNode;
  variant?: "default" | "compact" | "minimal" | "customized";
  design?: DesignPreset;
}

export function CommandTrigger({
  label = "Buscar comandos",
  shortcut = "⌘K",
  leadingIcon = <LuSearch />,
  variant = "default",
  design,
  className,
  ...props
}: CommandTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-bold",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "default" &&
          "border border-border bg-surface text-muted hover:bg-surface-hover hover:text-foreground",
        variant === "compact" && "bg-surface-hover text-foreground",
        variant === "minimal" &&
          "bg-transparent text-muted hover:text-foreground",
        design && navigationDesignStyles[design],
        className,
      )}
      {...props}
    >
      <span className="text-sm">{leadingIcon}</span>
      <span className="min-w-0 truncate">{label}</span>
      {shortcut && (
        <kbd className="ml-2 shrink-0 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[9px] text-muted">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
