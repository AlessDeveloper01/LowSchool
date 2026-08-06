export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "neutral"
  | "outline"
  | "dashed"
  | "ghost"
  | "soft"
  | "secondary-soft"
  | "tertiary-soft"
  | "glass"
  | "elevated"
  | "inverted"
  | "link"
  | "success"
  | "warning"
  | "danger"
  | "gradient"
  | "gradient-cool"
  | "customized";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";
export type ButtonShape = "default" | "square" | "pill" | "sharp";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:outline-secondary",
  tertiary:
    "bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover focus-visible:outline-tertiary",
  accent:
    "bg-accent text-accent-foreground hover:brightness-95 focus-visible:outline-accent",
  neutral:
    "bg-foreground/8 text-foreground hover:bg-foreground/13 focus-visible:outline-foreground",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-hover focus-visible:outline-primary",
  dashed:
    "border border-dashed border-muted/70 bg-transparent text-foreground hover:border-primary hover:bg-primary/5 focus-visible:outline-primary",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-hover focus-visible:outline-primary",
  soft: "bg-primary/10 text-primary hover:bg-primary/15 focus-visible:outline-primary",
  "secondary-soft":
    "bg-secondary/10 text-secondary hover:bg-secondary/16 focus-visible:outline-secondary",
  "tertiary-soft":
    "bg-tertiary/10 text-tertiary hover:bg-tertiary/16 focus-visible:outline-tertiary",
  glass:
    "border border-white/30 bg-surface/65 text-foreground backdrop-blur-xl hover:bg-surface/85 focus-visible:outline-primary dark:border-white/10",
  elevated:
    "border border-border/70 bg-surface text-foreground shadow-sm hover:-translate-y-0.5 hover:bg-surface-hover hover:shadow-md focus-visible:outline-primary",
  inverted:
    "bg-foreground text-background hover:opacity-85 focus-visible:outline-foreground",
  link: "h-auto bg-transparent p-0 text-primary underline-offset-4 hover:underline focus-visible:outline-primary",
  success:
    "bg-success text-success-foreground hover:opacity-90 focus-visible:outline-success",
  warning:
    "bg-warning text-warning-foreground hover:opacity-90 focus-visible:outline-warning",
  danger:
    "bg-danger text-danger-foreground hover:opacity-90 focus-visible:outline-danger",
  gradient:
    "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:brightness-105 focus-visible:outline-primary",
  "gradient-cool":
    "bg-gradient-to-br from-secondary via-primary to-tertiary text-white hover:brightness-105 focus-visible:outline-secondary",
  customized: "bg-transparent text-inherit focus-visible:outline-current",
};

export const buttonSizes: Record<ButtonSize, string> = {
  xs: "h-7 rounded-md px-2.5 text-[11px]",
  sm: "h-9 rounded-lg px-3 text-xs",
  md: "h-10 rounded-lg px-4 text-sm",
  lg: "h-12 rounded-xl px-5 text-base",
  xl: "h-14 rounded-xl px-6 text-lg",
  icon: "size-10 rounded-lg",
};

export const buttonShapes: Record<ButtonShape, string> = {
  default: "",
  square: "aspect-square rounded-lg px-0",
  pill: "rounded-full",
  sharp: "rounded-none",
};
