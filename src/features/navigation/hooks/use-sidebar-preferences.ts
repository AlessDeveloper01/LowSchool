"use client";

import { useEffect, useMemo, useRef } from "react";

import { navigationConfig } from "@/features/navigation/config/nav-config";
import { getActiveAncestorIds } from "@/features/navigation/lib/navigation-utils";
import { useNavigationStore } from "@/features/navigation/store/navigationStore";

const OPEN_GROUPS_KEY = "dashboard-open-navigation-groups";
const COLLAPSED_KEY = "dashboard-sidebar-collapsed";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 1279px)";

interface SidebarPreferences {
  collapsed: boolean;
  openIds: Set<string>;
  toggleCollapsed: () => void;
  toggleOpen: (itemId: string) => void;
}

export function useSidebarPreferences(pathname: string): SidebarPreferences {
  const collapsed = useNavigationStore((state) => state.sidebarCollapsed);
  const openIdList = useNavigationStore((state) => state.sidebarOpenIds);
  const preferencesLoaded = useNavigationStore(
    (state) => state.sidebarPreferencesLoaded,
  );
  const initializePreferences = useNavigationStore(
    (state) => state.initializeSidebarPreferences,
  );
  const mergeOpenIds = useNavigationStore(
    (state) => state.mergeSidebarOpenIds,
  );
  const toggleCollapsed = useNavigationStore(
    (state) => state.toggleSidebarCollapsed,
  );
  const setCollapsed = useNavigationStore(
    (state) => state.setSidebarCollapsed,
  );
  const toggleOpen = useNavigationStore((state) => state.toggleSidebarOpen);
  const closeFlyout = useNavigationStore((state) => state.closeSidebarFlyout);
  const initialPathname = useRef(pathname);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const savedOpenIds = readStringArray(OPEN_GROUPS_KEY);
      const activeAncestorIds = getActiveAncestorIds(
        navigationConfig,
        initialPathname.current,
      );

      initializePreferences(
        window.matchMedia(TABLET_QUERY).matches ||
          localStorage.getItem(COLLAPSED_KEY) === "true",
        mergeUnique(savedOpenIds, activeAncestorIds),
      );
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [initializePreferences]);

  useEffect(() => {
    const tabletMedia = window.matchMedia(TABLET_QUERY);
    const collapseOnTablet = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setCollapsed(true);
    };

    collapseOnTablet(tabletMedia);
    tabletMedia.addEventListener("change", collapseOnTablet);
    return () => tabletMedia.removeEventListener("change", collapseOnTablet);
  }, [setCollapsed]);

  useEffect(() => {
    closeFlyout();
    const timerId = window.setTimeout(() => {
      const activeAncestorIds = getActiveAncestorIds(navigationConfig, pathname);
      mergeOpenIds(activeAncestorIds);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [closeFlyout, mergeOpenIds, pathname]);

  useEffect(() => {
    if (!preferencesLoaded) {
      return;
    }

    localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(openIdList));
  }, [openIdList, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) {
      return;
    }

    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  }, [collapsed, preferencesLoaded]);

  const openIds = useMemo(() => new Set(openIdList), [openIdList]);

  return {
    collapsed,
    openIds,
    toggleCollapsed,
    toggleOpen,
  };
}

function readStringArray(storageKey: string): string[] {
  try {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) &&
      parsedValue.every((value) => typeof value === "string")
      ? parsedValue
      : [];
  } catch {
    return [];
  }
}

function mergeUnique(currentIds: string[], incomingIds: string[]): string[] {
  return Array.from(new Set([...currentIds, ...incomingIds]));
}
