import {
  matchesTableFilters,
  matchesTableSearch,
} from "@/components/data-display/table-filter-logic";

import type { DataTableFilterGroup, TableFilterValues } from "./table-filters";

export type DataTableSortDirection = "asc" | "desc";

export interface IndexedDataTableRow<T> {
  item: T;
  sourceIndex: number;
}

interface ProcessDataTableRowsOptions<
  T extends object,
  FilterId extends string,
> {
  data: readonly T[];
  query: string;
  getSearchText?: (item: T) => string;
  searchPredicate?: (item: T, query: string) => boolean;
  filterGroups: readonly DataTableFilterGroup<T, FilterId>[];
  filterValues: TableFilterValues<FilterId>;
  sortKey?: string;
  sortDirection: DataTableSortDirection;
}

export function processDataTableRows<
  T extends object,
  FilterId extends string,
>({
  data,
  query,
  getSearchText,
  searchPredicate,
  filterGroups,
  filterValues,
  sortKey,
  sortDirection,
}: ProcessDataTableRowsOptions<T, FilterId>): IndexedDataTableRow<T>[] {
  const normalizedQuery = query.trim();
  const rows = data
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .filter(
      ({ item }) =>
        (!normalizedQuery ||
          (searchPredicate
            ? searchPredicate(item, query)
            : matchesTableSearch(item, query, getSearchText))) &&
        matchesTableFilters(item, filterGroups, filterValues),
    );

  if (!sortKey) {
    return rows;
  }

  return rows.sort((first, second) => {
    const firstValue = readDataTableValue(first.item, sortKey);
    const secondValue = readDataTableValue(second.item, sortKey);
    const comparison = String(firstValue ?? "").localeCompare(
      String(secondValue ?? ""),
      undefined,
      { numeric: true },
    );
    return sortDirection === "asc" ? comparison : -comparison;
  });
}

export function readDataTableValue<T extends object>(
  item: T,
  key: string,
): unknown {
  return Object.entries(item).find(([entryKey]) => entryKey === key)?.[1];
}
