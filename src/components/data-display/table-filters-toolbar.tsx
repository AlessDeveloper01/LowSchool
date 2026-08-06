import type { RefObject } from "react";
import {
  LuChevronDown,
  LuListFilter,
  LuRotateCcw,
  LuSearch,
} from "react-icons/lu";

import { Input } from "@/components/forms/input";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

import type { TableFiltersClassNames } from "./table-filters.types";

interface TableFiltersToolbarProps {
  searchable: boolean;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchPlaceholder: string;
  searchLabel: string;
  canShowPanel: boolean;
  collapsible: boolean;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  panelId: string;
  triggerId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  filtersLabel: string;
  activeCount: number;
  canClear: boolean;
  onClear: () => void;
  clearLabel: string;
  design?: DesignPreset;
  classNames?: TableFiltersClassNames;
}

export function TableFiltersToolbar({
  searchable,
  searchValue,
  onSearchValueChange,
  searchPlaceholder,
  searchLabel,
  canShowPanel,
  collapsible,
  panelOpen,
  onPanelOpenChange,
  panelId,
  triggerId,
  triggerRef,
  filtersLabel,
  activeCount,
  canClear,
  onClear,
  clearLabel,
  design,
  classNames,
}: TableFiltersToolbarProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 min-[480px]:flex-row min-[480px]:items-center",
        classNames?.toolbar,
      )}
    >
      {searchable && (
        <Input
          design={design}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          leftIcon={<LuSearch aria-hidden="true" />}
          containerClassName="min-w-0 flex-1"
          controlClassName={classNames?.search}
        />
      )}
      <div
        className={cn(
          "flex w-full shrink-0 flex-wrap items-center gap-2 min-[480px]:w-auto",
          classNames?.controls,
        )}
      >
        {canShowPanel && collapsible && (
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            aria-expanded={panelOpen}
            aria-controls={panelId}
            onClick={() => onPanelOpenChange(!panelOpen)}
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-extrabold text-foreground min-[480px]:flex-none",
              "transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              design && controlDesignStyles[design],
              classNames?.trigger,
            )}
          >
            <LuListFilter aria-hidden="true" />
            {filtersLabel}
            {activeCount > 0 && (
              <span
                className={cn(
                  "grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground",
                  classNames?.counter,
                )}
              >
                {activeCount}
              </span>
            )}
            <LuChevronDown
              aria-hidden="true"
              className={cn(
                "transition-transform",
                panelOpen && "rotate-180",
              )}
            />
          </button>
        )}
        {canShowPanel && !collapsible && activeCount > 0 && (
          <span
            className={cn(
              "rounded-full bg-primary px-2 py-1 text-[10px] font-extrabold text-primary-foreground",
              classNames?.counter,
            )}
            aria-label={`${activeCount} filtros activos`}
          >
            {activeCount}
          </span>
        )}
        {canClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold text-muted",
              "transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              design && controlDesignStyles[design],
              classNames?.clear,
            )}
            aria-label={clearLabel}
          >
            <LuRotateCcw aria-hidden="true" />
            <span className="hidden min-[380px]:inline">{clearLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
