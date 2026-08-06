import type { ElementType, HTMLAttributes, ReactNode } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type TextTone =
  | "default"
  | "muted"
  | "primary"
  | "success"
  | "warning"
  | "danger";
export type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: TextTone;
  size?: TextSize;
  design?: DesignPreset;
  children?: ReactNode;
}

const tones: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-muted",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};
const sizes: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

export function Text({
  as: Component = "span",
  tone = "default",
  size = "base",
  design,
  className,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        "max-w-full break-words",
        tones[tone],
        sizes[size],
        design && surfaceDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}

export function Heading({
  as = "h2",
  size = "2xl",
  className,
  ...props
}: TypographyProps) {
  return (
    <Text
      as={as}
      size={size}
      className={cn("font-extrabold tracking-tight", className)}
      {...props}
    />
  );
}
export function Paragraph({ className, ...props }: TypographyProps) {
  return <Text as="p" className={cn("leading-7", className)} {...props} />;
}
export function Label({ className, ...props }: TypographyProps) {
  return (
    <Text
      as="span"
      size="sm"
      className={cn("font-extrabold", className)}
      {...props}
    />
  );
}
export function Caption({ className, ...props }: TypographyProps) {
  return (
    <Text as="span" tone="muted" size="xs" className={className} {...props} />
  );
}
export function Code({ className, ...props }: TypographyProps) {
  return (
    <Text
      as="code"
      size="sm"
      className={cn(
        "inline-block max-w-full overflow-x-auto rounded-md bg-surface-hover px-1.5 py-0.5 font-mono whitespace-pre",
        className,
      )}
      {...props}
    />
  );
}
export function TypographyKbd({ className, ...props }: TypographyProps) {
  return (
    <Text
      as="kbd"
      size="xs"
      className={cn(
        "rounded-md border border-border bg-surface px-1.5 py-0.5 font-bold",
        className,
      )}
      {...props}
    />
  );
}
export function Blockquote({ className, ...props }: TypographyProps) {
  return (
    <Text
      as="blockquote"
      tone="muted"
      className={cn("border-l-4 border-primary pl-4 italic", className)}
      {...props}
    />
  );
}
export function TruncatedText({
  lines = 1,
  className,
  ...props
}: TypographyProps & { lines?: 1 | 2 | 3 }) {
  return (
    <Text
      className={cn(
        lines === 1 && "truncate",
        lines === 2 && "line-clamp-2",
        lines === 3 && "line-clamp-3",
        className,
      )}
      {...props}
    />
  );
}
