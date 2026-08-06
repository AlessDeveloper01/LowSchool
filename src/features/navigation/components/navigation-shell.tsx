"use client";

import type { ReactNode } from "react";

import type { SessionUser } from "@/features/auth/types/auth.types";
import { Sidebar } from "@/features/navigation/components/sidebar/sidebar";
import { Topbar } from "@/features/navigation/components/topbar/topbar";
import { useNavigationStore } from "@/features/navigation/store/navigationStore";
import { OnlineSessionBridge } from "@/features/offline/components/OnlineSessionBridge";

interface NavigationShellProps {
  children: ReactNode;
  user: SessionUser;
}

export function NavigationShell({ children, user }: NavigationShellProps) {
  const mobileMenuOpen = useNavigationStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useNavigationStore((state) => state.setMobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <OnlineSessionBridge user={user} />
      <Sidebar
        userRole={user.role}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} user={user} />
        <main>{children}</main>
      </div>
    </div>
  );
}
