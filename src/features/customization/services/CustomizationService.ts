import "server-only";

import { DEFAULT_CUSTOMIZATION } from "@/features/customization/config/customizationConfig";
import { CloudinaryLogoService } from "@/features/customization/services/CloudinaryLogoService";
import { CustomizationRepository } from "@/features/customization/services/CustomizationRepository";
import type {
  Customization,
  CustomizationData,
} from "@/features/customization/types/customization.types";

type PersistedCustomization = NonNullable<
  Awaited<ReturnType<typeof CustomizationRepository.findGlobal>>
>;

function toCustomization(value: PersistedCustomization): Customization {
  return {
    appName: value.appName,
    appSubtitle: value.appSubtitle,
    primaryColor: value.primaryColor,
    secondaryColor: value.secondaryColor,
    tertiaryColor: value.tertiaryColor,
    textColor: value.textColor,
    currency: value.currency,
    fontFamily: value.fontFamily,
    logoLightUrl: value.logoLightUrl,
    logoDarkUrl: value.logoDarkUrl,
    updatedAt: value.updatedAt.toISOString(),
  };
}

async function getCustomization(): Promise<Customization> {
  const customization = await CustomizationRepository.findGlobal();
  return customization ? toCustomization(customization) : DEFAULT_CUSTOMIZATION;
}

async function updateCustomization(
  data: CustomizationData,
  updatedById: string,
): Promise<Customization> {
  const current = await CustomizationRepository.findGlobal();
  const uploadedLogos: Array<
    Awaited<ReturnType<typeof CloudinaryLogoService.upload>>
  > = [];
  let logoLightUrl = current?.logoLightUrl ?? null;
  let logoLightPublicId = current?.logoLightPublicId ?? null;
  let logoDarkUrl = current?.logoDarkUrl ?? null;
  let logoDarkPublicId = current?.logoDarkPublicId ?? null;

  try {
    if (data.logoLight.action === "upload") {
      const uploaded = await CloudinaryLogoService.upload(
        data.logoLight.dataUrl,
        "light",
      );
      uploadedLogos.push(uploaded);
      logoLightUrl = uploaded.url;
      logoLightPublicId = uploaded.publicId;
    } else if (data.logoLight.action === "remove") {
      logoLightUrl = null;
      logoLightPublicId = null;
    }

    if (data.logoDark.action === "upload") {
      const uploaded = await CloudinaryLogoService.upload(
        data.logoDark.dataUrl,
        "dark",
      );
      uploadedLogos.push(uploaded);
      logoDarkUrl = uploaded.url;
      logoDarkPublicId = uploaded.publicId;
    } else if (data.logoDark.action === "remove") {
      logoDarkUrl = null;
      logoDarkPublicId = null;
    }

    const customization = await CustomizationRepository.upsertGlobal(
      {
        appName: data.appName,
        appSubtitle: data.appSubtitle,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        tertiaryColor: data.tertiaryColor,
        textColor: data.textColor,
        currency: data.currency,
        fontFamily: data.fontFamily,
        logoLightUrl,
        logoLightPublicId,
        logoDarkUrl,
        logoDarkPublicId,
      },
      updatedById,
    );

    const replacedLogoIds = [
      current?.logoLightPublicId !== logoLightPublicId
        ? current?.logoLightPublicId
        : null,
      current?.logoDarkPublicId !== logoDarkPublicId
        ? current?.logoDarkPublicId
        : null,
    ].filter((publicId): publicId is string => Boolean(publicId));

    for (const publicId of replacedLogoIds) {
      void CloudinaryLogoService.remove(publicId).catch(() => undefined);
    }

    return toCustomization(customization);
  } catch (error) {
    for (const uploadedLogo of uploadedLogos) {
      await CloudinaryLogoService.remove(uploadedLogo.publicId).catch(
        () => undefined,
      );
    }
    throw error;
  }
}

export const CustomizationService = {
  getCustomization,
  updateCustomization,
};
