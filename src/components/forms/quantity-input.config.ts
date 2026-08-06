import type {
  QuantityInputSize,
  QuantityInputVariant,
} from "./quantity-input.types";

export const quantityVariantStyles: Record<
  QuantityInputVariant,
  string
> = {
  outline:
    "rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10",
  soft:
    "rounded-xl border border-primary/10 bg-primary/5 focus-within:border-primary/40",
  compact:
    "rounded-lg border border-border bg-surface [&>button]:bg-surface-hover",
  pill:
    "rounded-full border border-border bg-surface [&>button]:rounded-full [&>button]:bg-secondary/10 [&>button]:text-secondary",
  split:
    "gap-1 bg-transparent [&>button]:rounded-lg [&>button]:border [&>button]:border-border [&>button]:bg-surface [&>input]:rounded-lg [&>input]:border [&>input]:border-border [&>input]:bg-surface",
  customized: "",
};

export const quantitySizeStyles: Record<QuantityInputSize, string> = {
  sm: "h-9 [&>button]:size-8 [&>input]:w-12 [&>input]:text-xs",
  md: "h-11 [&>button]:size-10 [&>input]:w-16 [&>input]:text-sm",
  lg: "h-12 [&>button]:size-11 [&>input]:w-20 [&>input]:text-base",
};

export function clampValue(
  value: number,
  min?: number,
  max?: number,
): number {
  return Math.min(
    max ?? Number.POSITIVE_INFINITY,
    Math.max(min ?? Number.NEGATIVE_INFINITY, value),
  );
}

export function roundValue(
  value: number,
  precision: number,
): number {
  const multiplier = 10 ** precision;
  return (
    Math.round((value + Number.EPSILON) * multiplier) / multiplier
  );
}

export function getStepPrecision(step: number): number {
  const stepText = String(step).toLocaleLowerCase();
  if (stepText.includes("e-")) {
    const exponent = Number(stepText.split("e-")[1]);
    return Number.isFinite(exponent) ? Math.min(12, exponent) : 0;
  }

  const decimalPart = stepText.split(".")[1];
  return decimalPart ? Math.min(12, decimalPart.length) : 0;
}
