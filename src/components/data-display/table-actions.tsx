"use client";

import { LuEllipsis } from "react-icons/lu";

import { TableActionControl } from "@/components/data-display/table-action-control";
import { DropdownMenu } from "@/components/navigation/dropdown-menu";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

import type {
  TableAction,
  TableActionsClassNames,
  TableActionsProps,
} from "./table-actions.types";

export type {
  TableAction,
  TableActionsClassNames,
  TableActionsProps,
  TableActionsVariant,
} from "./table-actions.types";

export function TableActions({
  actions,
  variant = "icons",
  design,
  align = "end",
  dropdownLabel = "Más acciones",
  ariaLabel = "Acciones de fila",
  className,
  classNames,
}: TableActionsProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <DropdownTableActions
        actions={visibleActions}
        design={design}
        align={align}
        label={dropdownLabel}
        className={className}
        classNames={classNames}
      />
    );
  }

  return (
    <div
      className={cn(
        variant === "buttons"
          ? "flex flex-col items-stretch gap-1.5 sm:flex-row sm:flex-nowrap sm:items-center"
          : "flex flex-wrap items-center gap-1.5",
        align === "end" ? "justify-end" : "justify-start",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      {visibleActions.map((action) => {
        const control = (
          <TableActionControl
            action={action}
            variant={variant}
            design={design}
            classNames={classNames}
          />
        );

        return variant === "icons" ? (
          <Tooltip key={action.id} label={action.label} variant="compact">
            {control}
          </Tooltip>
        ) : (
          <span
            key={action.id}
            className="inline-flex w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto"
          >
            {control}
          </span>
        );
      })}
    </div>
  );
}

interface DropdownTableActionsProps {
  actions: readonly TableAction[];
  design?: DesignPreset;
  align: "start" | "end";
  label: string;
  className?: string;
  classNames?: TableActionsClassNames;
}

function DropdownTableActions({
  actions,
  design,
  align,
  label,
  className,
  classNames,
}: DropdownTableActionsProps) {
  return (
    <div
      className={cn(
        "inline-flex",
        align === "end" ? "justify-end" : "justify-start",
        className,
      )}
    >
      <DropdownMenu
        align={align === "end" ? "right" : "left"}
        design={design}
        className={cn(
          "border-border bg-surface text-foreground shadow-xl shadow-foreground/15 backdrop-blur-none",
          classNames?.menu,
        )}
        items={actions.map((action) => ({
          id: action.id,
          label: action.label,
          icon: action.icon,
          href: action.href,
          onSelect: action.onSelect,
          disabled: action.disabled,
          destructive: action.destructive,
          className: classNames?.action,
          iconClassName: classNames?.icon,
          labelClassName: classNames?.label,
        }))}
        trigger={
          <button
            type="button"
            aria-label={label}
            className={cn(
              "grid size-9 place-items-center rounded-lg text-muted",
              "transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              design && controlDesignStyles[design],
              classNames?.trigger,
            )}
          >
            <LuEllipsis aria-hidden="true" />
          </button>
        }
      />
    </div>
  );
}
