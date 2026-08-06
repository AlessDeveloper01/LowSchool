import type { MouseEvent } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

import type {
  TableAction,
  TableActionsClassNames,
  TableActionsVariant,
} from "./table-actions.types";

interface TableActionControlProps {
  action: TableAction;
  variant: Exclude<TableActionsVariant, "dropdown">;
  design?: DesignPreset;
  classNames?: TableActionsClassNames;
}

export function TableActionControl({
  action,
  variant,
  design,
  classNames,
}: TableActionControlProps) {
  const classes = cn(
    "font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    variant === "icons"
      ? "grid size-9 shrink-0 place-items-center rounded-lg"
      : "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs",
    action.destructive
      ? "text-danger hover:bg-danger/10"
      : "text-foreground hover:bg-surface-hover",
    action.disabled && "pointer-events-none opacity-45",
    design && controlDesignStyles[design],
    classNames?.action,
  );
  const content = (
    <>
      {action.icon ? (
        <span
          className={cn(
            "grid size-4 shrink-0 place-items-center",
            classNames?.icon,
          )}
          aria-hidden="true"
        >
          {action.icon}
        </span>
      ) : (
        variant === "icons" && (
          <span
            className={cn("text-[10px] font-extrabold", classNames?.icon)}
            aria-hidden="true"
          >
            {action.label.slice(0, 2).toLocaleUpperCase()}
          </span>
        )
      )}
      {variant === "buttons" && (
        <span className={classNames?.label}>{action.label}</span>
      )}
    </>
  );

  function select(
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ): void {
    if (action.disabled) {
      event.preventDefault();
      return;
    }
    action.onSelect?.();
  }

  if (action.href && !action.disabled) {
    return (
      <a
        href={action.href}
        aria-label={action.label}
        className={classes}
        onClick={select}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={action.label}
      disabled={action.disabled}
      className={classes}
      onClick={select}
    >
      {content}
    </button>
  );
}
