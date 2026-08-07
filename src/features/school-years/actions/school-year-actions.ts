"use server";

import { revalidatePath } from "next/cache";

import { AuthService } from "@/features/auth/services/AuthService";
import {
  createSchoolYearSchema,
  deleteSchoolYearSchema,
  schoolYearStatusSchema,
  updateSchoolYearSchema,
} from "@/features/school-years/schemas/schoolYearSchema";
import {
  SchoolYearService,
  SchoolYearServiceError,
} from "@/features/school-years/services/SchoolYearService";
import type { SchoolYearActionResult } from "@/features/school-years/types/school-year.types";

const SCHOOL_YEARS_PATH = "/school-years";

async function administrator() {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" ? user : null;
}

function failure(error: unknown): SchoolYearActionResult {
  if (error instanceof SchoolYearServiceError) {
    return {
      success: false,
      message: error.message,
      fieldErrors: error.field ? { [error.field]: [error.message] } : undefined,
    };
  }
  return {
    success: false,
    message: "No fue posible completar la operación. Inténtalo nuevamente.",
  };
}

export async function createSchoolYearAction(
  input: unknown,
): Promise<SchoolYearActionResult> {
  if (!(await administrator()))
    return {
      success: false,
      message: "No tienes permisos para administrar ciclos escolares.",
    };
  const parsed = createSchoolYearSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Revisa el formato del ciclo escolar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const data = await SchoolYearService.createSchoolYear(parsed.data);
    revalidatePath(SCHOOL_YEARS_PATH);
    return {
      success: true,
      message: "Ciclo escolar creado correctamente.",
      data,
    };
  } catch (error) {
    return failure(error);
  }
}

export async function updateSchoolYearAction(
  input: unknown,
): Promise<SchoolYearActionResult> {
  if (!(await administrator()))
    return {
      success: false,
      message: "No tienes permisos para administrar ciclos escolares.",
    };
  const parsed = updateSchoolYearSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Revisa el formato del ciclo escolar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  try {
    const data = await SchoolYearService.updateSchoolYear(parsed.data);
    revalidatePath(SCHOOL_YEARS_PATH);
    return {
      success: true,
      message: "Ciclo escolar actualizado correctamente.",
      data,
    };
  } catch (error) {
    return failure(error);
  }
}

export async function setSchoolYearStatusAction(
  input: unknown,
): Promise<SchoolYearActionResult> {
  if (!(await administrator()))
    return {
      success: false,
      message: "No tienes permisos para administrar ciclos escolares.",
    };
  const parsed = schoolYearStatusSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "El ciclo escolar seleccionado no es válido.",
    };
  try {
    const data = await SchoolYearService.setSchoolYearStatus(parsed.data);
    revalidatePath(SCHOOL_YEARS_PATH);
    return {
      success: true,
      message: parsed.data.activo
        ? "Ciclo escolar activado correctamente."
        : "Ciclo escolar desactivado correctamente.",
      data,
    };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteSchoolYearAction(
  input: unknown,
): Promise<SchoolYearActionResult> {
  if (!(await administrator()))
    return {
      success: false,
      message: "No tienes permisos para administrar ciclos escolares.",
    };
  const parsed = deleteSchoolYearSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "El ciclo escolar seleccionado no es válido.",
    };
  try {
    await SchoolYearService.deleteSchoolYear(parsed.data);
    revalidatePath(SCHOOL_YEARS_PATH);
    return { success: true, message: "Ciclo escolar eliminado correctamente." };
  } catch (error) {
    return failure(error);
  }
}
