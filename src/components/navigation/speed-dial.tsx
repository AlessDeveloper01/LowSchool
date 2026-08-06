"use client";

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { LuPlus, LuX } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SpeedDialProps extends HTMLAttributes<HTMLDivElement> {
  actions: SpeedDialAction[];
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "up" | "down" | "left" | "right";
  variant?: "primary" | "secondary" | "glass" | "customized";
  triggerClassName?: string;
  actionClassName?: string;
  design?: DesignPreset;
}

const directions = {
  up: "flex-col-reverse",
  down: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

export function SpeedDial({
  actions,
  label = "Abrir acciones rápidas",
  open,
  defaultOpen = false,
  onOpenChange,
  direction = "up",
  variant = "primary",
  triggerClassName,
  actionClassName,
  design,
  className,
  ...props
}: SpeedDialProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  function setOpen(nextOpen: boolean): void {
    if (open === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  });

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        directions[direction],
        design && navigationDesignStyles[design],
        design && "p-2",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-label={isOpen ? "Cerrar acciones rápidas" : label}
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-2xl text-lg",
          "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
          variant === "primary" &&
            "bg-primary text-primary-foreground focus-visible:outline-primary",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground focus-visible:outline-secondary",
          variant === "glass" &&
            "border border-white/20 bg-surface/75 text-foreground backdrop-blur-xl",
          triggerClassName,
        )}
      >
        {isOpen ? <LuX /> : <LuPlus />}
      </button>

      <div
        className={cn(
          "flex max-w-[calc(100vw-5rem)] items-center gap-2 transition-all duration-200",
          direction === "up" || direction === "down"
            ? "max-h-[calc(100dvh-5rem)] flex-col overflow-y-auto"
            : "flex-row overflow-x-auto",
          isOpen
            ? "pointer-events-auto translate-none opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            title={action.label}
            disabled={action.disabled}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => {
              action.onSelect();
              setOpen(false);
            }}
            className={cn(
              "grid size-10 place-items-center rounded-xl border border-border bg-surface text-muted",
              "transition-colors hover:border-primary/40 hover:text-primary",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              "disabled:pointer-events-none disabled:opacity-40",
              actionClassName,
            )}
          >
            {action.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
