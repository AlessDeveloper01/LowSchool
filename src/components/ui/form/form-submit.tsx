import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { LuLoaderCircle } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type FormSubmitVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost";
export type FormSubmitSize = "sm" | "md" | "lg";

export interface FormSubmitProps
  extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  design?: DesignPreset;
  variant?: FormSubmitVariant;
  buttonSize?: FormSubmitSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantStyles: Record<FormSubmitVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:outline-secondary",
  tertiary:
    "bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover focus-visible:outline-tertiary",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-hover focus-visible:outline-primary",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-hover focus-visible:outline-primary",
};

const sizeStyles: Record<FormSubmitSize, string> = {
  sm: "h-9 rounded-lg px-3 text-xs",
  md: "h-11 rounded-lg px-4 text-sm",
  lg: "h-12 rounded-xl px-5 text-base",
};

export const FormSubmit = forwardRef<HTMLButtonElement, FormSubmitProps>(
  function FormSubmit(
    {
      design,
      variant = "primary",
      buttonSize = "md",
      loading = false,
      loadingText = "Procesando...",
      fullWidth = false,
      leadingIcon,
      trailingIcon,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="submit"
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex min-w-0 max-w-full shrink-0 touch-manipulation items-center justify-center gap-2 font-extrabold",
          "transition-[background-color,color,border-color,opacity] duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-55",
          variantStyles[variant],
          sizeStyles[buttonSize],
          design && controlDesignStyles[design],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <LuLoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leadingIcon
        )}
        <span className="min-w-0 truncate">{loading ? loadingText : children}</span>
        {!loading && trailingIcon}
      </button>
    );
  },
);
