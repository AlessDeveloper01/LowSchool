"use client";

import type { ReactNode } from "react";
import { LuArrowDownUp, LuCalendar, LuFilter, LuRotateCcw, LuX } from "react-icons/lu";

import { Chip } from "@/components/data-display/badge";
import { DateInput } from "@/components/forms/date-time-inputs";
import { Input } from "@/components/forms/input";
import { Button, type ButtonProps } from "@/components/ui/button";
import { DropdownMenu, type DropdownMenuItem } from "@/components/navigation/dropdown-menu";
import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface FilterBarProps {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  design?: DesignPreset;
  className?: string;
}

export function FilterBar({
  search,
  filters,
  actions,
  design,
  className,
}: FilterBarProps) {
  return <div className={cn("flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-3 lg:flex-row lg:items-center", design && navigationDesignStyles[design], className)}><div className="min-w-0 flex-1">{search}</div><div className="flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto [&>*]:max-w-full">{filters}{actions}</div></div>;
}

export function FilterButton({ count, ...props }: ButtonProps & { count?: number }) {
  return <Button variant="outline" leftIcon={<LuFilter />} {...props}>Filtros{count ? ` (${count})` : ""}</Button>;
}

export function FilterChip({
  label,
  onRemove,
  design,
  className,
}: {
  label: string;
  onRemove?: () => void;
  design?: DesignPreset;
  className?: string;
}) {
  return <Chip selected removable={Boolean(onRemove)} onRemove={onRemove} className={cn(design && navigationDesignStyles[design], className)}>{label}</Chip>;
}

export interface ActiveFilter {
  id: string;
  label: string;
}

export function ActiveFilters({
  filters,
  onRemove,
  onClear,
  design,
  className,
}: {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClear?: () => void;
  design?: DesignPreset;
  className?: string;
}) {
  if (filters.length === 0) return null;
  return <div className={cn("flex flex-wrap items-center gap-2", design && navigationDesignStyles[design], design && "p-2", className)}>{filters.map((filter) => <FilterChip key={filter.id} label={filter.label} onRemove={() => onRemove(filter.id)} />)}{onClear && <ClearFiltersButton onClick={onClear} />}</div>;
}

export function SortButton({
  items,
  label = "Ordenar",
  design,
  className,
}: {
  items: DropdownMenuItem[];
  label?: string;
  design?: DesignPreset;
  className?: string;
}) {
  return <DropdownMenu items={items} design={design} className={className} trigger={<Button variant="outline" leftIcon={<LuArrowDownUp />}>{label}</Button>} />;
}
export const SortMenu = DropdownMenu;
export function ClearFiltersButton(props: ButtonProps) { return <Button variant="ghost" size="sm" leftIcon={<LuRotateCcw />} {...props}>Limpiar</Button>; }

export interface DateFilterProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  design?: DesignPreset;
  className?: string;
}
export function DateFilter({
  label = "Fecha",
  value,
  onChange,
  design,
  className,
}: DateFilterProps) { return <DateInput label={label} value={value} onChange={(event) => onChange?.(event.target.value)} leftIcon={<LuCalendar />} design={design} className={className} />; }

export interface RangeFilterProps {
  min?: number;
  max?: number;
  value?: { min?: number; max?: number };
  onChange?: (value: { min?: number; max?: number }) => void;
  design?: DesignPreset;
  className?: string;
}
export function RangeFilter({
  min,
  max,
  value = {},
  onChange,
  design,
  className,
}: RangeFilterProps) {
  return <div className={cn("grid grid-cols-2 gap-2", design && navigationDesignStyles[design], design && "p-2", className)}><Input type="number" placeholder="Mínimo" min={min} max={max} value={value.min ?? ""} onChange={(event) => onChange?.({ ...value, min: event.target.value ? Number(event.target.value) : undefined })} /><Input type="number" placeholder="Máximo" min={min} max={max} value={value.max ?? ""} onChange={(event) => onChange?.({ ...value, max: event.target.value ? Number(event.target.value) : undefined })} /></div>;
}

export function RemoveFilterButton({
  onClick,
  design,
  className,
}: {
  onClick: () => void;
  design?: DesignPreset;
  className?: string;
}) {
  return <button type="button" onClick={onClick} className={cn(design && navigationDesignStyles[design], className)} aria-label="Quitar filtro"><LuX /></button>;
}
