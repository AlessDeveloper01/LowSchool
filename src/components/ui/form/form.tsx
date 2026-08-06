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

export type FormVariant = "plain" | "panel" | "outlined";
export type FormSpacing = "compact" | "default" | "relaxed";

export interface FormProps extends ComponentPropsWithoutRef<"form"> {
  design?: DesignPreset;
  variant?: FormVariant;
  spacing?: FormSpacing;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

const variantStyles: Record<FormVariant, string> = {
  plain: "bg-transparent",
  panel: "rounded-2xl border border-border bg-surface p-4 sm:p-6",
  outlined: "rounded-2xl border border-border bg-transparent p-4 sm:p-6",
};

const spacingStyles: Record<FormSpacing, string> = {
  compact: "space-y-3",
  default: "space-y-5",
  relaxed: "space-y-7",
};

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    design,
    variant = "plain",
    spacing = "default",
    title,
    description,
    footer,
    children,
    className,
    ...props
  },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cn(variantStyles[variant], design && controlDesignStyles[design], className)}
      {...props}
    >
      {(title || description) && (
        <header className="mb-6">
          {title && (
            <h2 className="break-words text-xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
              {description}
            </p>
          )}
        </header>
      )}

      <div className={spacingStyles[spacing]}>{children}</div>

      {footer && (
        <footer className="mt-6 border-t border-border pt-5">{footer}</footer>
      )}
    </form>
  );
});
