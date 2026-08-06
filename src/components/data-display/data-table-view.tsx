import type { ReactNode } from "react";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";

import { Checkbox } from "@/components/forms/choice";
import { Pagination } from "@/components/navigation/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
} from "@/components/data-display/table";
import {
  TableActions,
  type TableAction,
  type TableActionsClassNames,
  type TableActionsVariant,
} from "@/components/data-display/table-actions";
import { readDataTableValue } from "@/components/data-display/data-table-logic";
import type { DesignPreset, SurfaceMode } from "@/components/types";

import type {
  DataTableSortDirection,
  IndexedDataTableRow,
} from "./data-table-logic";
import type {
  DataTableColumn,
  DataTableRowActions,
} from "./data-table.types";

interface DataTableGridProps<T extends object> {
  rows: readonly IndexedDataTableRow<T>[];
  columns: readonly DataTableColumn<T>[];
  loading: boolean;
  emptyMessage: string;
  selectable: boolean;
  allSelected: boolean;
  partiallySelected: boolean;
  selectedIds: readonly string[];
  onTogglePage: () => void;
  onToggleRow: (rowId: string, selected: boolean) => void;
  getRowId: (item: T, sourceIndex: number) => string;
  rowNumberOffset: number;
  sortKey?: string;
  sortDirection: DataTableSortDirection;
  onSort: (column: DataTableColumn<T>) => void;
  actions?: (item: T) => ReactNode;
  rowActions?: DataTableRowActions<T>;
  actionsVariant?: TableActionsVariant;
  actionsDesign?: DesignPreset;
  actionsClassName?: string;
  actionClassNames?: TableActionsClassNames;
  design?: DesignPreset;
  surface?: SurfaceMode;
}

export function DataTableGrid<T extends object>({
  rows,
  columns,
  loading,
  emptyMessage,
  selectable,
  allSelected,
  partiallySelected,
  selectedIds,
  onTogglePage,
  onToggleRow,
  getRowId,
  rowNumberOffset,
  sortKey,
  sortDirection,
  onSort,
  actions,
  rowActions,
  actionsVariant = "icons",
  actionsDesign,
  actionsClassName,
  actionClassNames,
  design,
  surface,
}: DataTableGridProps<T>) {
  const hasActions = Boolean(
    actions ||
      (typeof rowActions === "function"
        ? rowActions
        : rowActions && rowActions.length > 0),
  );
  const columnCount =
    columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <Table
      variant="hoverable"
      design={design}
      surface={surface}
      aria-busy={loading}
    >
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                indeterminate={partiallySelected}
                onChange={onTogglePage}
                aria-label="Seleccionar página"
              />
            </TableHead>
          )}
          {columns.map((column) => {
            const columnKey = String(column.key);
            return (
              <TableHead
                key={columnKey}
                className={column.className}
                aria-sort={
                  column.sortable
                    ? sortKey === columnKey
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                    : undefined
                }
              >
                <button
                  type="button"
                  disabled={!column.sortable}
                  onClick={() => onSort(column)}
                  className="inline-flex items-center gap-1 font-extrabold disabled:cursor-default"
                >
                  {column.header}
                  {sortKey === columnKey &&
                    (sortDirection === "asc" ? (
                      <LuArrowUp aria-hidden="true" />
                    ) : (
                      <LuArrowDown aria-hidden="true" />
                    ))}
                </button>
              </TableHead>
            );
          })}
          {hasActions && (
            <TableHead className="sticky right-0 z-[2] w-px whitespace-nowrap bg-background px-2 text-right sm:px-4">
              <span className="hidden sm:inline">Acciones</span>
              <span className="sr-only sm:hidden">Acciones de fila</span>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableLoading colSpan={columnCount} />
        ) : rows.length === 0 ? (
          <TableEmpty colSpan={columnCount} message={emptyMessage} />
        ) : (
          rows.map(({ item, sourceIndex }, index) => {
            const rowId = getRowId(item, sourceIndex);
            const selected = selectedIds.includes(rowId);
            return (
              <TableRow key={rowId} selected={selected}>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selected}
                      onChange={() => onToggleRow(rowId, selected)}
                      aria-label={`Seleccionar fila ${rowNumberOffset + index + 1}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={column.className}
                  >
                    {column.render
                      ? column.render(item)
                      : String(
                          readDataTableValue(item, String(column.key)) ?? "",
                        )}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="sticky right-0 z-[1] w-px whitespace-nowrap bg-surface/95 px-2 text-right backdrop-blur sm:px-4">
                    {actions ? (
                      actions(item)
                    ) : (
                      <TableActions
                        actions={resolveRowActions(rowActions, item)}
                        variant={actionsVariant}
                        design={actionsDesign ?? design}
                        className={actionsClassName}
                        classNames={actionClassNames}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

function resolveRowActions<T extends object>(
  rowActions: DataTableRowActions<T> | undefined,
  item: T,
): readonly TableAction[] {
  if (!rowActions) return [];
  return typeof rowActions === "function" ? rowActions(item) : rowActions;
}

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="text-xs font-bold text-muted">
        Filas
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="ml-2 rounded-md border border-border bg-surface px-2 py-1 text-foreground"
        >
          {pageSizeOptions.map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select>
      </label>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        size="sm"
      />
    </div>
  );
}
