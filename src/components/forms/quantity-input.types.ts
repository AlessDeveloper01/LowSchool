import type { InputHTMLAttributes } from "react";
import type { DesignPreset } from "@/components/types";

export type QuantityInputVariant =
  | "outline"
  | "soft"
  | "compact"
  | "pill"
  | "split"
  | "customized";

export type QuantityInputSize = "sm" | "md" | "lg";

export interface QuantityInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "defaultValue"
    | "max"
    | "min"
    | "onChange"
    | "size"
    | "step"
    | "type"
    | "value"
  > {
  design?: DesignPreset;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  label?: string;
  description?: string;
  error?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  variant?: QuantityInputVariant;
  inputSize?: QuantityInputSize;
  containerClassName?: string;
  controlClassName?: string;
  decrementClassName?: string;
  incrementClassName?: string;
}
