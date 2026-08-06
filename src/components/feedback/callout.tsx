"use client";

import { LuX } from "react-icons/lu";

import { surfaceDesignStyles } from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import { calloutVariants } from "./callout-visuals";
import type { CalloutProps } from "./callout.types";

export type {
  CalloutAction,
  CalloutAppearance,
  CalloutProps,
  CalloutVariant,
} from "./callout.types";
export { Announcement } from "./announcement";
export type { AnnouncementProps } from "./announcement";

export function Callout({
  variant = "info",
  appearance = "soft",
  title,
  description,
  icon,
  eyebrow,
  primaryAction,
  secondaryAction,
  dismissible = false,
  onDismiss,
  iconClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  design,
  className,
  children,
  ...props
}: CalloutProps) {
  const visual = calloutVariants[variant];
  const isSolid = appearance === "solid";
  const isCustomized =
    appearance === "customized" || variant === "customized";

  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={cn(
        "relative flex min-w-0 max-w-full items-start gap-3 rounded-2xl p-3 sm:p-4",
        appearance === "soft" && visual.soft,
        appearance === "outline" && "border bg-surface",
        appearance === "outline" && visual.border,
        appearance === "solid" && visual.solid,
        appearance === "glass" &&
          "border bg-surface/70 backdrop-blur-xl",
        appearance === "glass" && visual.border,
        appearance === "minimal" && "border-l-2 py-2 pr-2 pl-4",
        appearance === "minimal" && visual.border,
        !isSolid && !isCustomized && visual.text,
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-current/10 text-lg",
          isSolid && "bg-white/15",
          iconClassName,
        )}
      >
        {icon ?? visual.icon}
      </span>
      <div className={cn("min-w-0 flex-1", contentClassName)}>
        {eyebrow && (
          <p
            className={cn(
              "mb-1 text-[10px] font-black tracking-[0.18em] uppercase",
              isSolid ? "opacity-75" : "text-muted",
            )}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <div
            className={cn(
              "font-extrabold",
              !isSolid && !isCustomized && "text-foreground",
              titleClassName,
            )}
          >
            {title}
          </div>
        )}
        {(description || children) && (
          <div
            className={cn(
              "text-sm leading-6",
              title && "mt-1",
              !isSolid && !isCustomized && "text-muted",
              isSolid && "opacity-85",
              descriptionClassName,
            )}
          >
            {description ?? children}
          </div>
        )}
        {(primaryAction || secondaryAction) && (
          <div
            className={cn(
              "mt-3 flex flex-wrap items-center gap-3",
              actionsClassName,
            )}
          >
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                  isSolid
                    ? "bg-white/15 hover:bg-white/25"
                    : "bg-current/10 hover:bg-current/15",
                )}
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="rounded text-xs font-extrabold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-current"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="-m-1 grid size-10 shrink-0 place-items-center rounded-lg opacity-70 transition-colors hover:bg-current/10 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current sm:size-8"
          aria-label="Cerrar mensaje"
        >
          <LuX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
