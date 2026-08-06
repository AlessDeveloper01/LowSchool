"use client";

import { formatCurrency } from "@/features/customization/lib/currency";
import { useCustomizationStore } from "@/features/customization/store/customizationStore";

interface CurrencyAmountProps {
  value: number;
  compact?: boolean;
}

export function CurrencyAmount({ value, compact = false }: CurrencyAmountProps) {
  const currency = useCustomizationStore((state) => state.settings.currency);
  return <>{formatCurrency(value, currency, { compact })}</>;
}
