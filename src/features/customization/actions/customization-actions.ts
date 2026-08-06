"use server";

import { revalidatePath } from "next/cache";

import { AuthService } from "@/features/auth/services/AuthService";
import { customizationInputSchema } from "@/features/customization/schemas/customizationSchema";
import { LogoStorageError } from "@/features/customization/services/CloudinaryLogoService";
import { CustomizationService } from "@/features/customization/services/CustomizationService";
import type {
  CustomizationActionResult,
  CustomizationInput,
} from "@/features/customization/types/customization.types";

export async function updateCustomizationAction(
  input: CustomizationInput,
): Promise<CustomizationActionResult> {
  const user = await AuthService.getSessionUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "No tienes permisos para modificar la personalización global.",
    };
  }

  const parsed = customizationInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const customization = await CustomizationService.updateCustomization(
      parsed.data,
      user.id,
    );

    revalidatePath("/settings/customization");

    return {
      success: true,
      message: "La personalización se guardó para todos los dispositivos.",
      data: customization,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof LogoStorageError
          ? error.message
          : "No fue posible guardar la personalización. Inténtalo nuevamente.",
    };
  }
}
