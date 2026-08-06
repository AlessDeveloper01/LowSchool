import { useState } from "react";

import {
  clampValue,
  getStepPrecision,
  roundValue,
} from "./quantity-input.config";
import type { QuantityInputProps } from "./quantity-input.types";

type QuantityValueOptions = Pick<
  QuantityInputProps,
  | "defaultValue"
  | "max"
  | "min"
  | "onValueChange"
  | "precision"
  | "step"
  | "value"
>;

export function useQuantityInput({
  value,
  defaultValue = 0,
  onValueChange,
  min,
  max,
  step = 1,
  precision,
}: QuantityValueOptions) {
  const [internalValue, setInternalValue] = useState(() =>
    clampValue(defaultValue, min, max),
  );
  const currentValue = value ?? internalValue;
  const resolvedPrecision = Math.max(
    0,
    Math.min(12, precision ?? getStepPrecision(step)),
  );

  function commitValue(nextValue: number): void {
    const normalized = roundValue(
      clampValue(nextValue, min, max),
      resolvedPrecision,
    );
    if (value === undefined) {
      setInternalValue(normalized);
    }
    onValueChange?.(normalized);
  }

  return {
    atMaximum: max !== undefined && currentValue >= max,
    atMinimum: min !== undefined && currentValue <= min,
    commitValue,
    currentValue,
    resolvedPrecision,
  };
}
