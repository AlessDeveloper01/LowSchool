import type { HTMLAttributes, ReactNode } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

type Gap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
const gaps: Record<Gap, string> = { none: "gap-0", xs: "gap-1.5", sm: "gap-3", md: "gap-5", lg: "gap-8", xl: "gap-12" };

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  design?: DesignPreset;
}
const containerSizes = { sm: "max-w-3xl", md: "max-w-5xl", lg: "max-w-7xl", xl: "max-w-[1500px]", full: "max-w-none" };
export function Container({ size = "lg", design, className, ...props }: ContainerProps) { return <div className={cn("mx-auto w-full px-4 sm:px-6", containerSizes[size], design && surfaceDesignStyles[design], className)} {...props} />; }

export interface SectionProps extends HTMLAttributes<HTMLElement> { spacing?: "sm" | "md" | "lg" | "xl"; design?: DesignPreset; }
const sectionSpacing = { sm: "py-6", md: "py-10", lg: "py-16", xl: "py-24" };
export function Section({ spacing = "lg", design, className, ...props }: SectionProps) { return <section className={cn(sectionSpacing[spacing], design && surfaceDesignStyles[design], className)} {...props} />; }

export interface StackProps extends HTMLAttributes<HTMLDivElement> { gap?: Gap; align?: "start" | "center" | "end" | "stretch"; design?: DesignPreset; }
export function Stack({ gap = "md", align = "stretch", design, className, ...props }: StackProps) { return <div className={cn("flex flex-col", gaps[gap], align === "start" && "items-start", align === "center" && "items-center", align === "end" && "items-end", align === "stretch" && "items-stretch", design && surfaceDesignStyles[design], className)} {...props} />; }

export interface InlineProps extends HTMLAttributes<HTMLDivElement> { gap?: Gap; align?: "start" | "center" | "end" | "baseline"; wrap?: boolean; design?: DesignPreset; }
export function Inline({ gap = "sm", align = "center", wrap = true, design, className, ...props }: InlineProps) { return <div className={cn("flex", gaps[gap], wrap && "flex-wrap", align === "start" && "items-start", align === "center" && "items-center", align === "end" && "items-end", align === "baseline" && "items-baseline", design && surfaceDesignStyles[design], className)} {...props} />; }

export interface GridProps extends HTMLAttributes<HTMLDivElement> { columns?: 1 | 2 | 3 | 4 | 5 | 6; gap?: Gap; design?: DesignPreset; }
const columns = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", 5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5", 6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" };
export function Grid({ columns: count = 3, gap = "md", design, className, ...props }: GridProps) { return <div className={cn("grid", columns[count], gaps[gap], design && surfaceDesignStyles[design], className)} {...props} />; }

export function Divider({ label, design, className, ...props }: HTMLAttributes<HTMLDivElement> & { label?: ReactNode; design?: DesignPreset }) { return <div role="separator" className={cn("flex min-w-0 items-center gap-3", design && surfaceDesignStyles[design], design && "p-2", className)} {...props}><span className="h-px min-w-4 flex-1 bg-border" />{label && <span className="min-w-0 truncate text-xs font-bold text-muted">{label}</span>}{label && <span className="h-px min-w-4 flex-1 bg-border" />}</div>; }
export function ScrollArea({ design, className, ...props }: HTMLAttributes<HTMLDivElement> & { design?: DesignPreset }) { return <div className={cn("overflow-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--theme-border)_transparent]", design && surfaceDesignStyles[design], className)} {...props} />; }
