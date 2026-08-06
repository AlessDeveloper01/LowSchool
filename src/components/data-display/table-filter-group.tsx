import type { ChangeEvent } from "react";
import { LuChevronDown } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

import type {
  TableFilterGroup,
  TableFilterValue,
  TableFiltersClassNames,
} from "./table-filters.types";

interface TableFilterGroupControlProps<GroupId extends string> {
  group: TableFilterGroup<GroupId>;
  value?: TableFilterValue;
  onValueChange: (value: TableFilterValue) => void;
  design?: DesignPreset;
  classNames?: TableFiltersClassNames;
  selectId: string;
}

export function TableFilterGroupControl<GroupId extends string>({
  group,
  value,
  onValueChange,
  design,
  classNames,
  selectId,
}: TableFilterGroupControlProps<GroupId>) {
  const visibleOptions = group.options.filter((option) => !option.hidden);
  const selectedValue = Array.isArray(value) ? value : value ? [value] : [];

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    if (group.multiple) {
      onValueChange(
        Array.from(
          event.currentTarget.selectedOptions,
          (option) => option.value,
        ),
      );
      return;
    }
    onValueChange(event.currentTarget.value);
  }

  if (group.multiple) {
    return (
      <fieldset className={cn("min-w-0 space-y-1.5", classNames?.group)}>
        <legend
          className={cn(
            "text-xs font-extrabold text-foreground",
            classNames?.label,
          )}
        >
          {group.label}
        </legend>
        <div
          className={cn("flex min-w-0 flex-wrap gap-2", classNames?.options)}
        >
          {visibleOptions.map((option) => {
            const selected = selectedValue.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                disabled={option.disabled}
                onClick={() =>
                  onValueChange(
                    selected
                      ? selectedValue.filter(
                          (selectedOption) =>
                            selectedOption !== option.value,
                        )
                      : [...selectedValue, option.value],
                  )
                }
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-3 text-xs font-bold text-muted sm:min-h-9",
                  "transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground",
                  "disabled:cursor-not-allowed disabled:opacity-45",
                  design && controlDesignStyles[design],
                  classNames?.option,
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={cn("min-w-0 space-y-1.5", classNames?.group)}>
      <label
        htmlFor={selectId}
        className={cn(
          "block text-xs font-extrabold text-foreground",
          classNames?.label,
        )}
      >
        {group.label}
      </label>
      <div className="relative min-w-0">
        <select
          id={selectId}
          value={selectedValue[0] ?? ""}
          onChange={handleChange}
          aria-label={group.label}
          className={cn(
            "h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-surface px-3 pr-9 text-sm font-semibold text-foreground outline-none sm:h-10",
            "transition-colors focus:border-primary focus:ring-3 focus:ring-primary/10",
            design && controlDesignStyles[design],
            classNames?.select,
          )}
        >
          <option value="">{group.placeholder ?? "Todas"}</option>
          {visibleOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <LuChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}
