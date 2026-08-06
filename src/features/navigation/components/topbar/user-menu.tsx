"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuChevronDown,
  LuLogOut,
  LuSettings2,
  LuUserRound,
} from "react-icons/lu";

import { cn } from "@/lib/cn";
import { clearServerSessionAction } from "@/features/auth/actions/auth-actions";
import type {
  SessionUser,
  UserRole,
} from "@/features/auth/types/auth.types";
import { useNavigationStore } from "@/features/navigation/store/navigationStore";
import {
  clearOfflineLogoutCookie,
  clearPendingServerLogout,
  markOfflineLogoutCookie,
  markPendingServerLogout,
} from "@/features/offline/services/offlineSessionDb";
import { useOfflineStore } from "@/features/offline/store/offlineStore";

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super admin",
  MESERO: "Mesero",
  CLIENTE: "Cliente",
};

interface UserMenuProps {
  user: SessionUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const open = useNavigationStore((state) => state.userMenuOpen);
  const isSigningOut = useNavigationStore((state) => state.logoutPending);
  const setOpen = useNavigationStore((state) => state.setUserMenuOpen);
  const setLogoutPending = useNavigationStore((state) => state.setLogoutPending);
  const checkConnection = useOfflineStore((state) => state.checkConnection);
  const clearLocalSession = useOfflineStore((state) => state.clearLocalSession);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent): void {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);

  async function handleLogout(): Promise<void> {
    setOpen(false);
    setLogoutPending(true);

    try {
      const currentConnectivity = await checkConnection();
      const serverAvailable = currentConnectivity === "online";

      markOfflineLogoutCookie();
      await clearLocalSession(!serverAvailable);

      if (serverAvailable) {
        try {
          await clearServerSessionAction();
          await clearPendingServerLogout();
          clearOfflineLogoutCookie();
        } catch {
          await markPendingServerLogout();
        }
      }

      if (serverAvailable) {
        router.replace("/login");
        router.refresh();
      } else {
        window.location.replace("/offline-login");
      }
    } finally {
      setLogoutPending(false);
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-1.5 pr-2 text-muted",
          "transition-colors duration-150 hover:bg-surface-hover hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
        aria-label="Abrir menú de usuario"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="relative grid size-7 place-items-center rounded-md bg-tertiary/12 text-tertiary">
          <LuUserRound className="size-4" aria-hidden="true" />
          <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-surface bg-secondary" />
        </span>
        <LuChevronDown
          className={cn(
            "size-3.5 transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-xl border border-border bg-surface p-1.5"
        >
          <div className="px-2.5 py-2">
            <p className="text-sm font-extrabold text-foreground">{user.name}</p>
            <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
            <p className="mt-1 text-[11px] font-bold text-secondary">
              @{user.username} · {roleLabels[user.role]}
            </p>
          </div>
          <div className="my-1 h-px bg-border" />
          <UserMenuLink
            href="/settings/profile"
            label="Mi perfil"
            icon={LuUserRound}
            onNavigate={() => setOpen(false)}
          />
          <UserMenuLink
            href="/settings/notifications"
            label="Preferencias"
            icon={LuSettings2}
            onNavigate={() => setOpen(false)}
          />
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            disabled={isSigningOut}
            onClick={() => void handleLogout()}
            className="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-tertiary transition-colors duration-150 hover:bg-tertiary/10 focus-visible:outline-2 focus-visible:outline-tertiary disabled:opacity-55"
          >
            <LuLogOut className="size-4" aria-hidden="true" />
            {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      )}
    </div>
  );
}

interface UserMenuLinkProps {
  href: string;
  label: string;
  icon: typeof LuUserRound;
  onNavigate: () => void;
}

function UserMenuLink({
  href,
  label,
  icon: Icon,
  onNavigate,
}: UserMenuLinkProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-foreground transition-colors duration-150 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Icon className="size-4 text-muted" aria-hidden="true" />
      {label}
    </Link>
  );
}
