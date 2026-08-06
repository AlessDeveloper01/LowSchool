import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type FormLabelSize = "sm" | "md";
export type FormLabelWeight = "medium" | "strong";

export interface FormLabelProps extends ComponentPropsWithoutRef<"label"> {
  design?: DesignPreset;
  labelSize?: FormLabelSize;
  weight?: FormLabelWeight;
  required?: boolean;
  optionalText?: string;
  hint?: ReactNode;
}

const sizeStyles: Record<FormLabelSize, string> = {
  sm: "text-xs",
  md: "text-sm",
};

const weightStyles: Record<FormLabelWeight, string> = {
  medium: "font-semibold",
  strong: "font-extrabold",
};

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel(
    {
      design,
      labelSize = "sm",
      weight = "strong",
      required = false,
      optionalText,
      hint,
      children,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <label
        ref={ref}
        className={cn("block text-foreground", sizeStyles[labelSize], design && controlDesignStyles[design], className)}
        {...props}
      >
        <span className={cn("flex min-w-0 flex-wrap items-center gap-1.5", weightStyles[weight])}>
          <span className="min-w-0 break-words">{children}</span>
          {required && (
            <>
              <span className="text-tertiary" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(obligatorio)</span>
            </>
          )}
          {!required && optionalText && (
            <span className="ml-auto text-[11px] font-medium text-muted">
              {optionalText}
            </span>
          )}
        </span>
        {hint && (
          <span className="mt-1 block text-xs font-normal leading-5 text-muted">
            {hint}
          </span>
        )}
      </label>
    );
  },
);
