import type { z } from "zod";

import type {
  registerSchema,
  sessionUserSchema,
  signInSchema,
  userRoleSchema,
} from "@/features/auth/schemas/authSchema";

export type UserRole = z.infer<typeof userRoleSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;

export type SignInInput = z.input<typeof signInSchema>;
export type SignInData = z.output<typeof signInSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterData = z.output<typeof registerSchema>;

export interface AuthActionResult<TInput, TData = never> {
  success: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof TInput, string[]>>;
  data?: TData;
}

export type SignInActionResult = AuthActionResult<SignInInput, SessionUser>;

export type RegistrationResult =
  | { success: true; user: SessionUser }
  | {
      success: false;
      field?: "username" | "email";
      message: string;
    };
