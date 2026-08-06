"use client";

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type SliderVariant =
  | "default"
  | "gradient"
  | "minimal"
  | "customized";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  design?: DesignPreset;
  label?: string;
  showValue?: boolean;
  valueSuffix?: string;
  variant?: SliderVariant;
  containerClassName?: string;
}

const sliderVariants: Record<SliderVariant, string> = {
  default: "accent-primary",
  gradient: "accent-secondary",
  minimal: "accent-foreground",
  customized: "",
};

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    design,
    label,
    showValue = true,
    valueSuffix = "",
    variant = "default",
    containerClassName,
    className,
    defaultValue = 50,
    value,
    onChange,
    min = 0,
    max = 100,
    ...props
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState(String(defaultValue));
  const displayValue = value === undefined ? internalValue : String(value);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setInternalValue(event.target.value);
    onChange?.(event);
  }

  return (
    <label className={cn("block space-y-2", containerClassName)}>
      {(label || showValue) && (
        <span className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold text-foreground">{label}</span>
          {showValue && (
            <output className="rounded-md bg-surface-hover px-2 py-1 text-[11px] font-extrabold text-muted">
              {displayValue}
              {valueSuffix}
            </output>
          )}
        </span>
      )}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={handleChange}
        className={cn(
          "h-2 w-full cursor-pointer appearance-auto rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
          sliderVariants[variant],
          design && controlDesignStyles[design],
          className,
        )}
        {...props}
      />
    </label>
  );
});

export interface ColorPickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  design?: DesignPreset;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  containerClassName?: string;
}

export function ColorPicker({
  design,
  label = "Color",
  value,
  defaultValue = "#facc15",
  onValueChange,
  containerClassName,
  className,
  disabled,
  ...props
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  function updateColor(nextValue: string): void {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-surface p-3",
        design && controlDesignStyles[design],
        disabled && "cursor-not-allowed opacity-50",
        containerClassName,
      )}
    >
      <input
        type="color"
        value={currentValue}
        disabled={disabled}
        onChange={(event) => updateColor(event.target.value)}
        className={cn(
          "size-10 cursor-pointer rounded-lg border-0 bg-transparent p-0",
          className,
        )}
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-xs font-extrabold text-foreground">
          {label}
        </span>
        <span className="block font-mono text-xs uppercase text-muted">
          {currentValue}
        </span>
      </span>
    </label>
  );
}
