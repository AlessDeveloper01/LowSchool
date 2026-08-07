"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AuthService } from "@/features/auth/services/AuthService";
import { getPrisma } from "@/lib/prisma";

const SUBJECTS_PATH = "/subjects";

const idSchema = z.string().cuid("La materia no es válida.");
const nameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres.")
  .max(100, "El nombre no puede superar 100 caracteres.");

const subjectSchema = z.object({ nombre: nameSchema });
const updateSubjectSchema = subjectSchema.extend({ id: idSchema });
const deleteSubjectSchema = z.object({ id: idSchema });

const subjectSelect = {
  id: true,
  nombre: true,
  _count: { select: { grupos: true } },
} as const;

export interface ManagedSubject {
  id: string;
  nombre: string;
  groupsCount: number;
}

export interface SubjectActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: ManagedSubject;
}

class SubjectError extends Error {
  constructor(message: string, readonly field?: "nombre") {
    super(message);
    this.name = "SubjectError";
  }
}

function mapSubject(subject: {
  id: string;
  nombre: string;
  _count: { grupos: number };
}): ManagedSubject {
  return {
    id: subject.id,
    nombre: subject.nombre,
    groupsCount: subject._count.grupos,
  };
}

function failure(error: unknown): SubjectActionResult {
  if (error instanceof SubjectError) {
    return {
      success: false,
      message: error.message,
      fieldErrors: error.field
        ? { [error.field]: [error.message] }
        : undefined,
    };
  }

  return {
    success: false,
    message: "No fue posible completar la operación. Inténtalo nuevamente.",
  };
}

function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

async function canManageSubjects(): Promise<boolean> {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
}

async function findByName(nombre: string, excludeId?: string) {
  return getPrisma().materia.findFirst({
    where: {
      nombre: { equals: nombre, mode: "insensitive" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
}

async function ensureUniqueName(nombre: string, excludeId?: string): Promise<void> {
  if (await findByName(nombre, excludeId)) {
    throw new SubjectError("Ya existe una materia con ese nombre.", "nombre");
  }
}

export async function listSubjects(): Promise<ManagedSubject[]> {
  const user = await AuthService.getSessionUser();
  if (!user) return [];

  const subjects = await getPrisma().materia.findMany({
    select: subjectSelect,
    orderBy: { nombre: "asc" },
  });

  return subjects.map(mapSubject);
}

export async function createSubjectAction(
  input: unknown,
): Promise<SubjectActionResult> {
  if (!(await canManageSubjects())) {
    return {
      success: false,
      message: "No tienes permisos para administrar materias.",
    };
  }

  const parsed = subjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa el nombre de la materia.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await ensureUniqueName(parsed.data.nombre);
    const subject = await getPrisma().materia.create({
      data: parsed.data,
      select: subjectSelect,
    });
    revalidatePath(SUBJECTS_PATH);
    return {
      success: true,
      message: "Materia creada correctamente.",
      data: mapSubject(subject),
    };
  } catch (error) {
    return failure(error);
  }
}

export async function updateSubjectAction(
  input: unknown,
): Promise<SubjectActionResult> {
  if (!(await canManageSubjects())) {
    return {
      success: false,
      message: "No tienes permisos para administrar materias.",
    };
  }

  const parsed = updateSubjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa el nombre de la materia.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const current = await getPrisma().materia.findUnique({
      where: { id: parsed.data.id },
      select: { id: true },
    });
    if (!current) throw new SubjectError("La materia ya no existe.");

    await ensureUniqueName(parsed.data.nombre, parsed.data.id);
    const subject = await getPrisma().materia.update({
      where: { id: parsed.data.id },
      data: { nombre: parsed.data.nombre },
      select: subjectSelect,
    });
    revalidatePath(SUBJECTS_PATH);
    return {
      success: true,
      message: "Materia actualizada correctamente.",
      data: mapSubject(subject),
    };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteSubjectAction(
  input: unknown,
): Promise<SubjectActionResult> {
  if (!(await canManageSubjects())) {
    return {
      success: false,
      message: "No tienes permisos para administrar materias.",
    };
  }

  const parsed = deleteSubjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "La materia seleccionada no es válida." };
  }

  try {
    const subject = await getPrisma().materia.findUnique({
      where: { id: parsed.data.id },
      select: subjectSelect,
    });
    if (!subject) throw new SubjectError("La materia ya no existe.");
    if (subject._count.grupos > 0) {
      throw new SubjectError(
        "No puedes eliminar una materia que ya está asignada a grupos.",
      );
    }

    await getPrisma().materia.delete({ where: { id: parsed.data.id } });
    revalidatePath(SUBJECTS_PATH);
    return { success: true, message: "Materia eliminada correctamente." };
  } catch (error) {
    if (isPrismaError(error, "P2003")) {
      return {
        success: false,
        message: "No puedes eliminar una materia que tiene información relacionada.",
      };
    }
    return failure(error);
  }
}