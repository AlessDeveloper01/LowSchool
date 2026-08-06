import type { HTMLAttributes } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type PresenceStatus =
  | "online"
  | "offline"
  | "busy"
  | "away"
  | "syncing"
  | "customized";

export interface StatusBeaconProps extends HTMLAttributes<HTMLSpanElement> {
  status?: PresenceStatus;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  label?: string;
  dotClassName?: string;
  design?: DesignPreset;
}

const presenceColors: Record<PresenceStatus, string> = {
  online: "bg-success",
  offline: "bg-muted",
  busy: "bg-danger",
  away: "bg-warning",
  syncing: "bg-info",
  customized: "",
};

const presenceSizes = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
} satisfies Record<NonNullable<StatusBeaconProps["size"]>, string>;

export function StatusBeacon({
  status = "online",
  size = "md",
  pulse = false,
  label,
  dotClassName,
  design,
  className,
  ...props
}: StatusBeaconProps) {
  return (
    <span
      className={cn("inline-flex max-w-full flex-wrap items-center gap-2", design && controlDesignStyles[design], className)}
      role="status"
      {...props}
    >
      <span className="relative flex shrink-0">
        {pulse && (
          <span
            className={cn(
              "absolute inset-0 animate-ping rounded-full opacity-35",
              presenceColors[status],
              dotClassName,
            )}
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            "relative rounded-full ring-2 ring-surface",
            presenceSizes[size],
            presenceColors[status],
            dotClassName,
          )}
          aria-hidden="true"
        />
      </span>
      {label && (
        <span className="min-w-0 break-words text-xs font-bold text-foreground">{label}</span>
      )}
      <span className="sr-only">Estado: {label ?? status}</span>
    </span>
  );
}
