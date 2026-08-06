"use client";

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
} from "react";
import { LuChevronDown } from "react-icons/lu";

import { Input, type InputProps } from "@/components/forms/input";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  design?: DesignPreset;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  selectSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizes = {
  sm: "h-9 px-2.5 text-xs",
  md: "h-11 px-3 text-sm",
  lg: "h-12 px-3.5 text-base",
};

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      design,
      options = [],
      groups = [],
      placeholder,
      label,
      description,
      error,
      selectSize = "md",
      fullWidth = true,
      className,
      id,
      required,
      children,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className={fullWidth ? "w-full" : "inline-block"}>
        {label && <label htmlFor={selectId} className="mb-1.5 block text-xs font-extrabold text-foreground">{label}{required && <span className="ml-1 text-danger">*</span>}</label>}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={Boolean(error)}
            className={cn(
              "w-full appearance-none rounded-lg border border-border bg-surface pr-9 font-semibold text-foreground outline-none transition-all duration-150",
              "focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
              sizes[selectSize],
              design && controlDesignStyles[design],
              error && "border-danger focus:border-danger focus:ring-danger/10",
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
            {groups.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</optgroup>)}
            {children}
          </select>
          <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        </div>
        {(error || description) && <p className={cn("mt-1.5 text-xs", error ? "text-danger" : "text-muted")}>{error ?? description}</p>}
      </div>
    );
  },
);

export const Select = NativeSelect;

export interface MultiSelectProps extends NativeSelectProps {
  visibleRows?: number;
}

export function MultiSelect({ visibleRows = 5, ...props }: MultiSelectProps) {
  return <NativeSelect multiple size={visibleRows} {...props} />;
}

export interface ComboboxProps extends Omit<InputProps, "list"> {
  options: SelectOption[];
  listId?: string;
}

export function Combobox({ options, listId, ...props }: ComboboxProps) {
  const generatedId = useId();
  const dataListId = listId ?? `${generatedId}-options`;
  return (
    <>
      <Input list={dataListId} {...props} />
      <datalist id={dataListId}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</datalist>
    </>
  );
}

export const Autocomplete = Combobox;
