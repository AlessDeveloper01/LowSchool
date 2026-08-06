"use client";

import { useMemo, useState } from "react";

import {
  processDataTableRows,
  type DataTableSortDirection,
} from "@/components/data-display/data-table-logic";
import {
  createTableFilterCriteriaKey,
  emptyTableFilterValues,
} from "@/components/data-display/table-filter-logic";
import type { TableFilterValues } from "@/components/data-display/table-filters";

import type {
  DataTableColumn,
  DataTableProps,
} from "./data-table.types";

export function useDataTableController<
  T extends object,
  FilterId extends string = string,
>(props: DataTableProps<T, FilterId>) {
  const {
    data,
    searchValue,
    defaultSearchValue = "",
    onSearchValueChange,
    getSearchText,
    searchPredicate,
    filterGroups = [],
    filterValues,
    defaultFilterValues,
    onFilterValuesChange,
    pageSize: initialPageSize = 10,
    getRowId = defaultGetRowId,
  } = props;
  const [internalQuery, setInternalQuery] = useState(defaultSearchValue);
  const [internalFilterValues, setInternalFilterValues] =
    useState<TableFilterValues<FilterId>>(
      defaultFilterValues ?? emptyTableFilterValues<FilterId>(),
    );
  const [sortKey, setSortKey] = useState<string>();
  const [sortDirection, setSortDirection] =
    useState<DataTableSortDirection>("asc");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const query = searchValue ?? internalQuery;
  const currentFilterValues = filterValues ?? internalFilterValues;
  const criteriaKey = createTableFilterCriteriaKey(
    query,
    currentFilterValues,
  );
  const [pagination, setPagination] = useState({ page: 1, criteriaKey });
  const currentPage =
    pagination.criteriaKey === criteriaKey ? pagination.page : 1;

  const processedData = useMemo(
    () =>
      processDataTableRows({
        data,
        query,
        getSearchText,
        searchPredicate,
        filterGroups,
        filterValues: currentFilterValues,
        sortKey,
        sortDirection,
      }),
    [
      currentFilterValues,
      data,
      filterGroups,
      getSearchText,
      query,
      searchPredicate,
      sortDirection,
      sortKey,
    ],
  );

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = processedData.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const validIds = new Set(
    data.map((item, sourceIndex) => getRowId(item, sourceIndex)),
  );
  const currentSelectedIds = selectedIds.filter((id) => validIds.has(id));
  const allPageIds = pageData.map(({ item, sourceIndex }) =>
    getRowId(item, sourceIndex),
  );
  const allSelected =
    allPageIds.length > 0 &&
    allPageIds.every((id) => currentSelectedIds.includes(id));
  const pageHasSelection = allPageIds.some((id) =>
    currentSelectedIds.includes(id),
  );
  const hasFilterGroups = filterGroups.some(
    (group) =>
      !group.hidden && group.options.some((option) => !option.hidden),
  );

  function setCurrentPage(page: number): void {
    setPagination({ page, criteriaKey });
  }

  function commitQuery(nextQuery: string): void {
    if (searchValue === undefined) setInternalQuery(nextQuery);
    onSearchValueChange?.(nextQuery);
  }

  function commitFilterValues(
    nextValues: TableFilterValues<FilterId>,
  ): void {
    if (filterValues === undefined) setInternalFilterValues(nextValues);
    onFilterValuesChange?.(nextValues);
  }

  function sort(column: DataTableColumn<T>): void {
    if (!column.sortable) return;
    const key = String(column.key);
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  function togglePage(): void {
    setSelectedIds((current) => {
      const validCurrent = current.filter((id) => validIds.has(id));
      return allSelected
        ? validCurrent.filter((id) => !allPageIds.includes(id))
        : Array.from(new Set([...validCurrent, ...allPageIds]));
    });
  }

  function toggleRow(rowId: string, selected: boolean): void {
    setSelectedIds((current) => {
      const validCurrent = current.filter((id) => validIds.has(id));
      return selected
        ? validCurrent.filter((id) => id !== rowId)
        : [...validCurrent, rowId];
    });
  }

  function changePageSize(nextPageSize: number): void {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

  return {
    query,
    filterGroups,
    currentFilterValues,
    processedData,
    pageData,
    pageSize,
    totalPages,
    safePage,
    currentSelectedIds,
    allSelected,
    pageHasSelection,
    hasFilterGroups,
    getRowId,
    sortKey,
    sortDirection,
    commitQuery,
    commitFilterValues,
    sort,
    togglePage,
    toggleRow,
    setCurrentPage,
    changePageSize,
  };
}

function defaultGetRowId<T>(_item: T, index: number): string {
  return String(index);
}
