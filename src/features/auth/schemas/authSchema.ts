import { z } from "zod";

export const userRoleSchema = z.enum(["SUPER_ADMIN", "MESERO", "CLIENTE"]);

export const signInSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .min(1, "El correo electrónico o username es obligatorio")
    .max(120, "El identificador es demasiado largo"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .max(72, "La contraseña es demasiado larga"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre es demasiado largo"),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "El username debe tener al menos 3 caracteres")
      .max(30, "El username no puede superar 30 caracteres")
      .regex(
        /^[a-z0-9._-]+$/,
        "Usa sólo letras, números, punto, guion o guion bajo",
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "El correo es demasiado largo")
      .email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(72, "La contraseña no puede superar 72 caracteres")
      .regex(/[A-Z]/, "Agrega al menos una letra mayúscula")
      .regex(/[a-z]/, "Agrega al menos una letra minúscula")
      .regex(/\d/, "Agrega al menos un número")
      .regex(/[^A-Za-z0-9]/, "Agrega al menos un símbolo"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })
  .transform((values) => ({
    name: values.name,
    username: values.username,
    email: values.email,
    password: values.password,
  }));

export const sessionUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  role: userRoleSchema,
});
