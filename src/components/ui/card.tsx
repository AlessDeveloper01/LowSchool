import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type CardVariant =
  | "default"
  | "bordered"
  | "elevated"
  | "flat"
  | "soft"
  | "glass"
  | "gradient"
  | "interactive"
  | "selected"
  | "customized";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  design?: DesignPreset;
  padding?: "none" | "sm" | "md" | "lg";
  horizontal?: boolean;
  selected?: boolean;
  clickable?: boolean;
}

const variants: Record<CardVariant, string> = {
  default: "border border-border bg-surface",
  bordered: "border-2 border-border bg-surface",
  elevated: "border border-border/60 bg-surface shadow-lg shadow-foreground/5",
  flat: "bg-surface",
  soft: "border border-primary/10 bg-primary/5",
  glass: "border border-white/20 bg-surface/75 backdrop-blur-xl",
  gradient:
    "border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-accent/10",
  interactive:
    "border border-border bg-surface hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md",
  selected: "border-2 border-primary bg-primary/5 ring-3 ring-primary/10",
  customized: "bg-transparent",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "default",
    design,
    padding = "md",
    horizontal = false,
    selected = false,
    clickable = false,
    className,
    onKeyDown,
    ...props
  },
  ref,
) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (clickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <div
      ref={ref}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-pressed={clickable ? selected : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-2xl text-foreground transition-all duration-200",
        variants[selected ? "selected" : variant],
        design && surfaceDesignStyles[design],
        paddings[padding],
        horizontal && "flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-5",
        clickable && "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary",
        className,
      )}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-wrap items-start justify-between gap-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("min-w-0 break-words text-base font-extrabold tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm leading-6 text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 border-t border-border pt-4", className)} {...props} />;
}

export function CardActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex max-w-full shrink-0 flex-wrap items-center gap-2", className)} {...props} />;
}
