import {
  PatternInput,
  type PatternInputProps,
} from "./pattern-core";

export interface CreditCardInputProps
  extends Omit<PatternInputProps, "pattern"> {
  compact?: boolean;
}

export function CreditCardInput({
  compact = false,
  ...props
}: CreditCardInputProps) {
  return (
    <PatternInput
      pattern={compact ? "9999 9999 9999 9999" : "9999 9999 9999 9999 999"}
      autoComplete="cc-number"
      inputMode="numeric"
      placeholder="0000 0000 0000 0000"
      {...props}
    />
  );
}

export function PostalCodeInput(
  props: Omit<PatternInputProps, "pattern">,
) {
  return (
    <PatternInput
      pattern="99999"
      inputMode="numeric"
      autoComplete="postal-code"
      placeholder="00000"
      {...props}
    />
  );
}
