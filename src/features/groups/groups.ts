"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AuthService } from "@/features/auth/services/AuthService";
import { getPrisma } from "@/lib/prisma";

const GROUPS_PATH = "/groups";
const idSchema = z.string().cuid("El identificador no es válido.");
const subjectIdsSchema = z
  .array(idSchema)
  .max(100, "No puedes asignar más de 100 materias.")
  .refine((values) => new Set(values).size === values.length, "No repitas materias.");

const groupFields = {
  cicloEscolarId: idSchema,
  grado: z.coerce.number().int("El grado debe ser entero.").min(1, "El grado mínimo es 1.").max(3, "El grado máximo es 3."),
  letra: z.string().trim().toUpperCase().regex(/^[A-Z]$/, "La letra debe ser una sola letra de A a Z."),
  materias: subjectIdsSchema.default([]),
};

const groupSchema = z.object(groupFields);
const updateGroupSchema = groupSchema.extend({ id: idSchema });
const deleteGroupSchema = z.object({ id: idSchema });
const promoteGroupSchema = z.object({
  sourceGroupId: idSchema,
  targetCicloEscolarId: idSchema,
  targetGrado: z.coerce.number().int().min(1).max(3),
  targetLetra: z.string().trim().toUpperCase().regex(/^[A-Z]$/, "La letra debe ser una sola letra de A a Z."),
});

const groupSelect = {
  id: true,
  grado: true,
  letra: true,
  cicloEscolar: { select: { id: true, nombre: true, activo: true } },
  materias: {
    select: {
      id: true,
      materiaId: true,
      materia: { select: { nombre: true } },
      _count: { select: { calificaciones: true, asistencias: true } },
    },
    orderBy: { materia: { nombre: "asc" } },
  },
  _count: { select: { inscripciones: true } },
} as const;

export interface ManagedGroup {
  id: string;
  grado: number;
  letra: string;
  cicloEscolar: { id: string; nombre: string; activo: boolean };
  materias: Array<{
    id: string;
    materiaId: string;
    nombre: string;
    calificacionesCount: number;
    asistenciasCount: number;
  }>;
  studentsCount: number;
  hasAcademicRecords: boolean;
}

export interface GroupOptions {
  schoolYears: Array<{ id: string; nombre: string; activo: boolean }>;
  subjects: Array<{ id: string; nombre: string }>;
}

export interface GroupActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: ManagedGroup;
  promotedCount?: number;
}

class GroupError extends Error {
  constructor(message: string, readonly field?: keyof typeof groupFields) {
    super(message);
    this.name = "GroupError";
  }
}

function mapGroup(group: {
  id: string;
  grado: number;
  letra: string;
  cicloEscolar: { id: string; nombre: string; activo: boolean };
  materias: Array<{
    id: string;
    materiaId: string;
    materia: { nombre: string };
    _count: { calificaciones: number; asistencias: number };
  }>;
  _count: { inscripciones: number };
}): ManagedGroup {
  const materias = group.materias.map((materia) => ({
    id: materia.id,
    materiaId: materia.materiaId,
    nombre: materia.materia.nombre,
    calificacionesCount: materia._count.calificaciones,
    asistenciasCount: materia._count.asistencias,
  }));

  return {
    id: group.id,
    grado: group.grado,
    letra: group.letra,
    cicloEscolar: group.cicloEscolar,
    materias,
    studentsCount: group._count.inscripciones,
    hasAcademicRecords: materias.some(
      (materia) => materia.calificacionesCount > 0 || materia.asistenciasCount > 0,
    ),
  };
}

function isPrismaError(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

function failure(error: unknown): GroupActionResult {
  if (error instanceof GroupError) {
    return {
      success: false,
      message: error.message,
      fieldErrors: error.field ? { [error.field]: [error.message] } : undefined,
    };
  }

  return { success: false, message: "No fue posible completar la operación. Inténtalo nuevamente." };
}

async function canManageGroups(): Promise<boolean> {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
}

async function ensureReferences(cicloEscolarId: string, materias: string[]): Promise<void> {
  const prisma = getPrisma();
  const [schoolYear, subjectsCount] = await Promise.all([
    prisma.cicloEscolar.findUnique({ where: { id: cicloEscolarId }, select: { id: true } }),
    materias.length === 0 ? Promise.resolve(0) : prisma.materia.count({ where: { id: { in: materias } } }),
  ]);

  if (!schoolYear) throw new GroupError("El ciclo escolar seleccionado no existe.", "cicloEscolarId");
  if (subjectsCount !== materias.length) throw new GroupError("Una o más materias seleccionadas no existen.", "materias");
}

async function ensureUniqueGroup(cicloEscolarId: string, grado: number, letra: string, excludeId?: string): Promise<void> {
  const group = await getPrisma().grupo.findFirst({
    where: { cicloEscolarId, grado, letra, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
  if (group) throw new GroupError("Ya existe ese grupo en el ciclo escolar seleccionado.");
}

export async function listGroups(): Promise<ManagedGroup[]> {
  if (!(await AuthService.getSessionUser())) return [];
  const groups = await getPrisma().grupo.findMany({
    select: groupSelect,
    orderBy: [{ grado: "asc" }, { letra: "asc" }],
  });
  return groups.map(mapGroup);
}

export async function listGroupOptions(): Promise<GroupOptions> {
  if (!(await AuthService.getSessionUser())) return { schoolYears: [], subjects: [] };
  const prisma = getPrisma();
  const [schoolYears, subjects] = await Promise.all([
    prisma.cicloEscolar.findMany({
      select: { id: true, nombre: true, activo: true },
      orderBy: [{ activo: "desc" }, { nombre: "desc" }],
    }),
    prisma.materia.findMany({ select: { id: true, nombre: true }, orderBy: { nombre: "asc" } }),
  ]);
  return { schoolYears, subjects };
}

export async function createGroupAction(input: unknown): Promise<GroupActionResult> {
  if (!(await canManageGroups())) return { success: false, message: "No tienes permisos para administrar grupos." };
  const parsed = groupSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los datos del grupo.", fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    await ensureReferences(parsed.data.cicloEscolarId, parsed.data.materias);
    await ensureUniqueGroup(parsed.data.cicloEscolarId, parsed.data.grado, parsed.data.letra);
    const prisma = getPrisma();
    const group = await prisma.$transaction(async (transaction) => {
      const created = await transaction.grupo.create({ data: { cicloEscolarId: parsed.data.cicloEscolarId, grado: parsed.data.grado, letra: parsed.data.letra } });
      if (parsed.data.materias.length > 0) {
        await transaction.materiaGrupo.createMany({ data: parsed.data.materias.map((materiaId) => ({ materiaId, grupoId: created.id })) });
      }
      return transaction.grupo.findUniqueOrThrow({ where: { id: created.id }, select: groupSelect });
    });
    revalidatePath(GROUPS_PATH);
    return { success: true, message: "Grupo creado correctamente.", data: mapGroup(group) };
  } catch (error) {
    if (isPrismaError(error, "P2002")) return { success: false, message: "Ya existe ese grupo en el ciclo escolar seleccionado." };
    return failure(error);
  }
}

export async function updateGroupAction(input: unknown): Promise<GroupActionResult> {
  if (!(await canManageGroups())) return { success: false, message: "No tienes permisos para administrar grupos." };
  const parsed = updateGroupSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los datos del grupo.", fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const prisma = getPrisma();
    const current = await prisma.grupo.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
    if (!current) throw new GroupError("El grupo ya no existe.");
    await ensureReferences(parsed.data.cicloEscolarId, parsed.data.materias);
    await ensureUniqueGroup(parsed.data.cicloEscolarId, parsed.data.grado, parsed.data.letra, parsed.data.id);

    const existingAssignments = await prisma.materiaGrupo.findMany({
      where: { grupoId: parsed.data.id },
      select: { id: true, materiaId: true, _count: { select: { calificaciones: true, asistencias: true } } },
    });
    const desiredIds = new Set(parsed.data.materias);
    const removable = existingAssignments.filter((assignment) => !desiredIds.has(assignment.materiaId));
    const blocked = removable.find((assignment) => assignment._count.calificaciones > 0 || assignment._count.asistencias > 0);
    if (blocked) throw new GroupError("No puedes quitar una materia que ya tiene calificaciones o asistencias.", "materias");

    const existingIds = new Set(existingAssignments.map((assignment) => assignment.materiaId));
    const additions = parsed.data.materias.filter((materiaId) => !existingIds.has(materiaId));
    const updated = await prisma.$transaction(async (transaction) => {
      await transaction.grupo.update({ where: { id: parsed.data.id }, data: { cicloEscolarId: parsed.data.cicloEscolarId, grado: parsed.data.grado, letra: parsed.data.letra } });
      if (removable.length > 0) await transaction.materiaGrupo.deleteMany({ where: { id: { in: removable.map((assignment) => assignment.id) } } });
      if (additions.length > 0) await transaction.materiaGrupo.createMany({ data: additions.map((materiaId) => ({ materiaId, grupoId: parsed.data.id })) });
      return transaction.grupo.findUniqueOrThrow({ where: { id: parsed.data.id }, select: groupSelect });
    });
    revalidatePath(GROUPS_PATH);
    return { success: true, message: "Grupo actualizado correctamente.", data: mapGroup(updated) };
  } catch (error) {
    if (isPrismaError(error, "P2002")) return { success: false, message: "Ya existe ese grupo en el ciclo escolar seleccionado." };
    if (isPrismaError(error, "P2003")) return { success: false, message: "No se puede modificar el grupo porque tiene información relacionada." };
    return failure(error);
  }
}

export async function deleteGroupAction(input: unknown): Promise<GroupActionResult> {
  if (!(await canManageGroups())) return { success: false, message: "No tienes permisos para administrar grupos." };
  const parsed = deleteGroupSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "El grupo seleccionado no es válido." };

  try {
    const prisma = getPrisma();
    const group = await prisma.grupo.findUnique({ where: { id: parsed.data.id }, select: { id: true, _count: { select: { inscripciones: true } } } });
    if (!group) throw new GroupError("El grupo ya no existe.");
    if (group._count.inscripciones > 0) throw new GroupError("No puedes eliminar un grupo que tiene alumnos inscritos.");

    const assignments = await prisma.materiaGrupo.findMany({ where: { grupoId: parsed.data.id }, select: { id: true, _count: { select: { calificaciones: true, asistencias: true } } } });
    if (assignments.some((assignment) => assignment._count.calificaciones > 0 || assignment._count.asistencias > 0)) {
      throw new GroupError("No puedes eliminar un grupo que tiene calificaciones o asistencias.");
    }

    await prisma.$transaction(async (transaction) => {
      if (assignments.length > 0) await transaction.materiaGrupo.deleteMany({ where: { id: { in: assignments.map((assignment) => assignment.id) } } });
      await transaction.grupo.delete({ where: { id: parsed.data.id } });
    });
    revalidatePath(GROUPS_PATH);
    return { success: true, message: "Grupo eliminado correctamente." };
  } catch (error) {
    if (isPrismaError(error, "P2003")) return { success: false, message: "No puedes eliminar un grupo que tiene información relacionada." };
    return failure(error);
  }
}

export async function promoteGroupAction(input: unknown): Promise<GroupActionResult> {
  if (!(await canManageGroups())) return { success: false, message: "No tienes permisos para promover alumnos." };
  const parsed = promoteGroupSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los datos del grupo destino.", fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const prisma = getPrisma();
    const source = await prisma.grupo.findUnique({
      where: { id: parsed.data.sourceGroupId },
      select: {
        id: true,
        grado: true,
        letra: true,
        cicloEscolarId: true,
        materias: { select: { materiaId: true } },
        inscripciones: { select: { alumnoId: true } },
      },
    });
    if (!source) throw new GroupError("El grupo de origen ya no existe.");
    if (source.inscripciones.length === 0) throw new GroupError("El grupo no tiene alumnos inscritos para promover.");

    const schoolYear = await prisma.cicloEscolar.findUnique({ where: { id: parsed.data.targetCicloEscolarId }, select: { id: true } });
    if (!schoolYear) throw new GroupError("El ciclo escolar destino no existe.", "cicloEscolarId");
    if (source.cicloEscolarId === parsed.data.targetCicloEscolarId && source.grado === parsed.data.targetGrado && source.letra === parsed.data.targetLetra) {
      throw new GroupError("El grupo destino debe ser diferente al grupo de origen.");
    }

    const existingTarget = await prisma.grupo.findFirst({
      where: { cicloEscolarId: parsed.data.targetCicloEscolarId, grado: parsed.data.targetGrado, letra: parsed.data.targetLetra },
      select: { id: true },
    });

    const promotion = await prisma.$transaction(async (transaction) => {
      const target = existingTarget ?? await transaction.grupo.create({
        data: { cicloEscolarId: parsed.data.targetCicloEscolarId, grado: parsed.data.targetGrado, letra: parsed.data.targetLetra },
        select: { id: true },
      });
      const existingSubjects = await transaction.materiaGrupo.findMany({ where: { grupoId: target.id }, select: { materiaId: true } });
      const subjectIds = new Set(existingSubjects.map((subject) => subject.materiaId));
      const subjectsToCreate = source.materias.filter(({ materiaId }) => !subjectIds.has(materiaId));
      if (subjectsToCreate.length > 0) await transaction.materiaGrupo.createMany({ data: subjectsToCreate.map(({ materiaId }) => ({ materiaId, grupoId: target.id })) });

      const sourceStudentIds = source.inscripciones.map(({ alumnoId }) => alumnoId);
      const existingEnrollments = await transaction.inscripcion.findMany({ where: { grupoId: target.id, alumnoId: { in: sourceStudentIds } }, select: { alumnoId: true } });
      const enrolledIds = new Set(existingEnrollments.map(({ alumnoId }) => alumnoId));
      const studentsToCreate = source.inscripciones.filter(({ alumnoId }) => !enrolledIds.has(alumnoId));
      if (studentsToCreate.length > 0) await transaction.inscripcion.createMany({ data: studentsToCreate.map(({ alumnoId }) => ({ alumnoId, grupoId: target.id, repetidor: false })) });

      return {
        promotedCount: studentsToCreate.length,
        group: await transaction.grupo.findUniqueOrThrow({ where: { id: target.id }, select: groupSelect }),
      };
    });

    revalidatePath(GROUPS_PATH);
    revalidatePath("/students");
    revalidatePath("/grades");
    return {
      success: true,
      message: promotion.promotedCount > 0 ? `Se promovieron ${promotion.promotedCount} alumnos al grupo ${parsed.data.targetGrado}° ${parsed.data.targetLetra}.` : "Los alumnos ya estaban inscritos en el grupo destino.",
      promotedCount: promotion.promotedCount,
      data: mapGroup(promotion.group),
    };
  } catch (error) {
    if (isPrismaError(error, "P2002")) return { success: false, message: "El grupo destino ya existe o uno de sus alumnos ya está inscrito." };
    if (isPrismaError(error, "P2003")) return { success: false, message: "No se pudo completar la promoción por información relacionada." };
    return failure(error);
  }
}