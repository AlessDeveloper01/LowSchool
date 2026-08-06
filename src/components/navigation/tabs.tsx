"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type TabsVariant = "underline" | "pill" | "boxed" | "segmented" | "minimal";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  orientation?: "horizontal" | "vertical";
  design?: DesignPreset;
  className?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  orientation = "horizontal",
  design,
  className,
}: TabsProps) {
  const fallbackValue = defaultValue ?? items.find((item) => !item.disabled)?.value ?? "";
  const [internalValue, setInternalValue] = useState(fallbackValue);
  const activeValue = value ?? internalValue;
  const activeItem = items.find((item) => item.value === activeValue);

  function select(nextValue: string): void {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const enabled = items.filter((item) => !item.disabled);
    const currentIndex = enabled.findIndex((item) => item.value === activeValue);
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (event.key !== nextKey && event.key !== previousKey) return;
    event.preventDefault();
    const direction = event.key === nextKey ? 1 : -1;
    const nextItem = enabled[(currentIndex + direction + enabled.length) % enabled.length];
    if (nextItem) select(nextItem.value);
  }

  return (
    <div
      className={cn(
        orientation === "vertical" && "flex gap-5",
        design && navigationDesignStyles[design],
        design && "p-2",
        className,
      )}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex overflow-x-auto",
          orientation === "vertical" && "shrink-0 flex-col overflow-visible",
          variant === "underline" && "border-b border-border",
          variant === "boxed" && "gap-1 rounded-xl border border-border p-1",
          variant === "segmented" && "gap-1 rounded-xl bg-background p-1",
          variant === "pill" && "gap-1",
        )}
      >
        {items.map((item) => {
          const active = item.value === activeValue;
          return <button key={item.value} type="button" role="tab" aria-selected={active} aria-controls={`panel-${item.value}`} disabled={item.disabled} onClick={() => select(item.value)} className={cn("inline-flex shrink-0 items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-muted transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40", variant === "underline" && active && "border-b-2 border-primary text-primary", variant === "pill" && "rounded-full", variant === "pill" && active && "bg-primary text-primary-foreground", (variant === "boxed" || variant === "segmented") && "rounded-lg", (variant === "boxed" || variant === "segmented") && active && "bg-surface text-foreground shadow-sm", variant === "minimal" && active && "text-primary")}>{item.icon}{item.label}</button>;
        })}
      </div>
      {activeItem && <div id={`panel-${activeItem.value}`} role="tabpanel" tabIndex={0} className="min-w-0 flex-1 pt-4 outline-none">{activeItem.content}</div>}
    </div>
  );
}
