import "server-only";

import { getPrisma } from "@/lib/prisma";
import type {
  ManagedStudent,
  StudentImportResult,
  StudentImportRow,
  StudentOptions,
  StudentFormInput,
} from "@/features/students/types/student.types";

type StudentRecord = Awaited<ReturnType<typeof findAll>>[number];

const studentSelect = {
  id: true,
  nombre: true,
  apellidos: true,
  matricula: true,
  sexo: true,
  tecnologia: true,
  direccion: true,
  curp: true,
  fechaNacimiento: true,
  telefonoResponsable: true,
  nombreResponsable: true,
  inscripciones: {
    select: {
      id: true,
      repetidor: true,
      grupo: {
        select: {
          id: true,
          grado: true,
          letra: true,
          cicloEscolar: { select: { nombre: true } },
        },
      },
    },
    orderBy: { grupo: { cicloEscolar: { nombre: "desc" } } },
  },
} as const;

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function calculateAge(date: Date | null): number | null {
  if (!date) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayNotReached =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  if (birthdayNotReached) age -= 1;
  return age >= 0 ? age : null;
}

function mapStudent(student: StudentRecord): ManagedStudent {
  return {
    id: student.id,
    nombre: student.nombre,
    apellidos: student.apellidos,
    matricula: student.matricula,
    sexo: student.sexo,
    edad: calculateAge(student.fechaNacimiento),
    tecnologia: student.tecnologia,
    direccion: student.direccion,
    curp: student.curp,
    fechaNacimiento: student.fechaNacimiento?.toISOString() ?? null,
    telefonoResponsable: student.telefonoResponsable,
    nombreResponsable: student.nombreResponsable,
    groups: student.inscripciones.map((inscription) => ({
      inscriptionId: inscription.id,
      groupId: inscription.grupo.id,
      groupLabel: `${inscription.grupo.grado}° ${inscription.grupo.letra}`,
      schoolYear: inscription.grupo.cicloEscolar.nombre,
      repetidor: inscription.repetidor,
    })),
  };
}

function toNullable(value: string): string | null {
  const normalized = normalizeText(value);
  return normalized || null;
}

function parseDate(value: string): Date | null {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  const date = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inferFromCurp(curp: string): { fechaNacimiento: Date | null; sexo: "H" | "M" | null } {
  const normalized = normalizeText(curp).toUpperCase();
  if (!/^[A-Z]{4}\d{6}[HM]/.test(normalized)) return { fechaNacimiento: null, sexo: null };

  const year = Number(normalized.slice(4, 6));
  const month = Number(normalized.slice(6, 8));
  const day = Number(normalized.slice(8, 10));
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year <= currentYear ? 2000 + year : 1900 + year;
  const date = new Date(`${fullYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00`);
  const validDate = date.getFullYear() === fullYear && date.getMonth() + 1 === month && date.getDate() === day;
  return { fechaNacimiento: validDate ? date : null, sexo: normalized[10] === "H" || normalized[10] === "M" ? normalized[10] : null };
}

function resolveStudentData(data: StudentFormInput): {
  fechaNacimiento: Date | null;
  sexo: "H" | "M" | null;
} {
  const inferred = inferFromCurp(data.curp);
  return {
    fechaNacimiento: parseDate(data.fechaNacimiento) ?? inferred.fechaNacimiento,
    sexo: data.sexo || inferred.sexo,
  };
}

function isPrismaError(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function findAll() {
  return getPrisma().alumno.findMany({
    select: studentSelect,
    orderBy: [{ apellidos: "asc" }, { nombre: "asc" }],
  });
}

async function findById(id: string) {
  return getPrisma().alumno.findUnique({ where: { id }, select: studentSelect });
}

async function findByMatricula(matricula: string, excludeId?: string) {
  return getPrisma().alumno.findFirst({
    where: { matricula, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
}

async function findByCurp(curp: string, excludeId?: string) {
  return getPrisma().alumno.findFirst({
    where: { curp, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
}

async function createStudent(data: StudentFormInput): Promise<ManagedStudent> {
  const prisma = getPrisma();
  const resolved = resolveStudentData(data);
  const student = await prisma.$transaction(async (transaction) => {
    const created = await transaction.alumno.create({
      data: {
        nombre: data.nombre.trim(),
        apellidos: data.apellidos.trim(),
        matricula: data.matricula.trim().toUpperCase(),
        sexo: resolved.sexo,
        tecnologia: toNullable(data.tecnologia),
        direccion: toNullable(data.direccion),
        curp: toNullable(data.curp)?.toUpperCase(),
        fechaNacimiento: resolved.fechaNacimiento,
        telefonoResponsable: toNullable(data.telefonoResponsable),
        nombreResponsable: toNullable(data.nombreResponsable),
      },
    });
    if (data.grupoId) {
      await transaction.inscripcion.create({
        data: { alumnoId: created.id, grupoId: data.grupoId, repetidor: data.repetidor },
      });
    }
    return transaction.alumno.findUniqueOrThrow({ where: { id: created.id }, select: studentSelect });
  });
  return mapStudent(student);
}

async function updateStudent(id: string, data: StudentFormInput): Promise<ManagedStudent> {
  const prisma = getPrisma();
  const resolved = resolveStudentData(data);
  const student = await prisma.$transaction(async (transaction) => {
    await transaction.alumno.update({
      where: { id },
      data: {
        nombre: data.nombre.trim(),
        apellidos: data.apellidos.trim(),
        matricula: data.matricula.trim().toUpperCase(),
        sexo: resolved.sexo,
        tecnologia: toNullable(data.tecnologia),
        direccion: toNullable(data.direccion),
        curp: toNullable(data.curp)?.toUpperCase(),
        fechaNacimiento: resolved.fechaNacimiento,
        telefonoResponsable: toNullable(data.telefonoResponsable),
        nombreResponsable: toNullable(data.nombreResponsable),
      },
    });
    const existingInscription = await transaction.inscripcion.findFirst({ where: { alumnoId: id }, select: { id: true } });
    if (data.grupoId) {
      if (existingInscription) {
        await transaction.inscripcion.update({ where: { id: existingInscription.id }, data: { grupoId: data.grupoId, repetidor: data.repetidor } });
      } else {
        await transaction.inscripcion.create({ data: { alumnoId: id, grupoId: data.grupoId, repetidor: data.repetidor } });
      }
    } else if (existingInscription) {
      await transaction.inscripcion.delete({ where: { id: existingInscription.id } });
    }
    return transaction.alumno.findUniqueOrThrow({ where: { id }, select: studentSelect });
  });
  return mapStudent(student);
}

async function deleteStudent(id: string): Promise<void> {
  const prisma = getPrisma();
  const student = await prisma.alumno.findUnique({ where: { id }, select: { id: true, _count: { select: { inscripciones: true } } } });
  if (!student) throw new Error("El alumno ya no existe.");
  if (student._count.inscripciones > 0) throw new Error("No puedes eliminar un alumno que tiene inscripciones registradas.");
  await prisma.alumno.delete({ where: { id } });
}

async function listOptions(): Promise<StudentOptions> {
  const prisma = getPrisma();
  const [groups, technologyRows] = await Promise.all([
    prisma.grupo.findMany({
      select: { id: true, grado: true, letra: true, cicloEscolar: { select: { nombre: true, activo: true } } },
      orderBy: [{ cicloEscolar: { activo: "desc" } }, { cicloEscolar: { nombre: "desc" } }, { grado: "asc" }, { letra: "asc" }],
    }),
    prisma.alumno.findMany({ where: { tecnologia: { not: null } }, select: { tecnologia: true }, distinct: ["tecnologia"], orderBy: { tecnologia: "asc" } }),
  ]);
  return {
    groups: groups.map((group) => ({ id: group.id, label: `${group.grado}° ${group.letra}`, schoolYear: group.cicloEscolar.nombre, active: group.cicloEscolar.activo })),
    technologies: technologyRows.flatMap((row) => row.tecnologia ? [row.tecnologia] : []),
  };
}

async function importStudents(rows: StudentImportRow[]): Promise<StudentImportResult> {
  const prisma = getPrisma();
  let created = 0;
  let updated = 0;
  const errors: Array<{ rowNumber: number; message: string }> = [];

  for (const row of rows) {
    try {
      const matricula = normalizeText(row.matricula).toUpperCase();
      if (!normalizeText(row.nombre) || !normalizeText(row.apellidos) || !matricula) throw new Error("nombre, apellidos y matrícula son obligatorios.");
      const groupId = normalizeText(row.grupoId);
      if (groupId) {
        const group = await prisma.grupo.findUnique({ where: { id: groupId }, select: { id: true } });
        if (!group) throw new Error("El grupo seleccionado no existe.");
      }
      const existing = await prisma.alumno.findUnique({ where: { matricula }, select: { id: true } });
      const data: StudentFormInput = { ...row, matricula, grupoId: groupId, repetidor: row.repetidor };
      if (existing) {
        await updateStudent(existing.id, data);
        updated += 1;
      } else {
        await createStudent(data);
        created += 1;
      }
    } catch (error) {
      errors.push({ rowNumber: row.rowNumber, message: error instanceof Error ? error.message : "Fila inválida." });
    }
  }

  return {
    success: errors.length === 0,
    message: errors.length === 0 ? `Carga terminada: ${created} creados y ${updated} actualizados.` : `Carga terminada con ${errors.length} errores.`,
    created,
    updated,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export const StudentService = {
  findAll,
  findById,
  findByMatricula,
  findByCurp,
  createStudent,
  updateStudent,
  deleteStudent,
  listOptions,
  importStudents,
  isPrismaError,
};