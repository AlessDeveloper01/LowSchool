"use client";

import { useId, useState } from "react";

import { PasswordInput, type InputProps } from "./input";
import {
  PasswordStrength,
  type PasswordStrengthVariant,
} from "./password-strength-indicator";
import type { PasswordRule } from "./password-strength.utils";

export interface PasswordStrengthInputProps
  extends Omit<InputProps, "defaultValue" | "onChange" | "type" | "value"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  rules?: readonly PasswordRule[];
  strengthVariant?: PasswordStrengthVariant;
  showStrengthLabel?: boolean;
  showRules?: boolean;
  strengthClassName?: string;
  strengthBarClassName?: string;
  strengthActiveBarClassName?: string;
}

export function PasswordStrengthInput({
  design,
  value,
  defaultValue = "",
  onValueChange,
  rules,
  strengthVariant = "bars",
  showStrengthLabel,
  showRules,
  strengthClassName,
  strengthBarClassName,
  strengthActiveBarClassName,
  id,
  ...props
}: PasswordStrengthInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  function commitValue(nextValue: string): void {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  return (
    <div className="space-y-2">
      <PasswordInput
        design={design}
        {...props}
        id={inputId}
        value={currentValue}
        onChange={(event) => commitValue(event.target.value)}
      />
      <PasswordStrength
        design={design}
        value={currentValue}
        rules={rules}
        variant={strengthVariant}
        showLabel={showStrengthLabel}
        showRules={showRules}
        className={strengthClassName}
        barClassName={strengthBarClassName}
        activeBarClassName={strengthActiveBarClassName}
      />
    </div>
  );
}
