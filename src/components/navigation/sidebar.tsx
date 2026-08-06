"use client";

import { useState, type HTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { LuChevronDown, LuPanelLeftClose, LuPanelLeftOpen, LuX } from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

export type SidebarVariant = "light" | "dark" | "bordered" | "floating";

export interface SidebarLinkItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  children?: SidebarLinkItem[];
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items?: SidebarLinkItem[];
  header?: ReactNode;
  footer?: ReactNode;
  variant?: SidebarVariant;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  design?: DesignPreset;
}

const variants: Record<SidebarVariant, string> = {
  light: "bg-surface text-foreground",
  dark: "border-transparent bg-foreground text-background",
  bordered: "border-r border-border bg-surface",
  floating: "m-3 rounded-2xl border border-border bg-surface",
};

export function Sidebar({
  items = [],
  header,
  footer,
  variant = "bordered",
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
  design,
  className,
  ...props
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? internalCollapsed;
  function setCollapsed(next: boolean): void {
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }
  const content = (
    <aside
      className={cn(
        "flex h-full flex-col transition-[width] duration-200",
        isCollapsed ? "w-[68px]" : "w-64",
        variants[variant],
        design && navigationDesignStyles[design],
        className,
      )}
      {...props}
    >
      <SidebarHeader><div className="min-w-0 flex-1 overflow-hidden">{header}</div><button type="button" className="ml-auto grid size-11 shrink-0 place-items-center rounded-lg hover:bg-surface-hover md:hidden" onClick={() => onMobileOpenChange?.(false)} aria-label="Cerrar sidebar"><LuX /></button></SidebarHeader>
      <SidebarContent><nav><ul className="space-y-1">{items.map((item) => <SidebarItem key={item.id} item={item} collapsed={isCollapsed} />)}</ul></nav></SidebarContent>
      <SidebarFooter>{footer}<SidebarTrigger collapsed={isCollapsed} onClick={() => setCollapsed(!isCollapsed)} /></SidebarFooter>
    </aside>
  );
  return (
    <>
      <div className="sticky top-0 hidden h-screen shrink-0 md:block">{content}</div>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-foreground/30 md:hidden" onClick={() => onMobileOpenChange?.(false)}><div className="h-full w-fit" onClick={(event) => event.stopPropagation()}>{content}</div></div>}
    </>
  );
}

export function SidebarHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-16 shrink-0 items-center gap-3 border-b border-current/10 px-3", className)} {...props} />;
}
export function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto p-2.5", className)} {...props} />;
}
export function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-current/10 p-2.5", className)} {...props} />;
}
export function SidebarGroup({
  label,
  children,
  design,
  className,
}: {
  label?: string;
  children: ReactNode;
  design?: DesignPreset;
  className?: string;
}) {
  return <div className={cn("mt-4 first:mt-0", design && navigationDesignStyles[design], design && "p-2", className)}>{label && <p className="mb-1 px-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">{label}</p>}{children}</div>;
}

function SidebarItem({ item, collapsed }: { item: SidebarLinkItem; collapsed: boolean }) {
  const [open, setOpen] = useState(Boolean(item.children?.some((child) => child.active)));
  const row = item.href ? (
    <Link href={item.href} aria-current={item.active ? "page" : undefined} className={itemClass(item, collapsed)}>{item.icon}<span className={cn("min-w-0 flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>{!collapsed && item.badge !== undefined && <Badge size="sm" variant="soft">{item.badge}</Badge>}</Link>
  ) : (
    <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className={itemClass(item, collapsed)}>{item.icon}<span className={cn("min-w-0 flex-1 truncate text-left", collapsed && "sr-only")}>{item.label}</span>{!collapsed && <LuChevronDown className={cn("transition-transform", open && "rotate-180")} />}</button>
  );
  return <li>{collapsed ? <Tooltip label={item.label} position="right">{row}</Tooltip> : row}{item.children && open && !collapsed && <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-2">{item.children.map((child) => <SidebarItem key={child.id} item={child} collapsed={false} />)}</ul>}</li>;
}

function itemClass(item: SidebarLinkItem, collapsed: boolean): string {
  return cn("flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary md:min-h-10", item.active ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-hover hover:text-foreground", item.disabled && "pointer-events-none opacity-40", collapsed && "justify-center px-0");
}

export function SidebarTrigger({
  collapsed,
  onClick,
  design,
  className,
}: {
  collapsed: boolean;
  onClick: () => void;
  design?: DesignPreset;
  className?: string;
}) {
  return <button type="button" onClick={onClick} className={cn("flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-xs font-bold text-muted hover:bg-surface-hover hover:text-foreground md:min-h-9", design && navigationDesignStyles[design], className)} aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}>{collapsed ? <LuPanelLeftOpen /> : <><LuPanelLeftClose /><span>Colapsar</span></>}</button>;
}
