"use client";

import { useState, type HTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type NavbarVariant = "static" | "sticky" | "fixed" | "floating" | "transparent" | "blurred" | "bordered" | "minimal";

export interface NavbarLink {
  label: string;
  href: string;
  active?: boolean;
  icon?: ReactNode;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  links?: NavbarLink[];
  actions?: ReactNode;
  search?: ReactNode;
  user?: ReactNode;
  notifications?: ReactNode;
  themeSelector?: ReactNode;
  variant?: NavbarVariant;
  design?: DesignPreset;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const variants: Record<NavbarVariant, string> = {
  static: "relative bg-surface",
  sticky: "sticky top-0 z-40 bg-surface",
  fixed: "fixed inset-x-0 top-0 z-40 bg-surface",
  floating: "sticky top-3 z-40 mx-3 rounded-2xl border border-border bg-surface",
  transparent: "bg-transparent",
  blurred: "sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl",
  bordered: "border-b border-border bg-surface",
  minimal: "bg-surface",
};

export function Navbar({
  logo,
  links = [],
  actions,
  search,
  user,
  notifications,
  themeSelector,
  variant = "bordered",
  design,
  mobileOpen,
  onMobileOpenChange,
  className,
  ...props
}: NavbarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = mobileOpen ?? internalOpen;
  function setOpen(open: boolean): void {
    if (mobileOpen === undefined) setInternalOpen(open);
    onMobileOpenChange?.(open);
  }
  return (
    <header
      className={cn(
        "w-full",
        variants[variant],
        design && navigationDesignStyles[design],
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="min-w-0 overflow-hidden">{logo}</div>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className={cn("inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-bold text-muted hover:bg-surface-hover hover:text-foreground", link.active && "bg-primary/10 text-primary")}>{link.icon}{link.label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">{search}{notifications}{themeSelector}{user}{actions}</div>
        <button type="button" className="ml-auto grid size-10 place-items-center rounded-lg hover:bg-surface-hover md:hidden" onClick={() => setOpen(!isOpen)} aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isOpen}>{isOpen ? <LuX /> : <LuMenu />}</button>
      </div>
      {isOpen && <div className="min-w-0 border-t border-border p-3 md:hidden"><nav className="space-y-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("flex min-h-11 min-w-0 items-center gap-2 rounded-lg px-3 text-sm font-bold text-muted hover:bg-surface-hover", link.active && "bg-primary/10 text-primary")}>{link.icon}<span className="min-w-0 flex-1 truncate">{link.label}</span></Link>)}</nav><div className="mt-3 flex min-w-0 flex-col items-stretch gap-2 border-t border-border pt-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:max-w-full">{search}{notifications}{themeSelector}{user}{actions}</div></div>}
    </header>
  );
}

export function PublicNavbar(props: NavbarProps) { return <Navbar variant="blurred" {...props} />; }
export function DashboardNavbar(props: NavbarProps) { return <Navbar variant="bordered" {...props} />; }
export function MobileNavbar(props: NavbarProps) { return <Navbar className="md:hidden" {...props} />; }
