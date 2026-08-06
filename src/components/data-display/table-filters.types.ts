import type { DesignPreset, SurfaceMode } from "@/components/types";

export type TableFilterComparable = string | number | boolean;
export type TableFilterValue = string | readonly string[];
export type TableFilterValues<GroupId extends string = string> = Readonly<
  Partial<Record<GroupId, TableFilterValue>>
>;

export interface TableFilterOption {
  value: string;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
}

interface TableFilterGroupBase<GroupId extends string> {
  id: GroupId;
  label: string;
  options: readonly TableFilterOption[];
  placeholder?: string;
  hidden?: boolean;
}

export interface TableSingleFilterGroup<
  GroupId extends string = string,
> extends TableFilterGroupBase<GroupId> {
  multiple?: false;
}

export interface TableMultipleFilterGroup<
  GroupId extends string = string,
> extends TableFilterGroupBase<GroupId> {
  multiple: true;
}

export type TableFilterGroup<GroupId extends string = string> =
  | TableSingleFilterGroup<GroupId>
  | TableMultipleFilterGroup<GroupId>;

export type DataTableFilterGroup<
  T,
  GroupId extends string = string,
> = TableFilterGroup<GroupId> & {
  getValue: (
    item: T,
  ) =>
    | TableFilterComparable
    | readonly TableFilterComparable[]
    | null
    | undefined;
};

export interface TableFiltersClassNames {
  toolbar?: string;
  search?: string;
  controls?: string;
  trigger?: string;
  counter?: string;
  clear?: string;
  panel?: string;
  group?: string;
  label?: string;
  select?: string;
  options?: string;
  option?: string;
}

export interface TableFiltersProps<GroupId extends string = string> {
  groups?: readonly TableFilterGroup<GroupId>[];
  values?: TableFilterValues<GroupId>;
  defaultValues?: TableFilterValues<GroupId>;
  onValuesChange?: (values: TableFilterValues<GroupId>) => void;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showPanel?: boolean;
  filtersLabel?: string;
  clearLabel?: string;
  design?: DesignPreset;
  surface?: SurfaceMode;
  className?: string;
  classNames?: TableFiltersClassNames;
}
