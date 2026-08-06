import { z } from "zod";

import { userRoleSchema } from "@/features/auth/schemas/authSchema";

const idSchema = z.string().cuid("El usuario no es válido.");
const nameSchema = z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(100, "El nombre es demasiado largo.");
const usernameSchema = z.string().trim().toLowerCase().min(3, "El username debe tener al menos 3 caracteres.").max(30, "El username no puede superar 30 caracteres.").regex(/^[a-z0-9._-]+$/, "Usa sólo letras, números, punto, guion o guion bajo.");
const emailSchema = z.string().trim().toLowerCase().max(254, "El correo es demasiado largo.").email("Ingresa un correo electrónico válido.");
const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72, "La contraseña no puede superar 72 caracteres.").regex(/[A-Z]/, "Agrega al menos una letra mayúscula.").regex(/[a-z]/, "Agrega al menos una letra minúscula.").regex(/\d/, "Agrega al menos un número.").regex(/[^A-Za-z0-9]/, "Agrega al menos un símbolo.");

const userFields = {
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  role: userRoleSchema,
};

export const createUserSchema = z.object({
  ...userFields,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirma la contraseña."),
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Las contraseñas no coinciden.",
}).transform((value) => ({
  name: value.name,
  username: value.username,
  email: value.email,
  role: value.role,
  password: value.password,
}));

export const updateUserSchema = z.object({
  id: idSchema,
  ...userFields,
  password: z.union([z.literal(""), passwordSchema]),
  confirmPassword: z.string(),
}).superRefine((value, context) => {
  if (value.password && value.password !== value.confirmPassword) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Las contraseñas no coinciden." });
  }
}).transform((value) => ({
  id: value.id,
  name: value.name,
  username: value.username,
  email: value.email,
  role: value.role,
  password: value.password || undefined,
}));

export const userStatusSchema = z.object({
  id: idSchema,
  isActive: z.boolean(),
});
