import type { ReactNode } from "react";
import Link from "next/link";
import { LuBoxes } from "react-icons/lu";

import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type LogoVariant = "full" | "mark" | "wordmark" | "horizontal" | "vertical" | "compact";
export type LogoMode = "light" | "dark" | "monochrome";

export interface LogoProps {
  name: string;
  subtitle?: string;
  icon?: ReactNode;
  image?: ReactNode;
  href?: string;
  variant?: LogoVariant;
  mode?: LogoMode;
  size?: "sm" | "md" | "lg";
  design?: DesignPreset;
  className?: string;
}

const sizes = {
  sm: { mark: "size-8", title: "text-sm", subtitle: "text-[10px]" },
  md: { mark: "size-10", title: "text-base", subtitle: "text-xs" },
  lg: { mark: "size-12", title: "text-lg", subtitle: "text-sm" },
};

export function Logo({ name, subtitle, icon = <LuBoxes />, image, href, variant = "horizontal", mode = "light", size = "md", design, className }: LogoProps) {
  const config = sizes[size];
  const showMark = variant !== "wordmark";
  const showText = variant !== "mark" && variant !== "compact";
  const content = (
    <span className={cn("inline-flex min-w-0 max-w-full items-center gap-3", variant === "vertical" && "flex-col text-center", mode === "dark" && "text-white", mode === "monochrome" && "grayscale", design && navigationDesignStyles[design], design && "p-2", className)}>
      {showMark && <span className={cn("grid shrink-0 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground", config.mark)}>{image ?? icon}</span>}
      {showText && <span className="min-w-0"><span className={cn("block truncate font-extrabold tracking-tight", config.title)}>{name}</span>{subtitle && <span className={cn("block truncate text-muted", config.subtitle)}>{subtitle}</span>}</span>}
    </span>
  );
  return href ? <Link href={href} aria-label={name} className="inline-flex min-w-0 max-w-full">{content}</Link> : content;
}
