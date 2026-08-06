import type { ReactNode } from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface TimelineItem { id: string; title: string; description?: string; date?: string; icon?: ReactNode; status?: "default" | "success" | "warning" | "danger"; content?: ReactNode; }
export interface TimelineProps { items: TimelineItem[]; variant?: "vertical" | "compact" | "alternating"; design?: DesignPreset; className?: string; }

const statusColors = { default: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-danger" };

export function Timeline({ items, variant = "vertical", design, className }: TimelineProps) {
  return <ol className={cn("relative min-w-0 max-w-full", design && surfaceDesignStyles[design], className)}>{items.map((item, index) => <li key={item.id} className={cn("relative min-w-0 pb-8 pl-10 last:pb-0", variant === "compact" && "pb-4 pl-8", variant === "alternating" && index % 2 === 1 && "sm:ml-1/2")}><span className="absolute left-3 top-6 h-[calc(100%-1rem)] w-px bg-border last:hidden" /><span className={cn("absolute left-0 top-0 grid size-7 place-items-center rounded-full text-xs text-white", statusColors[item.status ?? "default"])}>{item.icon}</span><div className="flex min-w-0 flex-wrap items-start justify-between gap-2"><p className="min-w-0 break-words text-sm font-extrabold text-foreground">{item.title}</p>{item.date && <time className="shrink-0 text-xs text-muted">{item.date}</time>}</div>{item.description && <p className="mt-1 break-words text-xs leading-5 text-muted">{item.description}</p>}{item.content && <div className="mt-3 min-w-0 max-w-full">{item.content}</div>}</li>)}</ol>;
}
