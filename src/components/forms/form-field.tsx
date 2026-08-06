import type {
  FieldsetHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  design?: DesignPreset;
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  optional?: boolean;
  actions?: ReactNode;
}

export function FormField({
  design,
  label,
  htmlFor,
  description,
  error,
  optional,
  actions,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", design && controlDesignStyles[design], className)} {...props}>
      {(label || actions) && (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          {label && (
            <label
              htmlFor={htmlFor}
              className="text-xs font-extrabold text-foreground"
            >
              {label}
              {optional && (
                <span className="ml-1 font-medium text-muted">(opcional)</span>
              )}
            </label>
          )}
          {actions && <div className="max-w-full">{actions}</div>}
        </div>
      )}
      {children}
      {(error || description) && (
        <p className={cn("text-xs", error ? "text-danger" : "text-muted")}>
          {error ?? description}
        </p>
      )}
    </div>
  );
}

export interface FormSectionProps extends HTMLAttributes<HTMLElement> {
  design?: DesignPreset;
  title?: string;
  description?: string;
  actions?: ReactNode;
  columns?: 1 | 2 | 3;
}

const sectionColumns: Record<
  NonNullable<FormSectionProps["columns"]>,
  string
> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
};

export function FormSection({
  design,
  title,
  description,
  actions,
  columns = 1,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <section className={cn("space-y-5", design && controlDesignStyles[design], className)} {...props}>
      {(title || description || actions) && (
        <div className="flex min-w-0 flex-col items-stretch gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-extrabold tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
            )}
          </div>
          {actions && <div className="max-w-full shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn("grid gap-4", sectionColumns[columns])}>{children}</div>
    </section>
  );
}

export interface FieldsetProps
  extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  design?: DesignPreset;
  legend: string;
  description?: string;
  variant?: "plain" | "bordered" | "soft" | "customized";
}

const fieldsetVariants: Record<
  NonNullable<FieldsetProps["variant"]>,
  string
> = {
  plain: "",
  bordered: "rounded-2xl border border-border p-4 sm:p-5",
  soft: "rounded-2xl bg-surface-hover/65 p-4 sm:p-5",
  customized: "",
};

export function Fieldset({
  design,
  legend,
  description,
  variant = "plain",
  className,
  children,
  ...props
}: FieldsetProps) {
  return (
    <fieldset
      className={cn(fieldsetVariants[variant], design && controlDesignStyles[design], className)}
      {...props}
    >
      <legend className="px-1 text-sm font-extrabold text-foreground">
        {legend}
      </legend>
      {description && (
        <p className="mb-4 mt-1 text-xs leading-5 text-muted">{description}</p>
      )}
      <div className="space-y-3">{children}</div>
    </fieldset>
  );
}
