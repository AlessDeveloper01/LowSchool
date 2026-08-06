"use server";

import { revalidatePath } from "next/cache";

import { AuthService } from "@/features/auth/services/AuthService";
import { createUserSchema, updateUserSchema, userStatusSchema } from "@/features/users/schemas/userSchema";
import { UserService, UserServiceError } from "@/features/users/services/UserService";
import type { CreateUserInput, UpdateUserInput, UserActionResult, UserStatusInput } from "@/features/users/types/user.types";

const USERS_PATH = "/users";

async function administrator() {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" ? user : null;
}

function failure(error: unknown): UserActionResult {
  if (error instanceof UserServiceError) {
    return { success: false, message: error.message, fieldErrors: error.field ? { [error.field]: [error.message] } : undefined };
  }
  return { success: false, message: "No fue posible completar la operación. Inténtalo nuevamente." };
}

export async function createUserAction(input: CreateUserInput): Promise<UserActionResult> {
  if (!(await administrator())) return { success: false, message: "No tienes permisos para administrar usuarios." };
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const user = await UserService.createUser(parsed.data);
    revalidatePath(USERS_PATH);
    return { success: true, message: "Usuario creado correctamente.", data: user };
  } catch (error) {
    return failure(error);
  }
}

export async function updateUserAction(input: UpdateUserInput): Promise<UserActionResult> {
  const actor = await administrator();
  if (!actor) return { success: false, message: "No tienes permisos para administrar usuarios." };
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const user = await UserService.updateUser(parsed.data, actor.id);
    revalidatePath(USERS_PATH);
    return { success: true, message: "Usuario actualizado correctamente.", data: user };
  } catch (error) {
    return failure(error);
  }
}

export async function setUserStatusAction(input: UserStatusInput): Promise<UserActionResult> {
  const actor = await administrator();
  if (!actor) return { success: false, message: "No tienes permisos para administrar usuarios." };
  const parsed = userStatusSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "El usuario seleccionado no es válido.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const user = await UserService.setUserStatus(parsed.data, actor.id);
    revalidatePath(USERS_PATH);
    return { success: true, message: parsed.data.isActive ? "Usuario activado correctamente." : "Usuario desactivado correctamente.", data: user };
  } catch (error) {
    return failure(error);
  }
}

