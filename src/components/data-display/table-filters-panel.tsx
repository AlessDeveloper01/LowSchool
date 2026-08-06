import type { KeyboardEvent } from "react";

import { TableFilterGroupControl } from "@/components/data-display/table-filter-group";
import { setTableFilterValue } from "@/components/data-display/table-filter-logic";
import {
  surfaceDesignStyles,
  type DesignPreset,
  type SurfaceMode,
} from "@/components/types";
import { cn } from "@/lib/cn";

import type {
  TableFilterGroup,
  TableFiltersClassNames,
  TableFilterValue,
  TableFilterValues,
} from "./table-filters.types";

interface TableFiltersPanelProps<GroupId extends string> {
  id: string;
  label: string;
  labelledBy?: string;
  groups: readonly TableFilterGroup<GroupId>[];
  values: TableFilterValues<GroupId>;
  onValuesChange: (values: TableFilterValues<GroupId>) => void;
  onEscape?: () => void;
  design?: DesignPreset;
  surface: SurfaceMode;
  classNames?: TableFiltersClassNames;
}

export function TableFiltersPanel<GroupId extends string>({
  id,
  label,
  labelledBy,
  groups,
  values,
  onValuesChange,
  onEscape,
  design,
  surface,
  classNames,
}: TableFiltersPanelProps<GroupId>) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== "Escape" || !onEscape) {
      return;
    }
    event.preventDefault();
    onEscape();
  }

  return (
    <div
      id={id}
      role="region"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      className={cn(
        "grid min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-3",
        surface === "contained" &&
          "rounded-xl border border-border bg-surface p-3",
        surface === "contained" && design && surfaceDesignStyles[design],
        surface === "plain" &&
          "rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none",
        classNames?.panel,
      )}
    >
      {groups.map((group, index) => (
        <TableFilterGroupControl
          key={group.id}
          group={group}
          value={values[group.id]}
          onValueChange={(value: TableFilterValue) =>
            onValuesChange(setTableFilterValue(values, group.id, value))
          }
          design={design}
          classNames={classNames}
          selectId={`${id}-group-${index}`}
        />
      ))}
    </div>
  );
}
