import Link from "next/link";

import {
  getNavChildren,
  isPathActive,
} from "@/features/navigation/lib/navigation-utils";
import type { NavNode } from "@/features/navigation/types/navigation";
import { cn } from "@/lib/cn";

interface CollapsedFlyoutItemProps {
  item: NavNode;
  pathname: string;
  onNavigate: () => void;
}

export function CollapsedFlyoutItem({
  item,
  pathname,
  onNavigate,
}: CollapsedFlyoutItemProps) {
  const children = getNavChildren(item);
  const isActive = item.type === "link" && isPathActive(item.href, pathname);
  const Icon = item.icon;

  return (
    <li>
      {item.type === "link" ? (
        <Link
          href={item.href ?? "/dashboard"}
          onClick={onNavigate}
          className={cn(
            "flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold",
            "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-background",
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <span className="grid size-5 shrink-0 place-items-center">
            {Icon ? (
              <Icon className="size-4" aria-hidden="true" />
            ) : (
              <span className="size-1.5 rounded-full bg-current" />
            )}
          </span>
          <span className="truncate">{item.label}</span>
        </Link>
      ) : (
        <div className="mt-2 flex min-h-7 items-center gap-2 px-2.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted first:mt-0">
          <span className="size-1.5 shrink-0 rounded-full bg-secondary" />
          <span className="truncate">{item.label}</span>
        </div>
      )}

      {children.length > 0 && (
        <ul className="space-y-0.5">
          {children.map((child) => (
            <CollapsedFlyoutItem
              key={child.id}
              item={child}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
