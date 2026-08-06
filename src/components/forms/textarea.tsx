"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from "react";

import type { InputSize, InputVariant } from "@/components/forms/input";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  design?: DesignPreset;
  variant?: InputVariant;
  textareaSize?: InputSize;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  showCount?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const variants: Record<InputVariant, string> = {
  outline: "border border-border bg-surface focus:border-primary focus:ring-3 focus:ring-primary/10",
  filled: "border border-transparent bg-background focus:border-primary/40",
  underlined: "rounded-none border-b border-border bg-transparent focus:border-primary",
  soft: "border border-primary/10 bg-primary/5 focus:border-primary/40",
  minimal: "border border-transparent bg-transparent hover:bg-surface-hover focus:bg-surface",
  glass:
    "border border-white/25 bg-surface/70 backdrop-blur-xl focus:border-primary/50 focus:ring-3 focus:ring-primary/10",
  elevated:
    "border border-border/60 bg-surface shadow-md shadow-foreground/5 focus:border-primary/40 focus:shadow-lg",
  contrast:
    "border border-foreground bg-foreground text-background placeholder:text-background/55 focus:ring-3 focus:ring-secondary/25",
  customized: "bg-transparent",
};

const sizes: Record<InputSize, string> = {
  sm: "min-h-20 px-2.5 py-2 text-xs",
  md: "min-h-28 px-3 py-2.5 text-sm",
  lg: "min-h-36 px-3.5 py-3 text-base",
};

const resizeStyles = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      design,
      variant = "outline",
      textareaSize = "md",
      label,
      description,
      error,
      success,
      showCount = false,
      resize = "vertical",
      maxLength,
      value,
      defaultValue,
      onChange,
      className,
      id,
      required,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const [internalCount, setInternalCount] = useState(String(defaultValue ?? "").length);
    const count = value === undefined ? internalCount : String(value).length;
    const message = error ?? success ?? description;

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
      setInternalCount(event.target.value.length);
      onChange?.(event);
    }

    return (
      <div className="w-full">
        {label && <label htmlFor={textareaId} className="mb-1.5 block text-xs font-extrabold text-foreground">{label}{required && <span className="ml-1 text-danger">*</span>}</label>}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-lg font-semibold text-foreground outline-none transition-all duration-150 placeholder:font-normal placeholder:text-muted/70 disabled:opacity-50",
            variants[variant],
            sizes[textareaSize],
            design && controlDesignStyles[design],
            resizeStyles[resize],
            error && "border-danger focus:border-danger focus:ring-danger/10",
            success && "border-success focus:border-success focus:ring-success/10",
            className,
          )}
          {...props}
        />
        {(message || showCount) && (
          <div className="mt-1.5 flex justify-between gap-3 text-xs">
            <span className={cn(error && "text-danger", success && "text-success", !error && !success && "text-muted")}>{message}</span>
            {showCount && <span className="shrink-0 text-muted">{count}{maxLength ? ` / ${maxLength}` : ""}</span>}
          </div>
        )}
      </div>
    );
  },
);
