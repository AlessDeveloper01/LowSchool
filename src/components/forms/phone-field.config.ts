import type { InputHTMLAttributes } from "react";
import type { DesignPreset } from "@/components/types";

export interface PhoneCountry {
  code: string;
  dialCode: string;
  label: string;
}

export const defaultPhoneCountries: readonly PhoneCountry[] = [
  { code: "MX", dialCode: "+52", label: "México" },
  { code: "US", dialCode: "+1", label: "Estados Unidos" },
  { code: "ES", dialCode: "+34", label: "España" },
  { code: "AR", dialCode: "+54", label: "Argentina" },
  { code: "CO", dialCode: "+57", label: "Colombia" },
  { code: "CL", dialCode: "+56", label: "Chile" },
  { code: "PE", dialCode: "+51", label: "Perú" },
];

export interface PhoneFieldValue {
  countryCode: string;
  dialCode: string;
  nationalNumber: string;
  internationalNumber: string;
}

export type PhoneFieldVariant =
  | "outline"
  | "soft"
  | "filled"
  | "pill"
  | "split"
  | "customized";

export interface PhoneFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "defaultValue" | "onChange" | "size" | "type" | "value"
  > {
  design?: DesignPreset;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: PhoneFieldValue) => void;
  countryCode?: string;
  defaultCountryCode?: string;
  onCountryChange?: (country: PhoneCountry) => void;
  countries?: readonly PhoneCountry[];
  label?: string;
  description?: string;
  error?: string;
  variant?: PhoneFieldVariant;
  fieldSize?: "sm" | "md" | "lg";
  countryLabel?: string;
  countryName?: string;
  containerClassName?: string;
  countrySelectClassName?: string;
  inputClassName?: string;
  sanitizeValue?: (value: string) => string;
}

export const phoneVariants: Record<PhoneFieldVariant, string> = {
  outline:
    "rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10",
  soft:
    "rounded-xl border border-primary/10 bg-primary/5 focus-within:border-primary/40",
  filled:
    "rounded-xl border border-transparent bg-surface-hover focus-within:border-primary/40",
  pill:
    "rounded-full border border-border bg-surface focus-within:border-secondary focus-within:ring-3 focus-within:ring-secondary/10",
  split:
    "gap-2 bg-transparent [&>select]:rounded-xl [&>select]:border [&>select]:border-border [&>select]:bg-surface [&>input]:rounded-xl [&>input]:border [&>input]:border-border [&>input]:bg-surface",
  customized: "",
};

export const phoneSizes: Record<
  NonNullable<PhoneFieldProps["fieldSize"]>,
  string
> = {
  sm: "h-9 text-xs",
  md: "h-11 text-sm",
  lg: "h-12 text-base",
};

export function sanitizePhoneNumber(value: string): string {
  return value.replace(/[^\d\s().-]/g, "");
}
