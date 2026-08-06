"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { CollapsedFlyoutItem } from "@/features/navigation/components/sidebar/collapsed-flyout-item";
import {
  branchContainsPath,
  getNavChildren,
  isPathActive,
} from "@/features/navigation/lib/navigation-utils";
import { useNavigationStore } from "@/features/navigation/store/navigationStore";
import type { NavNode } from "@/features/navigation/types/navigation";
import { cn } from "@/lib/cn";

interface CollapsedSidebarItemProps {
  item: NavNode;
  pathname: string;
}

const DESKTOP_HOVER_QUERY =
  "(min-width: 1280px) and (hover: hover) and (pointer: fine)";

export function CollapsedSidebarItem({
  item,
  pathname,
}: CollapsedSidebarItemProps) {
  const rootRef = useRef<HTMLLIElement>(null);
  const children = getNavChildren(item);
  const hasChildren = children.length > 0;
  const openFlyoutId = useNavigationStore((state) => state.sidebarFlyoutId);
  const toggleFlyout = useNavigationStore(
    (state) => state.toggleSidebarFlyout,
  );
  const openFlyout = useNavigationStore((state) => state.openSidebarFlyout);
  const closeFlyout = useNavigationStore((state) => state.closeSidebarFlyout);
  const isOpen = hasChildren && openFlyoutId === item.id;
  const isActive = item.type === "link" && isPathActive(item.href, pathname);
  const hasActiveChild = children.some((child) =>
    branchContainsPath(child, pathname),
  );
  const Icon = item.icon;
  const triggerClassName = cn(
    "mx-auto grid size-9 place-items-center rounded-lg",
    "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    isOpen || isActive
      ? "bg-primary/10 text-primary"
      : hasActiveChild
        ? "text-primary"
        : "text-muted hover:bg-background hover:text-foreground",
  );

  const canUseDesktopHover = () =>
    window.matchMedia(DESKTOP_HOVER_QUERY).matches;

  const handlePointerEnter = () => {
    if (hasChildren && canUseDesktopHover()) openFlyout(item.id);
  };

  const handlePointerLeave = () => {
    if (isOpen && canUseDesktopHover()) closeFlyout();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeFlyout();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFlyout();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeFlyout, isOpen]);

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {item.type === "link" ? (
        <Link
          href={item.href ?? "/dashboard"}
          onClick={closeFlyout}
          className={triggerClassName}
          aria-current={isActive ? "page" : undefined}
          aria-label={item.label}
          title={item.label}
        >
          {Icon && <Icon className="size-[18px]" aria-hidden="true" />}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => toggleFlyout(item.id)}
          className={triggerClassName}
          aria-label={`${isOpen ? "Ocultar" : "Mostrar"} ${item.label}`}
          aria-haspopup={hasChildren ? "menu" : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
        >
          {Icon && <Icon className="size-[18px]" aria-hidden="true" />}
        </button>
      )}

      {isOpen && (
        <div className="absolute left-full top-0 z-[60] ml-3">
          <div className="absolute -left-3 inset-y-0 w-3" aria-hidden="true" />
          <div className="w-60 rounded-xl border border-border bg-surface p-1.5 shadow-xl">
            <div className="flex items-center justify-between gap-3 px-2.5 py-2">
              <p className="text-sm font-extrabold text-foreground">
                {item.label}
              </p>
              {"badge" in item && item.badge !== undefined && (
                <span className="rounded-md bg-tertiary/10 px-1.5 py-0.5 text-[9px] font-extrabold text-tertiary">
                  {item.badge}
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {children.map((child) => (
                <CollapsedFlyoutItem
                  key={child.id}
                  item={child}
                  pathname={pathname}
                  onNavigate={closeFlyout}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
