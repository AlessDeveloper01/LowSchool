import type { ReactNode } from "react";
import Link from "next/link";
import { LuChevronRight, LuEllipsis, LuHouse } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  homeHref?: string;
  showHome?: boolean;
  maxItems?: number;
  design?: DesignPreset;
  className?: string;
}

export function Breadcrumb({
  items,
  separator = <LuChevronRight />,
  homeHref = "/",
  showHome = true,
  maxItems = 5,
  design,
  className,
}: BreadcrumbProps) {
  const shouldCollapse = items.length > maxItems;
  const visibleItems = shouldCollapse ? [items[0], null, ...items.slice(-(maxItems - 2))] : items;
  return (
    <nav
      aria-label="Migas de pan"
      className={cn(
        "overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        design && navigationDesignStyles[design],
        design && "px-3 py-2",
        className,
      )}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-muted">
        {showHome && <li><Link href={homeHref} className="rounded p-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary" aria-label="Inicio"><LuHouse /></Link></li>}
        {visibleItems.map((item, index) => (
          <li key={item ? `${item.label}-${index}` : "ellipsis"} className={cn("flex items-center gap-1.5", item === null && "hidden sm:flex")}>
            {(showHome || index > 0) && <span className="text-muted/50">{separator}</span>}
            {item === null ? <LuEllipsis /> : item.href && index < visibleItems.length - 1 ? <Link href={item.href} className="inline-flex items-center gap-1 hover:text-foreground">{item.icon}{item.label}</Link> : <span className="inline-flex items-center gap-1 font-bold text-foreground" aria-current="page">{item.icon}{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
