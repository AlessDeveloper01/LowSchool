import "server-only";

import { SchoolYearRepository } from "@/features/school-years/services/SchoolYearRepository";
import type {
  CreateSchoolYearData,
  DeleteSchoolYearData,
  ManagedSchoolYear,
  SchoolYearStatusData,
  UpdateSchoolYearData,
} from "@/features/school-years/types/school-year.types";

export class SchoolYearServiceError extends Error {
  constructor(message: string, readonly field?: "nombre") {
    super(message);
    this.name = "SchoolYearServiceError";
  }
}

type PersistedSchoolYear = Awaited<ReturnType<typeof SchoolYearRepository.findAll>>[number];

function toSchoolYear(schoolYear: PersistedSchoolYear): ManagedSchoolYear {
  return {
    id: schoolYear.id,
    nombre: schoolYear.nombre,
    activo: schoolYear.activo,
    groupsCount: schoolYear._count.grupos,
  };
}

function isPrismaError(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function ensureUnique(nombre: string, excludeId?: string): Promise<void> {
  if (await SchoolYearRepository.findByName(nombre, excludeId)) {
    throw new SchoolYearServiceError("Ese ciclo escolar ya está registrado.", "nombre");
  }
}

async function listSchoolYears(): Promise<ManagedSchoolYear[]> {
  return (await SchoolYearRepository.findAll()).map(toSchoolYear);
}

async function createSchoolYear(data: CreateSchoolYearData): Promise<ManagedSchoolYear> {
  await ensureUnique(data.nombre);
  try {
    return toSchoolYear(await SchoolYearRepository.create(data));
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      throw new SchoolYearServiceError("Ese ciclo escolar ya está registrado.", "nombre");
    }
    throw error;
  }
}

async function updateSchoolYear(data: UpdateSchoolYearData): Promise<ManagedSchoolYear> {
  if (!(await SchoolYearRepository.findById(data.id))) {
    throw new SchoolYearServiceError("El ciclo escolar ya no existe.");
  }
  await ensureUnique(data.nombre, data.id);
  try {
    return toSchoolYear(await SchoolYearRepository.update(data));
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      throw new SchoolYearServiceError("Ese ciclo escolar ya está registrado.", "nombre");
    }
    throw error;
  }
}

async function setSchoolYearStatus(data: SchoolYearStatusData): Promise<ManagedSchoolYear> {
  const current = await SchoolYearRepository.findById(data.id);
  if (!current) throw new SchoolYearServiceError("El ciclo escolar ya no existe.");
  if (current.activo === data.activo) {
    throw new SchoolYearServiceError(data.activo ? "El ciclo escolar ya está activo." : "El ciclo escolar ya está inactivo.");
  }
  return toSchoolYear(await SchoolYearRepository.setActive(data.id, data.activo));
}

async function deleteSchoolYear(data: DeleteSchoolYearData): Promise<void> {
  const current = await SchoolYearRepository.findById(data.id);
  if (!current) throw new SchoolYearServiceError("El ciclo escolar ya no existe.");
  if (current._count.grupos > 0) {
    throw new SchoolYearServiceError("No puedes eliminar un ciclo escolar que tiene grupos registrados.");
  }
  try {
    await SchoolYearRepository.remove(data.id);
  } catch (error) {
    if (isPrismaError(error, "P2003")) {
      throw new SchoolYearServiceError("No puedes eliminar un ciclo escolar que tiene información relacionada.");
    }
    throw error;
  }
}

export const SchoolYearService = {
  listSchoolYears,
  createSchoolYear,
  updateSchoolYear,
  setSchoolYearStatus,
  deleteSchoolYear,
};