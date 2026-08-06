import { customizationSchema } from "@/features/customization/schemas/customizationSchema";
import type { Customization } from "@/features/customization/types/customization.types";

export const CUSTOMIZATION_CACHE_KEY = "lowpos-customization";

export function readCachedCustomization(): Customization | null {
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_CACHE_KEY);
    if (!raw) return null;

    const parsed = customizationSchema.safeParse(JSON.parse(raw) as unknown);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function cacheCustomization(customization: Customization): void {
  localStorage.setItem(CUSTOMIZATION_CACHE_KEY, JSON.stringify(customization));
}
