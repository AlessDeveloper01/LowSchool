"use client";

import { useId, useRef, useState } from "react";

import {
  countActiveTableFilters,
  emptyTableFilterValues,
} from "@/components/data-display/table-filter-logic";
import { TableFiltersPanel } from "@/components/data-display/table-filters-panel";
import { TableFiltersToolbar } from "@/components/data-display/table-filters-toolbar";
import { cn } from "@/lib/cn";

import type {
  TableFiltersProps,
  TableFilterValues,
} from "./table-filters.types";

export type {
  DataTableFilterGroup,
  TableFilterComparable,
  TableFilterGroup,
  TableFilterOption,
  TableFiltersClassNames,
  TableFiltersProps,
  TableFilterValue,
  TableFilterValues,
  TableMultipleFilterGroup,
  TableSingleFilterGroup,
} from "./table-filters.types";

export function TableFilters<GroupId extends string = string>({
  groups = [],
  values,
  defaultValues,
  onValuesChange,
  searchable = true,
  searchValue,
  defaultSearchValue = "",
  onSearchValueChange,
  searchPlaceholder = "Buscar...",
  searchLabel = "Buscar en la tabla",
  collapsible = true,
  open,
  defaultOpen = false,
  onOpenChange,
  showPanel = true,
  filtersLabel = "Filtros",
  clearLabel = "Limpiar búsqueda y filtros",
  design,
  surface = "contained",
  className,
  classNames,
}: TableFiltersProps<GroupId>) {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const triggerId = `${baseId}-trigger`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [internalValues, setInternalValues] =
    useState<TableFilterValues<GroupId>>(
      defaultValues ?? emptyTableFilterValues<GroupId>(),
    );
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentValues = values ?? internalValues;
  const currentSearch = searchValue ?? internalSearch;
  const panelOpenState = open ?? internalOpen;
  const visibleGroups = groups.filter(
    (group) =>
      !group.hidden && group.options.some((option) => !option.hidden),
  );
  const activeCount = countActiveTableFilters(currentValues, groups);
  const canClear = activeCount > 0 || currentSearch.trim().length > 0;
  const canShowPanel = showPanel && visibleGroups.length > 0;
  const panelOpen = canShowPanel && (!collapsible || panelOpenState);

  function commitValues(nextValues: TableFilterValues<GroupId>): void {
    if (values === undefined) {
      setInternalValues(nextValues);
    }
    onValuesChange?.(nextValues);
  }

  function commitSearch(nextSearch: string): void {
    if (searchValue === undefined) {
      setInternalSearch(nextSearch);
    }
    onSearchValueChange?.(nextSearch);
  }

  function commitOpen(nextOpen: boolean): void {
    if (open === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }

  function closePanelAndRestoreFocus(): void {
    commitOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function clearAll(): void {
    commitValues(emptyTableFilterValues<GroupId>());
    commitSearch("");
  }

  return (
    <div className={cn("w-full min-w-0 space-y-3", className)}>
      <TableFiltersToolbar
        searchable={searchable}
        searchValue={currentSearch}
        onSearchValueChange={commitSearch}
        searchPlaceholder={searchPlaceholder}
        searchLabel={searchLabel}
        canShowPanel={canShowPanel}
        collapsible={collapsible}
        panelOpen={panelOpen}
        onPanelOpenChange={commitOpen}
        panelId={panelId}
        triggerId={triggerId}
        triggerRef={triggerRef}
        filtersLabel={filtersLabel}
        activeCount={activeCount}
        canClear={canClear}
        onClear={clearAll}
        clearLabel={clearLabel}
        design={design}
        classNames={classNames}
      />
      {panelOpen && (
        <TableFiltersPanel
          id={panelId}
          label={filtersLabel}
          labelledBy={collapsible ? triggerId : undefined}
          groups={visibleGroups}
          values={currentValues}
          onValuesChange={commitValues}
          onEscape={collapsible ? closePanelAndRestoreFocus : undefined}
          design={design}
          surface={surface}
          classNames={classNames}
        />
      )}
    </div>
  );
}
