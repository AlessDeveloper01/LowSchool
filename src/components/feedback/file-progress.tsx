"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { LuCheck, LuCircleAlert, LuFile, LuX } from "react-icons/lu";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

import {
  normalizeProgress,
  progressToneStyles,
  type ProgressTone,
} from "./progress-utils";

export interface FileProgressProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  value: number;
  sizeLabel?: string;
  status?: "uploading" | "complete" | "error";
  icon?: ReactNode;
  onCancel?: () => void;
  tone?: ProgressTone;
  iconClassName?: string;
  indicatorClassName?: string;
  actionClassName?: string;
  design?: DesignPreset;
}

export function FileProgress({
  name,
  value,
  sizeLabel,
  status = "uploading",
  icon,
  onCancel,
  tone = "primary",
  iconClassName,
  indicatorClassName,
  actionClassName,
  design,
  className,
  ...props
}: FileProgressProps) {
  const percent = normalizeProgress(value);
  const isComplete = status === "complete";
  const hasError = status === "error";

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-start gap-3 rounded-2xl border border-border bg-surface p-3",
        hasError && "border-danger/30",
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
          isComplete && "bg-success/10 text-success",
          hasError && "bg-danger/10 text-danger",
          iconClassName,
        )}
      >
        {icon ??
          (isComplete ? (
            <LuCheck aria-hidden="true" />
          ) : hasError ? (
            <LuCircleAlert aria-hidden="true" />
          ) : (
            <LuFile aria-hidden="true" />
          ))}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-foreground">
              {name}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-muted">
              {hasError
                ? "Error al cargar"
                : isComplete
                  ? "Carga completada"
                  : `${percent}%${sizeLabel ? ` · ${sizeLabel}` : ""}`}
            </p>
          </div>
          {onCancel && status === "uploading" && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "-m-1 grid size-10 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary sm:size-8",
                actionClassName,
              )}
              aria-label={`Cancelar carga de ${name}`}
            >
              <LuX aria-hidden="true" />
            </button>
          )}
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-hover"
          role="progressbar"
          aria-label={`Carga de ${name}`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className={cn(
              "block h-full rounded-full transition-[width] duration-300",
              progressToneStyles[tone],
              isComplete && "bg-success",
              hasError && "bg-danger",
              indicatorClassName,
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
