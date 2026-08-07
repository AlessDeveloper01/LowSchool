import { z } from "zod";

const idSchema = z.string().cuid("El ciclo escolar no es válido.");

const nameSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{4}$/, "Usa el formato AAAA-AAAA.")
  .refine((value) => Number(value.slice(5)) === Number(value.slice(0, 4)) + 1, {
    message: "El segundo año debe ser consecutivo al primero.",
  });

export const createSchoolYearSchema = z.object({
  nombre: nameSchema,
});

export const updateSchoolYearSchema = z.object({
  id: idSchema,
  nombre: nameSchema,
});

export const schoolYearStatusSchema = z.object({
  id: idSchema,
  activo: z.boolean(),
});

export const deleteSchoolYearSchema = z.object({
  id: idSchema,
});