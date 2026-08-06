"use client";

import { create } from "zustand";

interface NavigationState {
  mobileMenuOpen: boolean;
  commandSearchOpen: boolean;
  commandQuery: string;
  commandSelectedIndex: number;
  userMenuOpen: boolean;
  logoutPending: boolean;
  sidebarCollapsed: boolean;
  sidebarOpenIds: string[];
  sidebarFlyoutId: string | null;
  sidebarPreferencesLoaded: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCommandSearchOpen: (open: boolean) => void;
  setCommandQuery: (query: string) => void;
  setCommandSelectedIndex: (index: number) => void;
  resetCommandSearch: () => void;
  setUserMenuOpen: (open: boolean) => void;
  setLogoutPending: (pending: boolean) => void;
  initializeSidebarPreferences: (collapsed: boolean, openIds: string[]) => void;
  mergeSidebarOpenIds: (openIds: string[]) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  toggleSidebarOpen: (itemId: string) => void;
  openSidebarFlyout: (itemId: string) => void;
  toggleSidebarFlyout: (itemId: string) => void;
  closeSidebarFlyout: () => void;
}

function mergeUnique(currentIds: string[], incomingIds: string[]): string[] {
  return Array.from(new Set([...currentIds, ...incomingIds]));
}

export const useNavigationStore = create<NavigationState>((set) => ({
  mobileMenuOpen: false,
  commandSearchOpen: false,
  commandQuery: "",
  commandSelectedIndex: 0,
  userMenuOpen: false,
  logoutPending: false,
  sidebarCollapsed: false,
  sidebarOpenIds: [],
  sidebarFlyoutId: null,
  sidebarPreferencesLoaded: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  setCommandSearchOpen: (commandSearchOpen) => set({ commandSearchOpen }),
  setCommandQuery: (commandQuery) => set({ commandQuery }),
  setCommandSelectedIndex: (commandSelectedIndex) =>
    set({ commandSelectedIndex }),
  resetCommandSearch: () => set({ commandQuery: "", commandSelectedIndex: 0 }),
  setUserMenuOpen: (userMenuOpen) => set({ userMenuOpen }),
  setLogoutPending: (logoutPending) => set({ logoutPending }),
  initializeSidebarPreferences: (sidebarCollapsed, sidebarOpenIds) =>
    set({
      sidebarCollapsed,
      sidebarOpenIds,
      sidebarPreferencesLoaded: true,
    }),
  mergeSidebarOpenIds: (openIds) =>
    set((state) => ({
      sidebarOpenIds: mergeUnique(state.sidebarOpenIds, openIds),
    })),
  setSidebarCollapsed: (sidebarCollapsed) =>
    set({ sidebarCollapsed, sidebarFlyoutId: null }),
  toggleSidebarCollapsed: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
      sidebarFlyoutId: null,
    })),
  toggleSidebarOpen: (itemId) =>
    set((state) => ({
      sidebarOpenIds: state.sidebarOpenIds.includes(itemId)
        ? state.sidebarOpenIds.filter((id) => id !== itemId)
        : [...state.sidebarOpenIds, itemId],
    })),
  openSidebarFlyout: (sidebarFlyoutId) => set({ sidebarFlyoutId }),
  toggleSidebarFlyout: (itemId) =>
    set((state) => ({
      sidebarFlyoutId: state.sidebarFlyoutId === itemId ? null : itemId,
    })),
  closeSidebarFlyout: () => set({ sidebarFlyoutId: null }),
}));
