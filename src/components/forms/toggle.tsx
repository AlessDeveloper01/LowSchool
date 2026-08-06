"use client";

import {
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { LuCheck, LuX } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type SwitchVariant =
  | "default"
  | "minimal"
  | "soft"
  | "labelled"
  | "icon"
  | "elevated"
  | "gradient"
  | "customized";
export type ToggleVariant =
  | "default"
  | "outline"
  | "soft"
  | "ghost"
  | "pill"
  | "elevated"
  | "gradient"
  | "customized";
export type ControlSize = "sm" | "md" | "lg";

export interface SwitchProps {
  design?: DesignPreset;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  activeText?: string;
  inactiveText?: string;
  activeIcon?: ReactNode;
  inactiveIcon?: ReactNode;
  variant?: SwitchVariant;
  size?: ControlSize;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
}

const switchSizes = {
  sm: { track: "h-5 w-9", thumb: "size-4", active: "translate-x-4" },
  md: { track: "h-6 w-11", thumb: "size-5", active: "translate-x-5" },
  lg: { track: "h-7 w-13", thumb: "size-6", active: "translate-x-6" },
};

export function Switch({
  design,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  label,
  description,
  activeText = "Activo",
  inactiveText = "Inactivo",
  activeIcon = <LuCheck />,
  inactiveIcon = <LuX />,
  variant = "default",
  size = "md",
  className,
  trackClassName,
  thumbClassName,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;
  const sizing = switchSizes[size];

  function toggle(): void {
    const nextValue = !isChecked;
    if (checked === undefined) setInternalChecked(nextValue);
    onCheckedChange?.(nextValue);
  }

  return (
    <label className={cn("inline-flex min-w-0 max-w-full items-center gap-3", disabled && "opacity-50", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative shrink-0 touch-manipulation rounded-full transition-colors duration-200 before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          sizing.track,
          variant !== "customized" && (isChecked ? "bg-primary" : "bg-border"),
          variant === "minimal" && !isChecked && "bg-muted/40",
          variant === "soft" && isChecked && "bg-primary/35",
          variant === "elevated" && "shadow-inner shadow-foreground/15",
          variant === "gradient" &&
            isChecked &&
            "bg-gradient-to-r from-primary via-secondary to-tertiary",
          design && controlDesignStyles[design],
          trackClassName,
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 grid place-items-center rounded-full bg-white text-[9px] text-primary",
            "transition-transform duration-200",
            sizing.thumb,
            isChecked && sizing.active,
            thumbClassName,
          )}
        >
          {variant === "icon" && (isChecked ? activeIcon : inactiveIcon)}
        </span>
      </button>
      {(label || description || variant === "labelled") && (
        <span className="min-w-0">
          <span className="block break-words text-sm font-bold text-foreground">{label ?? (isChecked ? activeText : inactiveText)}</span>
          {description && <span className="block break-words text-xs text-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  design?: DesignPreset;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ControlSize;
}

const toggleSizes = { sm: "h-8 px-2.5 text-xs", md: "h-10 px-3 text-sm", lg: "h-12 px-4 text-base" };

const toggleVariants: Record<ToggleVariant, string> = {
  default: "",
  outline: "border border-border",
  soft: "bg-primary/5",
  ghost: "bg-transparent",
  pill: "rounded-full border border-border bg-surface",
  elevated: "border border-border/60 bg-surface shadow-md shadow-foreground/5",
  gradient: "border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10",
  customized: "",
};

export function Toggle({ pressed, defaultPressed = false, onPressedChange, design, variant = "default", size = "md", className, children, onClick, ...props }: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isPressed = pressed ?? internalPressed;
  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={(event) => {
        if (pressed === undefined) setInternalPressed(!isPressed);
        onPressedChange?.(!isPressed);
        onClick?.(event);
      }}
      className={cn(
        "inline-flex max-w-full touch-manipulation items-center justify-center gap-2 rounded-lg font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50",
        toggleSizes[size],
        toggleVariants[variant],
        design && controlDesignStyles[design],
        variant !== "customized" &&
          (isPressed
            ? "bg-primary text-primary-foreground"
            : "text-muted hover:bg-surface-hover hover:text-foreground"),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ToggleOption {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  design?: DesignPreset;
  options: ToggleOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  size?: ControlSize;
  variant?: ToggleVariant;
  className?: string;
}

export function ToggleGroup({ options, value = [], onChange, multiple = false, size = "md", design, variant, className }: ToggleGroupProps) {
  function select(optionValue: string): void {
    if (!multiple) return onChange?.([optionValue]);
    onChange?.(value.includes(optionValue) ? value.filter((item) => item !== optionValue) : [...value, optionValue]);
  }
  return (
    <div role="group" className={cn("inline-flex max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-border p-1 [&>*]:shrink-0", design && controlDesignStyles[design], className)}>
      {options.map((option) => <Toggle key={option.value} size={size} variant={variant} pressed={value.includes(option.value)} disabled={option.disabled} onPressedChange={() => select(option.value)}>{option.icon}{option.label}</Toggle>)}
    </div>
  );
}

export interface SegmentedControlProps extends Omit<ToggleGroupProps, "value" | "onChange" | "multiple"> {
  value?: string;
  onChange?: (value: string) => void;
}

export function SegmentedControl({ value, onChange, ...props }: SegmentedControlProps) {
  return <ToggleGroup {...props} value={value ? [value] : []} onChange={(values) => values[0] && onChange?.(values[0])} />;
}
