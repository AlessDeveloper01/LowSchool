"use client";

import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  design?: DesignPreset;
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
}

export function InputGroup({
  design,
  orientation = "horizontal",
  attached = true,
  className,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        "flex w-full min-w-0 [&>*]:min-w-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        !attached && "gap-2",
        attached &&
          orientation === "horizontal" &&
          "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        attached &&
          orientation === "vertical" &&
          "[&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface InputAddonProps extends HTMLAttributes<HTMLSpanElement> {
  design?: DesignPreset;
  variant?: "default" | "soft" | "customized";
}

export function InputAddon({
  design,
  variant = "default",
  className,
  ...props
}: InputAddonProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center justify-center px-3 text-sm font-bold",
        variant === "default" && "border border-border bg-surface text-muted",
        variant === "soft" && "bg-primary/10 text-primary",
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export interface FloatingLabelInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  design?: DesignPreset;
  label: string;
  error?: string;
  containerClassName?: string;
}

export const FloatingLabelInput = forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(function FloatingLabelInput(
  {
    design,
    label,
    error,
    containerClassName,
    className,
    id,
    placeholder = " ",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("relative", containerClassName)}>
      <input
        ref={ref}
        id={inputId}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "peer h-14 w-full rounded-xl border border-border bg-surface px-3 pb-1 pt-5 text-sm font-semibold outline-none",
          "transition-all placeholder:text-transparent focus:border-primary focus:ring-3 focus:ring-primary/10",
          design && controlDesignStyles[design],
          error && "border-danger focus:border-danger focus:ring-danger/10",
          className,
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-3 top-2 text-[10px] font-extrabold text-muted transition-all",
          "peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-sm peer-placeholder-shown:font-semibold",
          "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-extrabold peer-focus:text-primary",
          error && "text-danger peer-focus:text-danger",
        )}
      >
        {label}
      </label>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
