import type { z } from "zod";

import type { UserRole } from "@/features/auth/types/auth.types";
import type { createUserSchema, updateUserSchema, userStatusSchema } from "@/features/users/schemas/userSchema";

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormInput {
  name: string;
  username: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUserData = z.output<typeof createUserSchema>;
export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type UpdateUserData = z.output<typeof updateUserSchema>;
export type UserStatusInput = z.input<typeof userStatusSchema>;
export type UserStatusData = z.output<typeof userStatusSchema>;
export type UserStatusFilter = "all" | "active" | "inactive";
export type UserModal = "create" | "edit" | "deactivate" | "activate" | null;

export interface UserActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: ManagedUser;
}

