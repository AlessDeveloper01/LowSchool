import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { LuLoaderCircle } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

import {
  buttonShapes,
  buttonSizes,
  buttonVariants,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "./button.styles";

export { buttonShapes, buttonSizes, buttonVariants } from "./button.styles";
export type {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "./button.styles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  design?: DesignPreset;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      design,
      size = "md",
      shape = "default",
      fullWidth = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      type = "button",
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
        type={type}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex min-w-0 max-w-full shrink-0 touch-manipulation items-center justify-center gap-2 font-bold",
          "transition-[background-color,color,border-color,opacity,transform] duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px",
          "disabled:pointer-events-none disabled:opacity-50",
          buttonSizes[size],
          design && controlDesignStyles[design],
          buttonVariants[variant],
          buttonShapes[shape],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <LuLoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children && <span className="min-w-0 truncate">{loading && loadingText ? loadingText : children}</span>}
        {!loading && rightIcon}
      </button>
    );
  },
);

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  attached?: boolean;
  orientation?: "horizontal" | "vertical";
  design?: DesignPreset;
}

export function ButtonGroup({
  attached = false,
  orientation = "horizontal",
  design,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex max-w-full",
        orientation === "vertical" ? "flex-col" : "flex-row",
        orientation === "horizontal" && "overflow-x-auto overscroll-x-contain",
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
