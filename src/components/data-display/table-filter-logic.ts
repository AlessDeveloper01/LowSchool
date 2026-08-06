import type {
  DataTableFilterGroup,
  TableFilterComparable,
  TableFilterGroup,
  TableFilterValue,
  TableFilterValues,
} from "./table-filters.types";

const EMPTY_FILTER_VALUES = Object.freeze({});

export function emptyTableFilterValues<
  GroupId extends string,
>(): TableFilterValues<GroupId> {
  return EMPTY_FILTER_VALUES as TableFilterValues<GroupId>;
}

export function createTableFilterCriteriaKey<GroupId extends string>(
  query: string,
  values: TableFilterValues<GroupId>,
): string {
  const entries = Object.entries<TableFilterValue | undefined>(values)
    .filter((entry): entry is [string, TableFilterValue] =>
      entry[1] !== undefined,
    )
    .map(([groupId, value]) => [
      groupId,
      Array.isArray(value) ? [...value].sort() : value,
    ])
    .sort(([firstId], [secondId]) =>
      String(firstId).localeCompare(String(secondId)),
    );
  return JSON.stringify([query.trim().toLocaleLowerCase(), entries]);
}

export function countActiveTableFilters<GroupId extends string>(
  values: TableFilterValues<GroupId>,
  groups?: readonly TableFilterGroup<GroupId>[],
): number {
  if (groups) {
    return groups.reduce(
      (total, group) =>
        total + (group.hidden ? 0 : selectedValuesForGroup(group, values).length),
      0,
    );
  }

  return Object.values<TableFilterValue | undefined>(values).reduce(
    (total, value) => total + selectedValues(value).length,
    0,
  );
}

export function hasActiveTableFilters<GroupId extends string>(
  values: TableFilterValues<GroupId>,
  groups?: readonly TableFilterGroup<GroupId>[],
): boolean {
  return countActiveTableFilters(values, groups) > 0;
}

export function setTableFilterValue<GroupId extends string>(
  values: TableFilterValues<GroupId>,
  groupId: GroupId,
  value: TableFilterValue,
): TableFilterValues<GroupId> {
  const nextValues: Partial<Record<GroupId, TableFilterValue>> = {
    ...values,
  };
  const isEmpty = Array.isArray(value) ? value.length === 0 : value.length === 0;

  if (isEmpty) {
    delete nextValues[groupId];
  } else {
    nextValues[groupId] = value;
  }

  return nextValues;
}

export function filterTableRows<T, GroupId extends string>(
  rows: readonly T[],
  groups: readonly DataTableFilterGroup<T, GroupId>[],
  values: TableFilterValues<GroupId>,
): T[] {
  return rows.filter((row) => matchesTableFilters(row, groups, values));
}

export function matchesTableFilters<T, GroupId extends string>(
  row: T,
  groups: readonly DataTableFilterGroup<T, GroupId>[],
  values: TableFilterValues<GroupId>,
): boolean {
  return groups.every((group) => {
    if (group.hidden) {
      return true;
    }
    const selected = selectedValuesForGroup(group, values);
    if (selected.length === 0) {
      return true;
    }
    const rowValues = comparableValues(group.getValue(row));
    return selected.some((value) => rowValues.includes(value));
  });
}

export function matchesTableSearch<T extends object>(
  row: T,
  query: string,
  getSearchText?: (row: T) => string,
): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  if (getSearchText) {
    return getSearchText(row).toLocaleLowerCase().includes(normalizedQuery);
  }

  return Object.values(row).some((value) =>
    String(value ?? "").toLocaleLowerCase().includes(normalizedQuery),
  );
}

function selectedValues(value: TableFilterValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return typeof value === "string" && value ? [value] : [];
}

function selectedValuesForGroup<GroupId extends string>(
  group: TableFilterGroup<GroupId>,
  values: TableFilterValues<GroupId>,
): string[] {
  const availableValues = new Set(
    group.options
      .filter((option) => !option.hidden)
      .map((option) => option.value),
  );
  return selectedValues(values[group.id]).filter((value) =>
    availableValues.has(value),
  );
}

function comparableValues(
  value:
    | TableFilterComparable
    | readonly TableFilterComparable[]
    | null
    | undefined,
): string[] {
  if (value === null || value === undefined) {
    return [];
  }
  return (Array.isArray(value) ? value : [value]).map(String);
}
