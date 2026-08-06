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

export type FormInputVariant = "outline" | "filled" | "minimal";
export type FormInputSize = "sm" | "md" | "lg";
export type FormInputStatus = "default" | "error" | "success";

export interface FormInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  design?: DesignPreset;
  variant?: FormInputVariant;
  inputSize?: FormInputSize;
  status?: FormInputStatus;
  leadingIcon?: ReactNode;
  trailingElement?: ReactNode;
  containerClassName?: string;
}

const variantStyles: Record<FormInputVariant, string> = {
  outline: "rounded-lg border border-border bg-surface",
  filled: "rounded-lg border border-transparent bg-background",
  minimal: "rounded-none border-x-0 border-t-0 border-b border-border bg-transparent",
};

const sizeStyles: Record<FormInputSize, string> = {
  sm: "h-9 px-2.5 text-xs",
  md: "h-11 px-3 text-sm",
  lg: "h-12 px-3.5 text-base",
};

const statusStyles: Record<FormInputStatus, string> = {
  default:
    "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10",
  error:
    "border-red-500/70 focus-within:border-red-500 focus-within:ring-3 focus-within:ring-red-500/10",
  success:
    "border-emerald-500/70 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/10",
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      design,
      variant = "outline",
      inputSize = "md",
      status = "default",
      leadingIcon,
      trailingElement,
      containerClassName,
      className,
      disabled,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-2.5 text-muted",
          "transition-[border-color,background-color,box-shadow] duration-150",
          variantStyles[variant],
          sizeStyles[inputSize],
          statusStyles[status],
          design && controlDesignStyles[design],
          disabled && "cursor-not-allowed opacity-55",
          containerClassName,
        )}
      >
        {leadingIcon && (
          <span className="grid size-5 shrink-0 place-items-center text-current">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={ariaInvalid ?? status === "error"}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-semibold text-foreground outline-none",
            "placeholder:font-normal placeholder:text-muted/70",
            "disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {trailingElement && (
          <span className="flex shrink-0 items-center">{trailingElement}</span>
        )}
      </div>
    );
  },
);
