import "server-only";

import { hash } from "bcryptjs";

import type { UpdateProfileData } from "@/features/profile/schemas/update-profile.schema";
import { ProfileRepository } from "@/features/profile/services/ProfileRepository";

const PASSWORD_SALT_ROUNDS = 12;

export async function updateProfileService(
  data: UpdateProfileData,
  id: string,
): Promise<boolean> {
  try {
    if (data.email) {
      const repeatedEmail = await ProfileRepository.findUniqueEmail(data.email);
      if (repeatedEmail && repeatedEmail.id !== id) return false;
    }

    const passwordHash = data.password
      ? await hash(data.password, PASSWORD_SALT_ROUNDS)
      : undefined;

    await ProfileRepository.update(
      {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      id,
    );
    return true;
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return false;
  }
}
