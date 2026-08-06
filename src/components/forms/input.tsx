"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  LuEye,
  LuEyeOff,
  LuGlobe,
  LuMail,
  LuSearch,
  LuX,
} from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type InputVariant =
  | "outline"
  | "filled"
  | "underlined"
  | "soft"
  | "minimal"
  | "glass"
  | "elevated"
  | "contrast"
  | "customized";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  design?: DesignPreset;
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  containerClassName?: string;
  controlClassName?: string;
}

const variantStyles: Record<InputVariant, string> = {
  outline: "rounded-lg border border-border bg-surface focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10",
  filled: "rounded-lg border border-transparent bg-background focus-within:border-primary/40",
  underlined: "rounded-none border-b border-border bg-transparent focus-within:border-primary",
  soft: "rounded-lg border border-primary/10 bg-primary/5 focus-within:border-primary/40",
  minimal: "rounded-lg border border-transparent bg-transparent hover:bg-surface-hover focus-within:bg-surface",
  glass:
    "rounded-xl border border-white/25 bg-surface/70 backdrop-blur-xl focus-within:border-primary/50 focus-within:ring-3 focus-within:ring-primary/10",
  elevated:
    "rounded-xl border border-border/60 bg-surface shadow-md shadow-foreground/5 focus-within:border-primary/40 focus-within:shadow-lg",
  contrast:
    "rounded-xl border border-foreground bg-foreground text-background focus-within:ring-3 focus-within:ring-secondary/25",
  customized: "bg-transparent",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 px-2.5 text-xs",
  md: "h-11 px-3 text-sm",
  lg: "h-12 px-3.5 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    design,
    variant = "outline",
    inputSize = "md",
    label,
    description,
    error,
    success,
    leftIcon,
    rightIcon,
    fullWidth = true,
    containerClassName,
    controlClassName,
    className,
    id,
    required,
    disabled,
    readOnly,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? success ?? description;

  return (
    <div className={cn(fullWidth ? "w-full" : "inline-block", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-extrabold text-foreground">
          {label}
          {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2.5 text-muted transition-all duration-150",
          variantStyles[variant],
          sizeStyles[inputSize],
          design && controlDesignStyles[design],
          error && "border-danger focus-within:border-danger focus-within:ring-danger/10",
          success && "border-success focus-within:border-success focus-within:ring-success/10",
          disabled && "cursor-not-allowed opacity-50",
          controlClassName,
        )}
      >
        {leftIcon && <span className="grid size-5 shrink-0 place-items-center">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy ?? (message ? messageId : undefined)}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted/70",
            "disabled:cursor-not-allowed read-only:cursor-default",
            variant === "contrast" && "text-background placeholder:text-background/55",
            className,
          )}
          {...props}
        />
        {rightIcon && <span className="flex shrink-0 items-center">{rightIcon}</span>}
      </div>
      {message && (
        <p id={messageId} className={cn("mt-1.5 text-xs", error && "text-danger", success && "text-success", !error && !success && "text-muted")}>
          {message}
        </p>
      )}
    </div>
  );
});

export function PasswordInput(props: InputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      rightIcon={
        <button type="button" onClick={() => setVisible((current) => !current)} className="rounded focus-visible:outline-2 focus-visible:outline-primary" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}>
          {visible ? <LuEyeOff /> : <LuEye />}
        </button>
      }
    />
  );
}

export interface SearchInputProps extends InputProps {
  onClear?: () => void;
}

export function SearchInput({ onClear, value, ...props }: SearchInputProps) {
  return (
    <Input
      {...props}
      type="search"
      value={value}
      leftIcon={<LuSearch />}
      rightIcon={onClear && value ? <button type="button" onClick={onClear} aria-label="Limpiar búsqueda"><LuX /></button> : undefined}
    />
  );
}

export function NumberInput(props: InputProps) {
  return <Input inputMode="decimal" {...props} type="number" />;
}

export interface CurrencyInputProps extends InputProps {
  currencySymbol?: string;
}

export function CurrencyInput({ currencySymbol = "$", ...props }: CurrencyInputProps) {
  return <Input inputMode="decimal" {...props} type="number" leftIcon={<span className="font-extrabold">{currencySymbol}</span>} />;
}

export function EmailInput(props: InputProps) {
  return <Input autoComplete="email" leftIcon={<LuMail />} {...props} type="email" />;
}

export function PhoneInput(props: InputProps) {
  return <Input autoComplete="tel" inputMode="tel" {...props} type="tel" />;
}

export function URLInput(props: InputProps) {
  return <Input inputMode="url" leftIcon={<LuGlobe />} {...props} type="url" />;
}
