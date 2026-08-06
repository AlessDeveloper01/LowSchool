"use client";

import { usePathname } from "next/navigation";
import { LuMenu, LuSearch } from "react-icons/lu";

import { Kbd } from "@/components/ui/kbd";
import { CommandSearch } from "@/features/navigation/components/topbar/command-search";
import { UserMenu } from "@/features/navigation/components/topbar/user-menu";
import { navigationConfig } from "@/features/navigation/config/nav-config";
import { useCommandShortcut } from "@/features/navigation/hooks/use-command-shortcut";
import { getPageTitle } from "@/features/navigation/lib/navigation-utils";
import { useNavigationStore } from "@/features/navigation/store/navigationStore";
import { ThemeToggle } from "@/features/theme/components/theme-toggle";
import type { SessionUser } from "@/features/auth/types/auth.types";

interface TopbarProps {
  onOpenMobileMenu: () => void;
  user: SessionUser;
}

export function Topbar({ onOpenMobileMenu, user }: TopbarProps) {
  const pathname = usePathname();
  const searchOpen = useNavigationStore((state) => state.commandSearchOpen);
  const setSearchOpen = useNavigationStore((state) => state.setCommandSearchOpen);
  const openSearch = () => setSearchOpen(true);
  useCommandShortcut(openSearch);
  const pageTitle = getPageTitle(navigationConfig, pathname);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary md:hidden"
          aria-label="Abrir menú"
        >
          <LuMenu className="size-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">
            LowSolutions Software
          </p>
          <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
            {pageTitle}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary sm:min-w-48"
            aria-label="Abrir búsqueda"
          >
            <LuSearch className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Buscar...</span>
            <Kbd className="ml-auto hidden sm:inline-flex">⌘ / Ctrl K</Kbd>
          </button>
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </header>

      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} userRole={user.role} />
    </>
  );
}
