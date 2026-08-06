"use client";

import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface NavRailItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  onSelect?: () => void;
}

export interface NavRailProps extends HTMLAttributes<HTMLElement> {
  items: NavRailItem[];
  label?: string;
  variant?: "minimal" | "soft" | "floating" | "customized";
  showLabels?: boolean;
  itemClassName?: string;
  design?: DesignPreset;
}

export function NavRail({
  items,
  label = "Navegación principal",
  variant = "minimal",
  showLabels = false,
  itemClassName,
  design,
  className,
  ...props
}: NavRailProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "inline-flex max-h-[calc(100dvh-1rem)] max-w-full flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl p-1.5",
        variant === "soft" && "bg-surface-hover/70",
        variant === "floating" &&
          "border border-border bg-surface shadow-lg shadow-foreground/5",
        design && navigationDesignStyles[design],
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const itemStyles = cn(
          "relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-bold",
          "text-muted transition-colors hover:bg-surface-hover hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "aria-current:bg-primary aria-current:text-primary-foreground",
          item.disabled && "pointer-events-none opacity-40",
          !showLabels && "w-11 justify-center px-0",
          itemClassName,
        );
        const content = (
          <>
            <span className="text-base">{item.icon}</span>
            {showLabels && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
            {item.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full bg-danger px-1.5 text-[8px] font-extrabold text-danger-foreground",
                  !showLabels && "absolute -right-1 -top-1",
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        );

        if (item.href && !item.disabled) {
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={showLabels ? undefined : item.label}
              aria-current={item.active ? "page" : undefined}
              title={showLabels ? undefined : item.label}
              className={itemStyles}
              onClick={item.onSelect}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            aria-label={showLabels ? undefined : item.label}
            aria-current={item.active ? "page" : undefined}
            title={showLabels ? undefined : item.label}
            disabled={item.disabled}
            onClick={item.onSelect}
            className={itemStyles}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
