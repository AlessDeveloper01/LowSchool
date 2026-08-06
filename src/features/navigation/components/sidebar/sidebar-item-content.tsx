import { LuChevronRight } from "react-icons/lu";

import type { NavNode } from "@/features/navigation/types/navigation";
import { cn } from "@/lib/cn";

interface SidebarItemContentProps {
  item: NavNode;
  collapsed: boolean;
  showChevron?: boolean;
  isOpen?: boolean;
}

export function SidebarItemContent({
  item,
  collapsed,
  showChevron = false,
  isOpen = false,
}: SidebarItemContentProps) {
  const Icon = item.icon;

  return (
    <>
      <span className="grid size-5 shrink-0 place-items-center">
        {Icon ? (
          <Icon className="size-[18px]" aria-hidden="true" />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </span>
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
          {"badge" in item && item.badge !== undefined && (
            <span className="rounded-md bg-tertiary/10 px-1.5 py-0.5 text-[9px] font-extrabold text-tertiary">
              {item.badge}
            </span>
          )}
          {showChevron && (
            <LuChevronRight
              className={cn(
                "size-3.5 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90",
              )}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </>
  );
}
