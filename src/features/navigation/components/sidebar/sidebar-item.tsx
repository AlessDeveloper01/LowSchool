"use client";

import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

import { CollapsedSidebarItem } from "@/features/navigation/components/sidebar/collapsed-sidebar-item";
import { SidebarItemContent } from "@/features/navigation/components/sidebar/sidebar-item-content";
import {
  branchContainsPath,
  getNavChildren,
  isPathActive,
} from "@/features/navigation/lib/navigation-utils";
import type { NavNode } from "@/features/navigation/types/navigation";
import { cn } from "@/lib/cn";

interface SidebarItemProps {
  item: NavNode;
  pathname: string;
  openIds: Set<string>;
  collapsed: boolean;
  onToggle: (itemId: string) => void;
  onNavigate?: () => void;
}

export function SidebarItem({
  item,
  pathname,
  openIds,
  collapsed,
  onToggle,
  onNavigate,
}: SidebarItemProps) {
  const children = getNavChildren(item);
  const hasChildren = children.length > 0;
  const isOpen = openIds.has(item.id);
  const isActive = item.type === "link" && isPathActive(item.href, pathname);
  const hasActiveChild = children.some((child) =>
    branchContainsPath(child, pathname),
  );
  const rowClassName = cn(
    "group/item relative flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-bold",
    "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    isActive
      ? "bg-primary/10 text-primary before:absolute before:left-0 before:h-4 before:w-0.5 before:rounded-full before:bg-primary"
      : hasActiveChild
        ? "text-foreground"
        : "text-muted hover:bg-background hover:text-foreground",
  );

  if (collapsed) {
    return <CollapsedSidebarItem item={item} pathname={pathname} />;
  }

  const row =
    item.type === "group" ? (
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className={rowClassName}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <SidebarItemContent
          item={item}
          collapsed={false}
          showChevron={hasChildren}
          isOpen={isOpen}
        />
      </button>
    ) : (
      <div className="flex items-center">
        <Link
          href={item.href ?? "/dashboard"}
          onClick={onNavigate}
          className={cn(rowClassName, hasChildren && "rounded-r-sm")}
          aria-current={isActive ? "page" : undefined}
        >
          <SidebarItemContent item={item} collapsed={false} />
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-r-lg text-muted",
              "transition-colors duration-150 hover:bg-background hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            )}
            aria-label={`${isOpen ? "Contraer" : "Expandir"} ${item.label}`}
            aria-expanded={isOpen}
          >
            <LuChevronRight
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-90",
              )}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    );

  return (
    <li>
      {row}
      {hasChildren && isOpen && !collapsed && (
        <ul className="ml-5 mt-1 space-y-0.5 border-l border-border/80 pl-2">
          {children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              pathname={pathname}
              openIds={openIds}
              collapsed={collapsed}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
