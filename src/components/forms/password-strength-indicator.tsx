import type { HTMLAttributes } from "react";
import { LuCheck, LuX } from "react-icons/lu";

import {
  defaultPasswordRules,
  evaluatePasswordStrength,
  type PasswordRule,
} from "./password-strength.utils";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type PasswordStrengthVariant =
  | "bars"
  | "meter"
  | "checklist"
  | "compact"
  | "customized";

export interface PasswordStrengthProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  design?: DesignPreset;
  value: string;
  rules?: readonly PasswordRule[];
  variant?: PasswordStrengthVariant;
  showLabel?: boolean;
  showRules?: boolean;
  barClassName?: string;
  activeBarClassName?: string;
  ruleClassName?: string;
}

const scoreColors: Record<number, string> = {
  0: "bg-border",
  1: "bg-danger",
  2: "bg-warning",
  3: "bg-tertiary",
  4: "bg-secondary",
  5: "bg-success",
};

const scoreTextColors: Record<number, string> = {
  0: "text-muted",
  1: "text-danger",
  2: "text-warning",
  3: "text-tertiary",
  4: "text-secondary",
  5: "text-success",
};

export function PasswordStrength({
  design,
  value,
  rules = defaultPasswordRules,
  variant = "bars",
  showLabel = true,
  showRules = variant === "checklist",
  barClassName,
  activeBarClassName,
  ruleClassName,
  className,
  ...props
}: PasswordStrengthProps) {
  const evaluation = evaluatePasswordStrength(value, rules);
  const activeColor = scoreColors[evaluation.score] ?? "bg-primary";

  return (
    <div
      className={cn("space-y-2", design && controlDesignStyles[design], className)}
      aria-live="polite"
      {...props}
    >
      {variant === "bars" && (
        <div className="grid grid-cols-5 gap-1" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full bg-border transition-colors duration-200",
                index < evaluation.score && activeColor,
                barClassName,
                index < evaluation.score && activeBarClassName,
              )}
            />
          ))}
        </div>
      )}
      {(variant === "meter" || variant === "compact") && (
        <div
          className={cn(
            "overflow-hidden rounded-full bg-border",
            variant === "compact" ? "h-1" : "h-2",
            barClassName,
          )}
          role="progressbar"
          aria-label="Fortaleza de la contraseña"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={evaluation.score}
        >
          <span
            className={cn(
              "block h-full rounded-full transition-[width] duration-200",
              activeColor,
              activeBarClassName,
            )}
            style={{ width: `${evaluation.percentage}%` }}
          />
        </div>
      )}
      {variant === "customized" && (
        <div
          role="progressbar"
          aria-label="Fortaleza de la contraseña"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={evaluation.score}
          className={barClassName}
        >
          <span
            className={activeBarClassName}
            style={{ width: `${evaluation.percentage}%` }}
          />
        </div>
      )}
      {showLabel && (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-muted">Seguridad</span>
          <span
            className={cn(
              "font-extrabold",
              scoreTextColors[evaluation.score],
            )}
          >
            {evaluation.label}
          </span>
        </div>
      )}
      {showRules && (
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {rules.map((rule) => {
            const passed = evaluation.passedRules.includes(rule.id);
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  passed ? "text-success" : "text-muted",
                  ruleClassName,
                )}
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full border",
                    passed
                      ? "border-success bg-success text-success-foreground"
                      : "border-border",
                  )}
                  aria-hidden="true"
                >
                  {passed ? <LuCheck /> : <LuX />}
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
