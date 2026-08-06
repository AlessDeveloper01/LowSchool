"use client";

import { forwardRef, useId, useState } from "react";

import {
  defaultPhoneCountries,
  phoneSizes,
  phoneVariants,
  sanitizePhoneNumber,
  type PhoneCountry,
  type PhoneFieldProps,
} from "./phone-field.config";
import { controlDesignStyles } from "@/components/types";
import { cn } from "@/lib/cn";

export * from "./phone-field.config";

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  function PhoneField(
    {
      design,
      value,
      defaultValue = "",
      onValueChange,
      countryCode,
      defaultCountryCode,
      onCountryChange,
      countries = defaultPhoneCountries,
      label,
      description,
      error,
      variant = "outline",
      fieldSize = "md",
      countryLabel = "Código de país",
      countryName,
      containerClassName,
      countrySelectClassName,
      inputClassName,
      sanitizeValue = sanitizePhoneNumber,
      className,
      id,
      disabled,
      readOnly,
      required,
      name,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const initialCountry = defaultCountryCode ?? countries[0]?.code ?? "";
    const [internalNumber, setInternalNumber] = useState(defaultValue);
    const [internalCountryCode, setInternalCountryCode] =
      useState(initialCountry);
    const currentNumber = value ?? internalNumber;
    const currentCountryCode = countryCode ?? internalCountryCode;
    const selectedCountry =
      countries.find((country) => country.code === currentCountryCode) ??
      countries[0];

    function emitValue(
      nationalNumber: string,
      country: PhoneCountry | undefined,
    ): void {
      const dialCode = country?.dialCode ?? "";
      onValueChange?.({
        countryCode: country?.code ?? "",
        dialCode,
        nationalNumber,
        internationalNumber: `${dialCode}${nationalNumber.replace(/\D/g, "")}`,
      });
    }

    function handleCountryChange(nextCountryCode: string): void {
      const nextCountry = countries.find(
        (country) => country.code === nextCountryCode,
      );
      if (countryCode === undefined) {
        setInternalCountryCode(nextCountryCode);
      }
      if (nextCountry) {
        onCountryChange?.(nextCountry);
      }
      emitValue(currentNumber, nextCountry);
    }

    function handleNumberChange(nextNumber: string): void {
      const sanitizedNumber = sanitizeValue(nextNumber);
      if (value === undefined) {
        setInternalNumber(sanitizedNumber);
      }
      emitValue(sanitizedNumber, selectedCountry);
    }

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-extrabold text-foreground"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div
          className={cn(
            "flex items-stretch overflow-hidden transition-all duration-150",
            phoneVariants[variant],
            phoneSizes[fieldSize],
            design && controlDesignStyles[design],
            error && "border-danger focus-within:border-danger",
            disabled && "cursor-not-allowed opacity-50",
            variant === "split" && "overflow-visible",
            className,
          )}
        >
          <select
            value={currentCountryCode}
            onChange={(event) => handleCountryChange(event.target.value)}
            disabled={disabled || readOnly}
            name={countryName}
            aria-label={countryLabel}
            className={cn(
              "max-w-24 shrink-0 border-r border-border bg-transparent px-2 font-extrabold text-foreground outline-none sm:max-w-28",
              "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary",
              "disabled:cursor-not-allowed",
              countrySelectClassName,
            )}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.dialCode} · {country.code}
              </option>
            ))}
          </select>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={currentNumber}
            onChange={(event) => handleNumberChange(event.target.value)}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error || description ? messageId : undefined}
            className={cn(
              "min-w-0 flex-1 bg-transparent px-3 font-semibold text-foreground outline-none",
              "placeholder:font-normal placeholder:text-muted/70",
              inputClassName,
            )}
            {...props}
          />
        </div>
        {(error || description) && (
          <p
            id={messageId}
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-danger" : "text-muted",
            )}
          >
            {error ?? description}
          </p>
        )}
      </div>
    );
  },
);
