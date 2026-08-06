"use client";

import { useState, type ReactNode } from "react";
import { LuChevronDown } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface AccordionDataItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionDataItem[];
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  design?: DesignPreset;
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
  design,
  className,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const openItems = value ?? internalValue;

  function toggle(id: string): void {
    const nextValue = openItems.includes(id) ? openItems.filter((item) => item !== id) : multiple ? [...openItems, id] : [id];
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return <div className={cn("divide-y divide-border rounded-xl border border-border", design && navigationDesignStyles[design], className)}>{items.map((item) => <AccordionItem key={item.id} item={item} open={openItems.includes(item.id)} onToggle={() => toggle(item.id)} />)}</div>;
}

export interface AccordionItemProps {
  item: AccordionDataItem;
  open: boolean;
  onToggle: () => void;
}

export function AccordionItem({ item, open, onToggle }: AccordionItemProps) {
  return (
    <div>
      <h3><button type="button" disabled={item.disabled} onClick={onToggle} aria-expanded={open} className="flex min-h-12 w-full min-w-0 items-center gap-3 px-4 text-left text-sm font-extrabold text-foreground hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40">{item.icon}<span className="min-w-0 flex-1 break-words">{item.title}</span><LuChevronDown className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")} /></button></h3>
      <div className={cn("grid transition-[grid-template-rows] duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="overflow-hidden"><div className="px-4 pb-4 text-sm leading-6 text-muted">{item.content}</div></div></div>
    </div>
  );
}

export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  design?: DesignPreset;
  className?: string;
}

export function Collapsible({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  design,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  function toggle(): void {
    if (open === undefined) setInternalOpen(!isOpen);
    onOpenChange?.(!isOpen);
  }
  return <div className={cn(design && navigationDesignStyles[design], design && "p-3", className)}><button type="button" onClick={toggle} aria-expanded={isOpen}>{trigger}</button>{isOpen && <div>{children}</div>}</div>;
}
