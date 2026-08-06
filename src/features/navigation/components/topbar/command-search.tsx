"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { CommandSearchFooter } from "@/features/navigation/components/topbar/command-search-footer";
import { CommandSearchInput } from "@/features/navigation/components/topbar/command-search-input";
import { CommandSearchResults } from "@/features/navigation/components/topbar/command-search-results";
import { navigationConfig } from "@/features/navigation/config/nav-config";
import {
  filterSearchableItems,
  flattenNavigation,
} from "@/features/navigation/lib/navigation-utils";
import type { SearchableNavItem } from "@/features/navigation/types/navigation";
import { useNavigationStore } from "@/features/navigation/store/navigationStore";
import type { UserRole } from "@/features/auth/types/auth.types";

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
}

export function CommandSearch({ open, onClose, userRole }: CommandSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = useNavigationStore((state) => state.commandQuery);
  const selectedIndex = useNavigationStore(
    (state) => state.commandSelectedIndex,
  );
  const setQuery = useNavigationStore((state) => state.setCommandQuery);
  const setSelectedIndex = useNavigationStore(
    (state) => state.setCommandSelectedIndex,
  );
  const resetSearch = useNavigationStore((state) => state.resetCommandSearch);
  const searchableItems = useMemo(
    () => flattenNavigation(navigationConfig.filter((item) => item.id !== "users" || userRole === "SUPER_ADMIN")),
    [userRole],
  );
  const filteredItems = useMemo(() => filterSearchableItems(searchableItems, query), [query, searchableItems]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(animationFrame);
  }, [open]);

  if (!open) {
    return null;
  }

  function closeSearch(): void {
    resetSearch();
    onClose();
  }

  function navigateTo(item: SearchableNavItem): void {
    router.push(item.href);
    closeSearch();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }

    if (filteredItems.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((selectedIndex + 1) % filteredItems.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (selectedIndex - 1 + filteredItems.length) % filteredItems.length,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedItem = filteredItems[selectedIndex];

      if (selectedItem) {
        navigateTo(selectedItem);
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-foreground/25 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeSearch();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-search-title"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface"
        onKeyDown={handleKeyDown}
      >
        <CommandSearchInput
          inputRef={inputRef}
          query={query}
          activeResultId={
            filteredItems[selectedIndex]
              ? `command-result-${filteredItems[selectedIndex].id}`
              : undefined
          }
          onQueryChange={(nextQuery) => {
            setQuery(nextQuery);
            setSelectedIndex(0);
          }}
          onClose={closeSearch}
        />

        <CommandSearchResults
          items={filteredItems}
          selectedIndex={selectedIndex}
          onSelect={navigateTo}
          onHover={setSelectedIndex}
        />

        <CommandSearchFooter />
      </div>
    </div>
  );
}
