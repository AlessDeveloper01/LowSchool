"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { LuBell, LuCheck, LuClock3, LuX } from "react-icons/lu";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type NotificationVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "customized";

export interface NotificationItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: ReactNode;
  avatar?: ReactNode;
  unread?: boolean;
  variant?: NotificationVariant;
  action?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  onRead?: () => void;
  iconClassName?: string;
  contentClassName?: string;
  actionClassName?: string;
  design?: DesignPreset;
}

const notificationStyles: Record<NotificationVariant, string> = {
  default: "bg-surface-hover text-muted",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  customized: "",
};

export function NotificationItem({
  title,
  description,
  timestamp,
  icon,
  avatar,
  unread = false,
  variant = "default",
  action,
  dismissible,
  onDismiss,
  onRead,
  iconClassName,
  contentClassName,
  actionClassName,
  design,
  className,
  ...props
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "group relative flex min-w-0 max-w-full items-start gap-3 rounded-2xl border border-border bg-surface p-3 transition-colors hover:bg-surface-hover/55",
        unread && "border-primary/25 bg-primary/5",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      {avatar ?? (
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl text-lg",
            notificationStyles[variant],
            iconClassName,
          )}
        >
          {icon ?? <LuBell aria-hidden="true" />}
        </span>
      )}
      <div className={cn("min-w-0 flex-1", contentClassName)}>
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-sm font-extrabold text-foreground">
            <span className="break-words">{title}</span>
          </p>
          {unread && (
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              aria-label="No leída"
            />
          )}
        </div>
        {description && (
          <div className="mt-0.5 break-words text-xs leading-5 text-muted">
            {description}
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {timestamp && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
              <LuClock3 aria-hidden="true" />
              {timestamp}
            </span>
          )}
          {unread && onRead && (
            <button
              type="button"
              onClick={onRead}
              className="inline-flex items-center gap-1 rounded text-[10px] font-extrabold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <LuCheck aria-hidden="true" />
              Marcar como leída
            </button>
          )}
        </div>
      </div>
      {action && (
        <div className={cn("max-w-full shrink-0", actionClassName)}>{action}</div>
      )}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="-m-1 grid size-10 shrink-0 place-items-center rounded-lg text-muted opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-primary sm:size-8"
          aria-label="Descartar notificación"
        >
          <LuX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
