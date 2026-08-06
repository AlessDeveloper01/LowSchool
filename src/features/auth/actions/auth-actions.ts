"use server";

import { redirect } from "next/navigation";

import {
  registerSchema,
  signInSchema,
} from "@/features/auth/schemas/authSchema";
import { AuthService } from "@/features/auth/services/AuthService";
import type {
  AuthActionResult,
  RegisterInput,
  SignInActionResult,
  SignInInput,
} from "@/features/auth/types/auth.types";

export async function signInAction(
  input: SignInInput,
): Promise<SignInActionResult> {
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await AuthService.authenticate(parsed.data);

  if (!user) {
    return {
      success: false,
      message: "El usuario o la contraseña no son correctos.",
    };
  }

  await AuthService.createSession(user);
  return { success: true, data: user };
}

export async function registerAction(
  input: RegisterInput,
): Promise<AuthActionResult<RegisterInput>> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await AuthService.register(parsed.data);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      fieldErrors: result.field ? { [result.field]: [result.message] } : undefined,
    };
  }

  await AuthService.createSession(result.user);
  redirect("/orders");
}

export async function signOutAction(): Promise<void> {
  await AuthService.deleteSession();
  redirect("/login");
}

export async function clearServerSessionAction(): Promise<void> {
  await AuthService.deleteSession();
}
