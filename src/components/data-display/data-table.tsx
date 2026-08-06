"use client";

import {
  DataTableGrid,
  DataTablePagination,
} from "@/components/data-display/data-table-view";
import { TableFilters } from "@/components/data-display/table-filters";
import { useDataTableController } from "@/components/data-display/use-data-table-controller";
import { surfaceDesignStyles } from "@/components/types";
import { cn } from "@/lib/cn";

import type { DataTableProps } from "./data-table.types";

export type {
  DataTableColumn,
  DataTableProps,
  DataTableRowActions,
} from "./data-table.types";

export function DataTable<
  T extends object,
  FilterId extends string = string,
>(props: DataTableProps<T, FilterId>) {
  const {
    columns,
    loading = false,
    searchable = true,
    searchPlaceholder = "Buscar...",
    searchLabel = "Buscar en la tabla",
    filtersCollapsible = true,
    filtersOpen,
    defaultFiltersOpen = false,
    onFiltersOpenChange,
    showFilterPanel = true,
    filtersLabel = "Filtros",
    clearFiltersLabel = "Limpiar búsqueda y filtros",
    filterDesign,
    filterSurface,
    filterClassName,
    filterClassNames,
    pageSizeOptions = [5, 10, 20, 50],
    emptyMessage = "No hay resultados",
    selectable = false,
    actions,
    rowActions,
    actionsVariant = "icons",
    actionsDesign,
    actionsClassName,
    actionClassNames,
    filters,
    design,
    surface = "contained",
    tableSurface,
    className,
  } = props;
  const table = useDataTableController(props);
  const hasBuiltInFilters = searchable || table.hasFilterGroups;

  return (
    <div
      className={cn(
        "space-y-4",
        surface === "contained" && design && surfaceDesignStyles[design],
        surface === "plain" &&
          "rounded-none border-0 bg-transparent shadow-none backdrop-blur-none",
        className,
      )}
    >
      {(hasBuiltInFilters || filters) && (
        <div className="flex min-w-0 flex-col gap-3">
          {hasBuiltInFilters && (
            <TableFilters<FilterId>
              groups={table.filterGroups}
              values={table.currentFilterValues}
              onValuesChange={table.commitFilterValues}
              searchable={searchable}
              searchValue={table.query}
              onSearchValueChange={table.commitQuery}
              searchPlaceholder={searchPlaceholder}
              searchLabel={searchLabel}
              collapsible={filtersCollapsible}
              open={filtersOpen}
              defaultOpen={defaultFiltersOpen}
              onOpenChange={onFiltersOpenChange}
              showPanel={showFilterPanel}
              filtersLabel={filtersLabel}
              clearLabel={clearFiltersLabel}
              design={filterDesign ?? design}
              surface={filterSurface ?? surface}
              className={filterClassName}
              classNames={filterClassNames}
            />
          )}
          {filters && <div className="min-w-0">{filters}</div>}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {loading
          ? "Cargando resultados"
          : `${table.processedData.length} resultados encontrados`}
      </p>
      <DataTableGrid
        rows={table.pageData}
        columns={columns}
        loading={loading}
        emptyMessage={emptyMessage}
        selectable={selectable}
        allSelected={table.allSelected}
        partiallySelected={table.pageHasSelection && !table.allSelected}
        selectedIds={table.currentSelectedIds}
        onTogglePage={table.togglePage}
        onToggleRow={table.toggleRow}
        getRowId={table.getRowId}
        rowNumberOffset={(table.safePage - 1) * table.pageSize}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSort={table.sort}
        actions={actions}
        rowActions={rowActions}
        actionsVariant={actionsVariant}
        actionsDesign={actionsDesign}
        actionsClassName={actionsClassName}
        actionClassNames={actionClassNames}
        design={design}
        surface={tableSurface ?? surface}
      />
      <DataTablePagination
        currentPage={table.safePage}
        totalPages={table.totalPages}
        pageSize={table.pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={table.setCurrentPage}
        onPageSizeChange={table.changePageSize}
      />
    </div>
  );
}
