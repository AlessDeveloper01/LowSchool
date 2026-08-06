import type { CurrencyCode } from "@/features/customization/types/customization.types";

const currencyLocales: Record<CurrencyCode, string> = {
  MXN: "es-MX",
  USD: "en-US",
  EUR: "es-ES",
  COP: "es-CO",
  ARS: "es-AR",
  BRL: "pt-BR",
};

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  options: { compact?: boolean } = {},
): string {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: "currency",
    currency,
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: options.compact ? 1 : 2,
  }).format(value);
}
