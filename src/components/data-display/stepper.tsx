import type { ReactNode } from "react";
import { LuCheck, LuX } from "react-icons/lu";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type StepStatus = "pending" | "active" | "completed" | "error";
export interface StepItem { id: string; title: string; description?: string; icon?: ReactNode; status?: StepStatus; }
export interface StepperProps { steps: StepItem[]; currentStep?: number; orientation?: "horizontal" | "vertical"; variant?: "numbered" | "icon"; design?: DesignPreset; className?: string; }

export function Stepper({ steps, currentStep = 0, orientation = "horizontal", variant = "numbered", design, className }: StepperProps) {
  return (
    <ol className={cn("flex min-w-0 max-w-full", orientation === "vertical" ? "flex-col" : "w-full flex-row", design && surfaceDesignStyles[design], className)}>
      {steps.map((step, index) => {
        const status = step.status ?? (index < currentStep ? "completed" : index === currentStep ? "active" : "pending");
        return (
          <li key={step.id} className={cn("relative flex min-w-0", orientation === "horizontal" ? "flex-1 flex-col items-center text-center" : "min-h-20 items-start gap-3")}>
            {index < steps.length - 1 && <span className={cn("absolute bg-border", orientation === "horizontal" ? "left-1/2 top-4 h-0.5 w-full" : "left-4 top-8 h-[calc(100%-1rem)] w-0.5", status === "completed" && "bg-success")} />}
            <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 bg-surface text-xs font-extrabold", status === "active" && "border-primary text-primary", status === "completed" && "border-success bg-success text-success-foreground", status === "error" && "border-danger bg-danger text-danger-foreground", status === "pending" && "border-border text-muted")}>{status === "completed" ? <LuCheck /> : status === "error" ? <LuX /> : variant === "icon" && step.icon ? step.icon : index + 1}</span>
            <span className={cn("min-w-0 max-w-full", orientation === "horizontal" ? "mt-2 px-1 sm:px-2" : "")}><span className="block break-words text-sm font-extrabold text-foreground">{step.title}</span>{step.description && <span className="mt-0.5 block break-words text-xs text-muted">{step.description}</span>}</span>
          </li>
        );
      })}
    </ol>
  );
}
