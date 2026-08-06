import type { z } from "zod";

import type {
  appFontFamilySchema,
  currencyCodeSchema,
  customizationInputSchema,
  customizationSchema,
} from "@/features/customization/schemas/customizationSchema";

export type CurrencyCode = z.infer<typeof currencyCodeSchema>;
export type AppFontFamily = z.infer<typeof appFontFamilySchema>;
export type CustomizationInput = z.input<typeof customizationInputSchema>;
export type CustomizationData = z.output<typeof customizationInputSchema>;
export type Customization = z.infer<typeof customizationSchema>;

export interface CustomizationActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof CustomizationInput, string[]>>;
  data?: Customization;
}
