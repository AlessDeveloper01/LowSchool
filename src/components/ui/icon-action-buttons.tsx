import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";

export interface IconTextButtonProps
  extends Omit<ButtonProps, "children" | "leftIcon" | "rightIcon"> {
  icon: ReactNode;
  children: ReactNode;
  iconPosition?: "left" | "right";
}

export function IconTextButton({
  icon,
  iconPosition = "left",
  children,
  ...props
}: IconTextButtonProps) {
  const accessibleIcon = <span aria-hidden="true">{icon}</span>;

  return (
    <Button
      leftIcon={iconPosition === "left" ? accessibleIcon : undefined}
      rightIcon={iconPosition === "right" ? accessibleIcon : undefined}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface ShortcutButtonProps
  extends Omit<ButtonProps, "children" | "rightIcon"> {
  children: ReactNode;
  shortcut: string | readonly string[];
}

export function ShortcutButton({
  shortcut,
  children,
  variant = "outline",
  ...props
}: ShortcutButtonProps) {
  const keys = typeof shortcut === "string" ? [shortcut] : shortcut;

  return (
    <Button
      variant={variant}
      rightIcon={
        <span className="ml-1 inline-flex gap-1" aria-hidden="true">
          {keys.map((key, index) => (
            <Kbd key={`${key}-${index}`}>{key}</Kbd>
          ))}
        </span>
      }
      {...props}
    >
      {children}
    </Button>
  );
}

export interface ToolbarButtonProps
  extends Omit<ButtonProps, "children" | "leftIcon" | "rightIcon"> {
  icon: ReactNode;
  label: string;
  active?: boolean;
  showLabel?: boolean;
}

export function ToolbarButton({
  icon,
  label,
  active = false,
  showLabel = false,
  variant,
  size,
  ...props
}: ToolbarButtonProps) {
  return (
    <Button
      variant={variant ?? (active ? "soft" : "ghost")}
      size={size ?? (showLabel ? "sm" : "icon")}
      leftIcon={<span aria-hidden="true">{icon}</span>}
      aria-label={showLabel ? undefined : label}
      aria-pressed={active}
      {...props}
    >
      {showLabel ? label : undefined}
    </Button>
  );
}

export interface ProviderButtonProps
  extends Omit<ButtonProps, "children" | "leftIcon"> {
  providerName: string;
  icon: ReactNode;
  children?: ReactNode;
}

export function ProviderButton({
  providerName,
  icon,
  children,
  variant = "outline",
  fullWidth = true,
  ...props
}: ProviderButtonProps) {
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      leftIcon={<span aria-hidden="true">{icon}</span>}
      {...props}
    >
      {children ?? `Continuar con ${providerName}`}
    </Button>
  );
}

export interface NotificationButtonProps
  extends Omit<ButtonProps, "children" | "leftIcon" | "rightIcon"> {
  icon: ReactNode;
  label: string;
  count?: number;
  maxCount?: number;
  dot?: boolean;
}

export function NotificationButton({
  icon,
  label,
  count = 0,
  maxCount = 99,
  dot = false,
  variant = "ghost",
  className,
  ...props
}: NotificationButtonProps) {
  const normalizedMaxCount = Math.max(1, maxCount);
  const visibleCount = count > 0 ? Math.min(count, normalizedMaxCount) : 0;
  const counterLabel =
    count > normalizedMaxCount ? `${normalizedMaxCount}+` : String(visibleCount);
  const notificationText =
    count > 0
      ? `, ${count} notificaciones`
      : dot
        ? ", tiene notificaciones nuevas"
        : "";

  return (
    <Button
      variant={variant}
      size="icon"
      shape="pill"
      aria-label={`${label}${notificationText}`}
      className={cn("relative", className)}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
      {(dot || visibleCount > 0) && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-0.5 top-0.5 rounded-full bg-danger ring-2 ring-surface",
            dot ? "size-2.5" : "min-w-4 px-1 py-0.5 text-[9px] leading-none text-danger-foreground",
          )}
        >
          {dot ? null : counterLabel}
        </span>
      )}
    </Button>
  );
}
