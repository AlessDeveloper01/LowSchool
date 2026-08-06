import "server-only";

import { getPrisma } from "@/lib/prisma";
import type {
  AppFontFamily,
  CurrencyCode,
} from "@/features/customization/types/customization.types";

const GLOBAL_CUSTOMIZATION_ID = "global";

const customizationSelect = {
  appName: true,
  appSubtitle: true,
  primaryColor: true,
  secondaryColor: true,
  tertiaryColor: true,
  textColor: true,
  currency: true,
  fontFamily: true,
  logoLightUrl: true,
  logoLightPublicId: true,
  logoDarkUrl: true,
  logoDarkPublicId: true,
  updatedAt: true,
} as const;

interface PersistedCustomizationInput {
  appName: string;
  appSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  textColor: string;
  currency: CurrencyCode;
  fontFamily: AppFontFamily;
  logoLightUrl: string | null;
  logoLightPublicId: string | null;
  logoDarkUrl: string | null;
  logoDarkPublicId: string | null;
}

async function findGlobal() {
  return getPrisma().appCustomization.findUnique({
    where: { id: GLOBAL_CUSTOMIZATION_ID },
    select: customizationSelect,
  });
}

async function upsertGlobal(
  data: PersistedCustomizationInput,
  updatedById: string,
) {
  return getPrisma().appCustomization.upsert({
    where: { id: GLOBAL_CUSTOMIZATION_ID },
    create: {
      id: GLOBAL_CUSTOMIZATION_ID,
      ...data,
      updatedById,
    },
    update: {
      ...data,
      updatedById,
    },
    select: customizationSelect,
  });
}

export const CustomizationRepository = {
  findGlobal,
  upsertGlobal,
};
