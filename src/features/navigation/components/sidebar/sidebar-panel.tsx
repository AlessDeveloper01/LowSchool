"use client";

import { LuPanelLeftClose, LuPanelLeftOpen, LuX } from "react-icons/lu";

import { navigationConfig } from "@/features/navigation/config/nav-config";
import { SidebarItem } from "@/features/navigation/components/sidebar/sidebar-item";
import { BrandLogo } from "@/features/customization/components/BrandLogo";
import { useCustomizationStore } from "@/features/customization/store/customizationStore";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/features/auth/types/auth.types";

interface SidebarPanelProps {
  userRole: UserRole;
  pathname: string;
  openIds: Set<string>;
  collapsed: boolean;
  mobile?: boolean;
  onToggleItem: (itemId: string) => void;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

export function SidebarPanel({
  userRole,
  pathname,
  openIds,
  collapsed,
  mobile = false,
  onToggleItem,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarPanelProps) {
  const compact = collapsed && !mobile;
  const appName = useCustomizationStore((state) => state.settings.appName);
  const appSubtitle = useCustomizationStore(
    (state) => state.settings.appSubtitle,
  );
  const logoLightUrl = useCustomizationStore(
    (state) => state.settings.logoLightUrl,
  );
  const logoDarkUrl = useCustomizationStore(
    (state) => state.settings.logoDarkUrl,
  );
  const hasLogo = Boolean(logoLightUrl || logoDarkUrl);
  const fallbackInitial = appName.trim().charAt(0).toUpperCase() || "N";

  return (
    <div className="flex h-full flex-col border-r border-border/80 bg-surface">
      <div
        className={cn(
          "flex h-18 shrink-0 items-center border-b border-border/70 px-4",
          compact ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg text-sm font-black",
              hasLogo
                ? "bg-transparent"
                : "bg-foreground text-background",
            )}
          >
            {hasLogo ? <BrandLogo /> : fallbackInitial}
            {!hasLogo && (
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface bg-secondary" />
            )}
          </span>
          {!compact && (
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-foreground">
                {appName}
              </p>
              <p className="truncate text-[11px] font-semibold text-muted">
                {appSubtitle}
              </p>
            </div>
          )}
        </div>
        {mobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="grid size-9 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Cerrar menú"
          >
            <LuX aria-hidden="true" />
          </button>
        )}
      </div>

      <nav
        className={cn(
          "min-h-0 flex-1 px-2.5 py-4",
          compact ? "overflow-visible" : "overflow-y-auto",
        )}
        aria-label="Principal"
      >
        {!compact && (
          <p className="mb-2 px-2.5 text-[11px] font-extrabold text-foreground">
            Navegación
          </p>
        )}
        <ul className="space-y-0.5">
          {navigationConfig
            .filter(
              (item) =>
                (item.id !== "users" || userRole === "SUPER_ADMIN") &&
                (item.id !== "box" || userRole !== "CLIENTE"),
            )
            .map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              pathname={pathname}
              openIds={openIds}
              collapsed={compact}
              onToggle={onToggleItem}
              onNavigate={mobile ? onCloseMobile : undefined}
            />
            ))}
        </ul>
      </nav>

      {!mobile && (
        <div className="border-t border-border/70 p-2.5">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={cn(
              "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-muted",
              "transition-colors duration-150 hover:bg-background hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              compact && "justify-center px-0",
            )}
            aria-label={compact ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {compact ? (
              <LuPanelLeftOpen aria-hidden="true" />
            ) : (
              <>
                <LuPanelLeftClose aria-hidden="true" />
                <span>Colapsar menú</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
