import type { HTMLAttributes, ReactNode } from "react";

import {
  controlDesignStyles,
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface DescriptionListProps
  extends HTMLAttributes<HTMLDListElement> {
  columns?: 1 | 2 | 3;
  divided?: boolean;
  design?: DesignPreset;
}

const columns: Record<
  NonNullable<DescriptionListProps["columns"]>,
  string
> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

export function DescriptionList({
  columns: columnCount = 1,
  divided = false,
  design,
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      className={cn(
        "grid gap-4",
        columns[columnCount],
        divided && "divide-y divide-border [&>*]:pb-4",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface DescriptionItemProps extends HTMLAttributes<HTMLDivElement> {
  term: ReactNode;
  details: ReactNode;
  icon?: ReactNode;
  orientation?: "vertical" | "horizontal";
  design?: DesignPreset;
}

export function DescriptionItem({
  term,
  details,
  icon,
  orientation = "vertical",
  design,
  className,
  ...props
}: DescriptionItemProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal" &&
          "flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4",
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    >
      <dt className="flex min-w-0 items-center gap-2 break-words text-xs font-bold text-muted">
        {icon}
        {term}
      </dt>
      <dd
        className={cn(
          "text-sm font-extrabold text-foreground",
          orientation === "vertical" && "mt-1",
          orientation === "horizontal" && "min-w-0 break-words text-left sm:text-right",
        )}
      >
        {details}
      </dd>
    </div>
  );
}

export interface KeyValueProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  supportingText?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  design?: DesignPreset;
}

export function KeyValue({
  label,
  value,
  supportingText,
  leading,
  trailing,
  design,
  className,
  ...props
}: KeyValueProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-3",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      {leading && (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          {leading}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-muted">{label}</p>
        <p className="truncate text-sm font-extrabold text-foreground">
          {value}
        </p>
        {supportingText && (
          <p className="mt-0.5 text-[11px] text-muted">{supportingText}</p>
        )}
      </div>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </div>
  );
}
