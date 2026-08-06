import type { ReactNode } from "react";

import type {
  TableAction,
  TableActionsClassNames,
  TableActionsVariant,
} from "@/components/data-display/table-actions";
import type {
  DataTableFilterGroup,
  TableFiltersClassNames,
  TableFilterValues,
} from "@/components/data-display/table-filters";
import type { DesignPreset, SurfaceMode } from "@/components/types";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => ReactNode;
}

export type DataTableRowActions<T> =
  | readonly TableAction[]
  | ((item: T) => readonly TableAction[]);

export interface DataTableProps<
  T extends object,
  FilterId extends string = string,
> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  getSearchText?: (item: T) => string;
  searchPredicate?: (item: T, query: string) => boolean;
  filterGroups?: readonly DataTableFilterGroup<T, FilterId>[];
  filterValues?: TableFilterValues<FilterId>;
  defaultFilterValues?: TableFilterValues<FilterId>;
  onFilterValuesChange?: (values: TableFilterValues<FilterId>) => void;
  filtersCollapsible?: boolean;
  filtersOpen?: boolean;
  defaultFiltersOpen?: boolean;
  onFiltersOpenChange?: (open: boolean) => void;
  showFilterPanel?: boolean;
  filtersLabel?: string;
  clearFiltersLabel?: string;
  filterDesign?: DesignPreset;
  filterSurface?: SurfaceMode;
  filterClassName?: string;
  filterClassNames?: TableFiltersClassNames;
  pageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  selectable?: boolean;
  getRowId?: (item: T, index: number) => string;
  actions?: (item: T) => ReactNode;
  rowActions?: DataTableRowActions<T>;
  actionsVariant?: TableActionsVariant;
  actionsDesign?: DesignPreset;
  actionsClassName?: string;
  actionClassNames?: TableActionsClassNames;
  filters?: ReactNode;
  design?: DesignPreset;
  surface?: SurfaceMode;
  tableSurface?: SurfaceMode;
  className?: string;
}
