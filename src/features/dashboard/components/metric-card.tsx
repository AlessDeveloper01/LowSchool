import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import { cn } from "@/lib/cn";

type Accent = "primary" | "secondary" | "tertiary" | "success";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  detail: string;
  icon: IconType;
  accent: Accent;
  trend?: "positive" | "negative" | "neutral";
}

const accentStyles: Record<Accent, { icon: string; indicator: string }> = {
  primary: { icon: "bg-primary/12 text-primary", indicator: "bg-primary" },
  secondary: { icon: "bg-secondary/12 text-secondary", indicator: "bg-secondary" },
  tertiary: { icon: "bg-tertiary/12 text-tertiary", indicator: "bg-tertiary" },
  success: { icon: "bg-success/12 text-success", indicator: "bg-success" },
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
  trend = "neutral",
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-foreground/5">
      <span className={cn("absolute inset-y-5 left-0 w-0.5 rounded-r", styles.indicator)} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted">{label}</p>
          <p className="mt-3 truncate text-2xl font-black tracking-tight text-foreground">{value}</p>
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", styles.icon)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 text-xs font-semibold",
          trend === "positive" && "text-success",
          trend === "negative" && "text-danger",
          trend === "neutral" && "text-muted",
        )}
      >
        {detail}
      </p>
    </article>
  );
}
