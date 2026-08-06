"use client";

import { usePathname } from "next/navigation";

import { SidebarPanel } from "@/features/navigation/components/sidebar/sidebar-panel";
import { useSidebarPreferences } from "@/features/navigation/hooks/use-sidebar-preferences";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/features/auth/types/auth.types";

interface SidebarProps {
  userRole: UserRole;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ userRole, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    collapsed,
    openIds,
    toggleCollapsed,
    toggleOpen,
  } = useSidebarPreferences(pathname);

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 z-40 hidden h-screen shrink-0 transition-[width] duration-200 md:block",
          collapsed ? "w-[68px]" : "w-[248px]",
        )}
      >
        <SidebarPanel
          userRole={userRole}
          pathname={pathname}
          openIds={openIds}
          collapsed={collapsed}
          onToggleItem={toggleOpen}
          onToggleCollapsed={toggleCollapsed}
          onCloseMobile={onMobileClose}
        />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(86vw,300px)] transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <SidebarPanel
          userRole={userRole}
          pathname={pathname}
          openIds={openIds}
          collapsed={false}
          mobile
          onToggleItem={toggleOpen}
          onToggleCollapsed={toggleCollapsed}
          onCloseMobile={onMobileClose}
        />
      </aside>
    </>
  );
}
