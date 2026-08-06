"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
} from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type ChoiceVariant =
  | "default"
  | "outline"
  | "soft"
  | "minimal"
  | "card"
  | "tile"
  | "button"
  | "customized";
export type ChoiceSize = "sm" | "md" | "lg";

interface ChoiceBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  design?: DesignPreset;
  label?: string;
  description?: string;
  error?: string;
  variant?: ChoiceVariant;
  choiceSize?: ChoiceSize;
  indicatorClassName?: string;
}

const wrapperVariants: Record<ChoiceVariant, string> = {
  default: "",
  outline:
    "rounded-xl border border-border p-3.5 transition-colors hover:border-primary/40 has-checked:border-primary",
  soft:
    "rounded-xl bg-primary/5 p-3.5 transition-colors hover:bg-primary/10 has-checked:bg-primary/12",
  minimal:
    "rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover",
  card:
    "rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary/35 has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-3 has-checked:ring-primary/10",
  tile:
    "min-w-0 flex-col items-center rounded-xl border border-border bg-surface p-4 text-center transition-colors hover:bg-surface-hover has-checked:border-secondary has-checked:bg-secondary/10 sm:min-w-28",
  button:
    "min-h-10 items-center rounded-full border border-border bg-surface px-4 py-2 transition-colors hover:bg-surface-hover has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground",
  customized: "",
};

const inputSizes: Record<ChoiceSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

export interface CheckboxProps extends ChoiceBaseProps {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      design,
      label,
      description,
      error,
      variant = "default",
      choiceSize = "md",
      indeterminate = false,
      indicatorClassName,
      className,
      id,
      ...props
    },
    forwardedRef,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const internalRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    function assignRef(node: HTMLInputElement | null): void {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    }

    return (
      <label htmlFor={inputId} className={cn("flex min-w-0 max-w-full cursor-pointer items-start gap-2.5", wrapperVariants[variant], design && controlDesignStyles[design], props.disabled && "cursor-not-allowed opacity-50", className)}>
        <input
          ref={assignRef}
          id={inputId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          className={cn(
            "mt-0.5 shrink-0 rounded border-border accent-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            variant === "tile" && "mt-0",
            inputSizes[choiceSize],
            indicatorClassName,
          )}
          {...props}
        />
        <span className="min-w-0">
          {label && <span className="block break-words text-sm font-bold text-foreground">{label}</span>}
          {description && <span className="mt-0.5 block break-words text-xs text-muted">{description}</span>}
          {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
        </span>
      </label>
    );
  },
);

export type RadioProps = ChoiceBaseProps;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    design,
    label,
    description,
    error,
    variant = "default",
    choiceSize = "md",
    indicatorClassName,
    className,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label htmlFor={inputId} className={cn("flex min-w-0 max-w-full cursor-pointer items-start gap-2.5", wrapperVariants[variant], design && controlDesignStyles[design], props.disabled && "cursor-not-allowed opacity-50", className)}>
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className={cn(
          "mt-0.5 shrink-0 border-border accent-primary",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          variant === "tile" && "mt-0",
          inputSizes[choiceSize],
          indicatorClassName,
        )}
        {...props}
      />
      <span className="min-w-0">
        {label && <span className="block break-words text-sm font-bold text-foreground">{label}</span>}
        {description && <span className="mt-0.5 block break-words text-xs text-muted">{description}</span>}
        {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
      </span>
    </label>
  );
});

export interface ChoiceOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface ChoiceGroupProps {
  design?: DesignPreset;
  options: ChoiceOption[];
  orientation?: "horizontal" | "vertical";
  variant?: ChoiceVariant;
  size?: ChoiceSize;
  className?: string;
}

export interface CheckboxGroupProps extends ChoiceGroupProps {
  name: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function CheckboxGroup({ name, options, value = [], onChange, orientation = "vertical", design, variant, size, className }: CheckboxGroupProps) {
  function toggleValue(optionValue: string): void {
    onChange?.(value.includes(optionValue) ? value.filter((item) => item !== optionValue) : [...value, optionValue]);
  }
  return (
    <div className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap", className)}>
      {options.map((option) => <Checkbox key={option.value} name={name} value={option.value} label={option.label} description={option.description} disabled={option.disabled} checked={value.includes(option.value)} onChange={() => toggleValue(option.value)} design={design} variant={variant} choiceSize={size} />)}
    </div>
  );
}

export interface RadioGroupProps extends ChoiceGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({ name, options, value, onChange, orientation = "vertical", design, variant, size, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap", className)}>
      {options.map((option) => <Radio key={option.value} name={name} value={option.value} label={option.label} description={option.description} disabled={option.disabled} checked={value === option.value} onChange={() => onChange?.(option.value)} design={design} variant={variant} choiceSize={size} />)}
    </div>
  );
}
