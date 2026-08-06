"use client";

import { forwardRef, useId } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

import {
  quantitySizeStyles,
  quantityVariantStyles,
} from "./quantity-input.config";
import {
  QuantityButton,
  QuantityMessage,
} from "./quantity-input-parts";
import type { QuantityInputProps } from "./quantity-input.types";
import { useQuantityInput } from "./use-quantity-input";
import { controlDesignStyles } from "@/components/types";
import { cn } from "@/lib/cn";

export const QuantityInput = forwardRef<
  HTMLInputElement,
  QuantityInputProps
>(function QuantityInput(
  {
    design,
    value,
    defaultValue = 0,
    onValueChange,
    min,
    max,
    step = 1,
    precision,
    label,
    description,
    error,
    decrementLabel = "Disminuir cantidad",
    incrementLabel = "Aumentar cantidad",
    variant = "outline",
    inputSize = "md",
    containerClassName,
    controlClassName,
    decrementClassName,
    incrementClassName,
    className,
    id,
    disabled,
    readOnly,
    name,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const quantity = useQuantityInput({
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    precision,
  });
  const buttonDisabled = Boolean(disabled || readOnly);

  return (
    <div className={cn("max-w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-extrabold text-foreground"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "inline-flex max-w-full items-center justify-center transition-all duration-150",
          quantityVariantStyles[variant],
          quantitySizeStyles[inputSize],
          design && controlDesignStyles[design],
          variant !== "split" && "overflow-hidden",
          error && "border-danger focus-within:border-danger",
          disabled && "cursor-not-allowed opacity-50",
          controlClassName,
        )}
      >
        <QuantityButton
          label={decrementLabel}
          disabled={buttonDisabled || quantity.atMinimum}
          className={decrementClassName}
          icon={<LuMinus aria-hidden="true" />}
          onClick={() =>
            quantity.commitValue(quantity.currentValue - step)
          }
        />
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="number"
          value={quantity.currentValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          inputMode={quantity.resolvedPrecision > 0 ? "decimal" : "numeric"}
          aria-invalid={Boolean(error)}
          aria-describedby={error || description ? messageId : undefined}
          onChange={(event) => {
            const nextValue = event.target.valueAsNumber;
            if (Number.isFinite(nextValue)) {
              quantity.commitValue(nextValue);
            }
          }}
          className={cn(
            "h-full bg-transparent px-1 text-center font-extrabold text-foreground outline-none",
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            "disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        <QuantityButton
          label={incrementLabel}
          disabled={buttonDisabled || quantity.atMaximum}
          className={incrementClassName}
          icon={<LuPlus aria-hidden="true" />}
          onClick={() =>
            quantity.commitValue(quantity.currentValue + step)
          }
        />
      </div>
      <QuantityMessage
        id={messageId}
        error={error}
        description={description}
      />
    </div>
  );
});

export function StepperInput(props: QuantityInputProps) {
  return <QuantityInput variant="split" {...props} />;
}
