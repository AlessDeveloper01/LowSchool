import type { HTMLAttributes, ReactNode } from "react";
import { LuDot } from "react-icons/lu";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface ActivityFeedProps
  extends HTMLAttributes<HTMLOListElement> {
  lineClassName?: string;
  design?: DesignPreset;
}

export function ActivityFeed({
  lineClassName,
  design,
  className,
  children,
  ...props
}: ActivityFeedProps) {
  return (
    <ol
      className={cn(
        "relative min-w-0 max-w-full space-y-0 before:absolute before:top-5 before:bottom-5 before:left-[1.1875rem] before:w-px before:bg-border",
        lineClassName,
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      {children}
    </ol>
  );
}

export type ActivityEventVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "customized";

export interface ActivityEventProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: ReactNode;
  meta?: ReactNode;
  variant?: ActivityEventVariant;
  iconClassName?: string;
  contentClassName?: string;
  design?: DesignPreset;
}

const activityColors: Record<ActivityEventVariant, string> = {
  default: "border-border bg-surface-hover text-muted",
  primary: "border-primary/20 bg-primary/10 text-primary",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
  customized: "",
};

export function ActivityEvent({
  title,
  description,
  timestamp,
  icon,
  meta,
  variant = "default",
  iconClassName,
  contentClassName,
  design,
  className,
  ...props
}: ActivityEventProps) {
  return (
    <li
      className={cn("relative flex min-w-0 max-w-full items-start gap-3 pb-5", design && surfaceDesignStyles[design], className)}
      {...props}
    >
      <span
        className={cn(
          "relative z-10 grid size-10 shrink-0 place-items-center rounded-xl border text-base",
          activityColors[variant],
          iconClassName,
        )}
      >
        {icon ?? <LuDot aria-hidden="true" />}
      </span>
      <div className={cn("min-w-0 flex-1 pt-0.5", contentClassName)}>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <p className="min-w-0 break-words text-sm font-extrabold text-foreground">{title}</p>
          {timestamp && (
            <span className="shrink-0 text-[10px] font-semibold text-muted">
              {timestamp}
            </span>
          )}
        </div>
        {description && (
          <div className="mt-1 break-words text-xs leading-5 text-muted">
            {description}
          </div>
        )}
        {meta && <div className="mt-2 min-w-0 max-w-full">{meta}</div>}
      </div>
    </li>
  );
}
