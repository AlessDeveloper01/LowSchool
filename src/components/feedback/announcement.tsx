"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { LuMegaphone, LuX } from "react-icons/lu";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface AnnouncementProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: "primary" | "gradient" | "neutral" | "customized";
  iconClassName?: string;
  contentClassName?: string;
  actionClassName?: string;
  design?: DesignPreset;
}

const announcementVariants = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  gradient:
    "border-primary/15 bg-gradient-to-r from-primary/12 via-secondary/8 to-tertiary/12 text-foreground",
  neutral: "border-border bg-surface text-foreground",
  customized: "",
} satisfies Record<
  NonNullable<AnnouncementProps["variant"]>,
  string
>;

export function Announcement({
  title,
  description,
  badge,
  icon,
  action,
  dismissible,
  onDismiss,
  variant = "gradient",
  iconClassName,
  contentClassName,
  actionClassName,
  design,
  className,
  ...props
}: AnnouncementProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-w-0 max-w-full flex-col items-stretch gap-3 rounded-2xl border px-3 py-3 sm:flex-row sm:items-center sm:px-4",
        announcementVariants[variant],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center self-start rounded-xl bg-current/10 text-lg",
          iconClassName,
        )}
      >
        {icon ?? <LuMegaphone aria-hidden="true" />}
      </span>
      <div className={cn("min-w-0 flex-1", contentClassName)}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-extrabold">{title}</p>
          {badge}
        </div>
        {description && (
          <div className="mt-0.5 text-xs leading-5 text-muted">
            {description}
          </div>
        )}
      </div>
      {action && (
        <div className={cn("w-full min-w-0 sm:w-auto sm:shrink-0", actionClassName)}>{action}</div>
      )}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="grid size-10 shrink-0 place-items-center self-start rounded-lg text-muted transition-colors hover:bg-current/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-current sm:size-8 sm:self-auto"
          aria-label="Cerrar anuncio"
        >
          <LuX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
