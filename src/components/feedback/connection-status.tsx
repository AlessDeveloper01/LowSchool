import type { HTMLAttributes, ReactNode } from "react";
import {
  LuCircleAlert,
  LuCloudOff,
  LuEllipsis,
  LuWifi,
} from "react-icons/lu";

import {
  controlDesignStyles,
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface ConnectionStatusProps
  extends HTMLAttributes<HTMLDivElement> {
  status?: "connected" | "connecting" | "disconnected" | "error";
  label?: string;
  description?: string;
  compact?: boolean;
  action?: ReactNode;
  iconClassName?: string;
  contentClassName?: string;
  design?: DesignPreset;
}

const connectionStates = {
  connected: {
    label: "Conectado",
    description: "Todos los servicios están disponibles.",
    icon: LuWifi,
    color: "text-success",
    background: "bg-success/10",
  },
  connecting: {
    label: "Conectando",
    description: "Restableciendo la conexión.",
    icon: LuEllipsis,
    color: "text-info",
    background: "bg-info/10",
  },
  disconnected: {
    label: "Sin conexión",
    description: "Comprueba tu conexión a internet.",
    icon: LuCloudOff,
    color: "text-muted",
    background: "bg-surface-hover",
  },
  error: {
    label: "Error de conexión",
    description: "No fue posible sincronizar los cambios.",
    icon: LuCircleAlert,
    color: "text-danger",
    background: "bg-danger/10",
  },
} satisfies Record<
  NonNullable<ConnectionStatusProps["status"]>,
  {
    label: string;
    description: string;
    icon: typeof LuWifi;
    color: string;
    background: string;
  }
>;

export function ConnectionStatus({
  status = "connected",
  label,
  description,
  compact = false,
  action,
  iconClassName,
  contentClassName,
  design,
  className,
  ...props
}: ConnectionStatusProps) {
  const config = connectionStates[status];
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex max-w-full flex-wrap items-center gap-2 rounded-full px-3 py-1.5",
          config.background,
          config.color,
          design && controlDesignStyles[design],
          className,
        )}
        role="status"
        {...props}
      >
        <Icon
          className={cn(
            "text-sm",
            status === "connecting" && "animate-pulse",
            iconClassName,
          )}
          aria-hidden="true"
        />
        <span className="text-[11px] font-extrabold">
          {label ?? config.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-3 min-[400px]:flex-row min-[400px]:items-center",
        design && surfaceDesignStyles[design],
        className,
      )}
      role="status"
      {...props}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl text-lg",
          config.background,
          config.color,
          iconClassName,
        )}
      >
        <Icon
          className={cn(status === "connecting" && "animate-pulse")}
          aria-hidden="true"
        />
      </span>
      <div className={cn("min-w-0 flex-1", contentClassName)}>
        <p className="text-sm font-extrabold text-foreground">
          {label ?? config.label}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-muted">
          {description ?? config.description}
        </p>
      </div>
      {action && <div className="w-full min-w-0 min-[400px]:w-auto min-[400px]:shrink-0">{action}</div>}
    </div>
  );
}
