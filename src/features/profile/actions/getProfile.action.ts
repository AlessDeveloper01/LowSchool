"use server";

import { AuthService } from "@/features/auth/services/AuthService";
import type { SessionUser } from "@/features/auth/types/auth.types";

export async function getProfileAction(): Promise<SessionUser | null> {
  return AuthService.getSessionUser();
}