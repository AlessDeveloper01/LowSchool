"use server";

import { AuthService } from "@/features/auth/services/AuthService";
import {
  updateProfileSchema,
  type UpdateProfileData,
} from "@/features/profile/schemas/update-profile.schema";
import { updateProfileService } from "@/features/profile/services/ProfileService";

export async function updateProfileAction(
  input: UpdateProfileData,
): Promise<boolean> {
  const actor = await AuthService.getSessionUser();
  if (!actor) {
    console.error("[profile:update] Sesión no válida o vencida.");
    return false;
  }

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    console.error(
      "[profile:update] Validación rechazada:",
      parsed.error.flatten().fieldErrors,
    );
    return false;
  }

  const updated = await updateProfileService(parsed.data, actor.id);
  console.log("Profile updated:", updated);
  return updated;
}
