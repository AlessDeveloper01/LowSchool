import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(100)
      .optional(),
    email: z.email({ message: "El email no es válido" }).optional(),
    password: z.string().optional(),
    "confirm-password": z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const password = data.password ?? "";
    const confirmPassword = data["confirm-password"] ?? "";

    // Ambos vacíos: el usuario no quiere cambiar la contraseña, todo bien
    if (password === "" && confirmPassword === "") return;

    if (password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La contraseña debe tener al menos 6 caracteres",
        path: ["password"],
      });
    }

    if (confirmPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La contraseña debe tener al menos 6 caracteres",
        path: ["confirm-password"],
      });
    }

    if (password && confirmPassword && password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["confirm-password"],
      });
    }
  });

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;