"use client";

import {
  forwardRef,
  useMemo,
  useState,
  type FocusEvent,
} from "react";

import { Input, type InputProps } from "./input";

export interface CurrencyFieldProps
  extends Omit<
    InputProps,
    "defaultValue" | "inputMode" | "onChange" | "type" | "value"
  > {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  currency?: string;
  locale?: string;
  minimum?: number;
  maximum?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  allowNegative?: boolean;
}

function getCurrencySeparators(locale: string): {
  decimal: string;
  group: string;
} {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    group: parts.find((part) => part.type === "group")?.value ?? ",",
  };
}

function parseCurrencyValue(
  input: string,
  locale: string,
  allowNegative: boolean,
): number | null {
  const { decimal, group } = getCurrencySeparators(locale);
  const normalized = input
    .split(group)
    .join("")
    .split(decimal)
    .join(".")
    .replace(allowNegative ? /[^\d.-]/g : /[^\d.]/g, "");

  if (!normalized || normalized === "-" || normalized === ".") {
    return null;
  }
  const parsedValue = Number(normalized);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatEditableNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    maximumFractionDigits: 20,
  }).format(value);
}

export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  function CurrencyField(
    {
      value,
      defaultValue = null,
      onValueChange,
      currency = "MXN",
      locale = "es-MX",
      minimum,
      maximum,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      allowNegative = false,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const formatter = useMemo(
      () =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          minimumFractionDigits,
          maximumFractionDigits,
        }),
      [currency, locale, maximumFractionDigits, minimumFractionDigits],
    );
    const [internalValue, setInternalValue] = useState<number | null>(
      defaultValue,
    );
    const [draft, setDraft] = useState(
      defaultValue === null ? "" : formatEditableNumber(defaultValue, locale),
    );
    const [focused, setFocused] = useState(false);
    const currentValue = value === undefined ? internalValue : value;
    const displayValue = focused
      ? draft
      : currentValue === null
        ? ""
        : formatter.format(currentValue);

    function normalizeValue(nextValue: number | null): number | null {
      if (nextValue === null) {
        return null;
      }
      const signSafeValue = allowNegative ? nextValue : Math.max(0, nextValue);
      return Math.min(
        maximum ?? Number.POSITIVE_INFINITY,
        Math.max(minimum ?? Number.NEGATIVE_INFINITY, signSafeValue),
      );
    }

    function commitValue(nextValue: number | null): void {
      const normalizedValue = normalizeValue(nextValue);
      if (value === undefined) {
        setInternalValue(normalizedValue);
      }
      onValueChange?.(normalizedValue);
    }

    function handleFocus(event: FocusEvent<HTMLInputElement>): void {
      setFocused(true);
      setDraft(
        currentValue === null
          ? ""
          : formatEditableNumber(currentValue, locale),
      );
      onFocus?.(event);
    }

    function handleBlur(event: FocusEvent<HTMLInputElement>): void {
      commitValue(parseCurrencyValue(draft, locale, allowNegative));
      setFocused(false);
      onBlur?.(event);
    }

    return (
      <Input
        ref={ref}
        {...props}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(event) => {
          const nextDraft = event.target.value;
          setDraft(nextDraft);
          commitValue(parseCurrencyValue(nextDraft, locale, allowNegative));
        }}
      />
    );
  },
);
