"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";

import { Input, type InputProps } from "./input";

export type PatternToken = "9" | "A" | "*";

export interface PatternInputValue {
  raw: string;
  formatted: string;
  complete: boolean;
}

const tokenPatterns: Record<PatternToken, RegExp> = {
  "9": /\d/,
  A: /[A-Za-z]/,
  "*": /[A-Za-z0-9]/,
};

function isPatternToken(character: string): character is PatternToken {
  return character === "9" || character === "A" || character === "*";
}

function extractRawValue(input: string, pattern: string): string {
  let inputIndex = 0;
  let rawValue = "";

  for (const patternCharacter of pattern) {
    if (!isPatternToken(patternCharacter)) {
      if (input[inputIndex] === patternCharacter) {
        inputIndex += 1;
      }
      continue;
    }

    const tokenPattern = tokenPatterns[patternCharacter];
    while (
      inputIndex < input.length &&
      !tokenPattern.test(input[inputIndex] ?? "")
    ) {
      inputIndex += 1;
    }
    const candidate = input[inputIndex];
    if (candidate && tokenPattern.test(candidate)) {
      rawValue += candidate;
      inputIndex += 1;
    }
  }

  return rawValue;
}

export function formatPatternValue(
  rawValue: string,
  pattern: string,
  placeholderCharacter = "_",
  showPlaceholders = false,
): PatternInputValue {
  let rawIndex = 0;
  let formatted = "";
  let acceptedRaw = "";
  const tokenCount = pattern.split("").filter(isPatternToken).length;

  for (const patternCharacter of pattern) {
    if (!isPatternToken(patternCharacter)) {
      if (rawValue.length > 0 || showPlaceholders) {
        formatted += patternCharacter;
      }
      continue;
    }

    const tokenPattern = tokenPatterns[patternCharacter];
    let candidate = rawValue[rawIndex];
    while (candidate && !tokenPattern.test(candidate)) {
      rawIndex += 1;
      candidate = rawValue[rawIndex];
    }

    if (candidate) {
      formatted += candidate;
      acceptedRaw += candidate;
      rawIndex += 1;
    } else if (showPlaceholders) {
      formatted += placeholderCharacter;
    } else {
      break;
    }
  }

  return {
    raw: acceptedRaw,
    formatted,
    complete: acceptedRaw.length === tokenCount,
  };
}

export interface PatternInputProps
  extends Omit<
    InputProps,
    "defaultValue" | "onChange" | "type" | "value"
  > {
  pattern: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: PatternInputValue) => void;
  placeholderCharacter?: string;
  showPlaceholders?: boolean;
  submitRawValue?: boolean;
  transformRawValue?: (value: string) => string;
  onInputChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}

export const PatternInput = forwardRef<HTMLInputElement, PatternInputProps>(
  function PatternInput(
    {
      pattern,
      value,
      defaultValue = "",
      onValueChange,
      placeholderCharacter = "_",
      showPlaceholders = false,
      submitRawValue = false,
      transformRawValue,
      onInputChange,
      name,
      ...props
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentRawValue = value ?? internalValue;
    const patternValue = formatPatternValue(
      currentRawValue,
      pattern,
      placeholderCharacter,
      showPlaceholders,
    );

    function commitValue(inputValue: string): void {
      const extractedValue = extractRawValue(inputValue, pattern);
      const nextRawValue = transformRawValue
        ? transformRawValue(extractedValue)
        : extractedValue;
      const nextPatternValue = formatPatternValue(
        nextRawValue,
        pattern,
        placeholderCharacter,
        showPlaceholders,
      );
      if (value === undefined) {
        setInternalValue(nextPatternValue.raw);
      }
      onValueChange?.(nextPatternValue);
    }

    return (
      <>
        <Input
          ref={ref}
          {...props}
          name={submitRawValue ? undefined : name}
          type="text"
          inputMode={
            pattern
              .split("")
              .every(
                (character) =>
                  character === "9" || !isPatternToken(character),
              )
              ? "numeric"
              : "text"
          }
          value={patternValue.formatted}
          maxLength={pattern.length}
          onChange={(event) => {
            commitValue(event.target.value);
            onInputChange?.(event);
          }}
        />
        {submitRawValue && name && (
          <input type="hidden" name={name} value={patternValue.raw} />
        )}
      </>
    );
  },
);
