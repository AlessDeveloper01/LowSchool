"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LuX } from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface MobileNavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  badge?: string | number;
}

export interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MobileNavigationItem[];
  header?: ReactNode;
  design?: DesignPreset;
  className?: string;
}

export function MobileMenu({
  open,
  onOpenChange,
  items,
  header,
  design,
  className,
}: MobileMenuProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-foreground/30 md:hidden" onClick={() => onOpenChange(false)}>
      <aside
        className={cn(
          "flex h-full w-[min(86vw,320px)] flex-col bg-surface",
          design && navigationDesignStyles[design],
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-16 min-w-0 items-center border-b border-border px-4"><div className="min-w-0 flex-1 overflow-hidden">{header}</div><button type="button" className="ml-auto grid size-11 shrink-0 place-items-center rounded-lg hover:bg-surface-hover" onClick={() => onOpenChange(false)} aria-label="Cerrar menú"><LuX /></button></div>
        <nav className="flex-1 overflow-y-auto overscroll-contain p-3"><ul className="space-y-1">{items.map((item) => <li key={item.href}><Link href={item.href} onClick={() => onOpenChange(false)} className={cn("flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-3 text-sm font-bold text-muted hover:bg-surface-hover", item.active && "bg-primary/10 text-primary")}>{item.icon}<span className="min-w-0 flex-1 truncate">{item.label}</span>{item.badge !== undefined && <Badge size="sm" className="shrink-0">{item.badge}</Badge>}</Link></li>)}</ul></nav>
      </aside>
    </div>
  );
}

export interface BottomNavigationProps {
  items: MobileNavigationItem[];
  design?: DesignPreset;
  className?: string;
}

export function BottomNavigation({
  items,
  design,
  className,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navegación inferior"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden",
        design && navigationDesignStyles[design],
        className,
      )}
    >
      <ul className="grid overflow-x-auto overscroll-x-contain" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(4rem, 1fr))` }}>
        {items.map((item) => <li key={item.href} className="min-w-0"><Link href={item.href} className={cn("relative flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-bold text-muted", item.active && "text-primary")}>{item.icon}<span className="max-w-full truncate">{item.label}</span>{item.badge !== undefined && <Badge size="sm" className="absolute right-[15%] top-2">{item.badge}</Badge>}</Link></li>)}
      </ul>
    </nav>
  );
}
