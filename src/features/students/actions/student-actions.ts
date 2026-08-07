"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AuthService } from "@/features/auth/services/AuthService";
import { StudentService } from "@/features/students/services/StudentService";
import type { StudentActionResult, StudentImportResult, StudentImportRow } from "@/features/students/types/student.types";

const STUDENTS_PATH = "/students";
const idSchema = z.string().cuid("El alumno no es válido.");
const groupIdSchema = z.string().cuid().or(z.literal(""));
const studentInputSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(100),
  apellidos: z.string().trim().min(2, "Los apellidos deben tener al menos 2 caracteres.").max(150),
  matricula: z.string().trim().min(1, "La matrícula es obligatoria.").max(40),
  sexo: z.enum(["H", "M", ""]).default(""),
  tecnologia: z.string().trim().max(100),
  direccion: z.string().trim().max(250),
  curp: z.string().trim().max(18, "La CURP no puede superar 18 caracteres."),
  fechaNacimiento: z.string().trim().refine((value) => !value || !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), "La fecha no es válida."),
  telefonoResponsable: z.string().trim().max(30),
  nombreResponsable: z.string().trim().max(150),
  grupoId: groupIdSchema,
  repetidor: z.boolean(),
});
const updateInputSchema = studentInputSchema.extend({ id: idSchema });
const deleteInputSchema = z.object({ id: idSchema });
const importSchema = z.object({ rows: z.array(z.object({ rowNumber: z.number().int(), nombre: z.string(), apellidos: z.string(), matricula: z.string(), sexo: z.enum(["H", "M", ""]), tecnologia: z.string(), direccion: z.string(), curp: z.string(), fechaNacimiento: z.string(), telefonoResponsable: z.string(), nombreResponsable: z.string(), grupoId: z.string(), repetidor: z.boolean() })).max(5000) });

async function canManage(): Promise<boolean> {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
}

function failure(error: unknown): StudentActionResult {
  if (error instanceof Error) return { success: false, message: error.message };
  return { success: false, message: "No fue posible completar la operación." };
}

export async function createStudentAction(input: unknown): Promise<StudentActionResult> {
  if (!(await canManage())) return { success: false, message: "No tienes permisos para administrar alumnos." };
  const parsed = studentInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const matricula = parsed.data.matricula.toUpperCase();
    if (await StudentService.findByMatricula(matricula)) return { success: false, message: "La matrícula ya está registrada.", fieldErrors: { matricula: ["La matrícula ya está registrada."] } };
    const curp = parsed.data.curp.toUpperCase();
    if (curp && await StudentService.findByCurp(curp)) return { success: false, message: "La CURP ya está registrada.", fieldErrors: { curp: ["La CURP ya está registrada."] } };
    const data = await StudentService.createStudent({ ...parsed.data, matricula, curp });
    revalidatePath(STUDENTS_PATH);
    return { success: true, message: "Alumno creado correctamente.", data };
  } catch (error) { return failure(error); }
}

export async function updateStudentAction(input: unknown): Promise<StudentActionResult> {
  if (!(await canManage())) return { success: false, message: "No tienes permisos para administrar alumnos." };
  const parsed = updateInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    const matricula = parsed.data.matricula.toUpperCase();
    if (await StudentService.findByMatricula(matricula, parsed.data.id)) return { success: false, message: "La matrícula ya está registrada.", fieldErrors: { matricula: ["La matrícula ya está registrada."] } };
    const curp = parsed.data.curp.toUpperCase();
    if (curp && await StudentService.findByCurp(curp, parsed.data.id)) return { success: false, message: "La CURP ya está registrada.", fieldErrors: { curp: ["La CURP ya está registrada."] } };
    const data = await StudentService.updateStudent(parsed.data.id, { ...parsed.data, matricula, curp });
    revalidatePath(STUDENTS_PATH);
    return { success: true, message: "Alumno actualizado correctamente.", data };
  } catch (error) { return failure(error); }
}

export async function deleteStudentAction(input: unknown): Promise<StudentActionResult> {
  if (!(await canManage())) return { success: false, message: "No tienes permisos para administrar alumnos." };
  const parsed = deleteInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "El alumno seleccionado no es válido." };
  try { await StudentService.deleteStudent(parsed.data.id); revalidatePath(STUDENTS_PATH); return { success: true, message: "Alumno eliminado correctamente." }; } catch (error) { return failure(error); }
}

export async function importStudentsAction(input: { rows: StudentImportRow[] }): Promise<StudentImportResult> {
  if (!(await canManage())) return { success: false, message: "No tienes permisos para importar alumnos.", created: 0, updated: 0 };
  const parsed = importSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "El archivo contiene datos inválidos.", created: 0, updated: 0 };
  const result = await StudentService.importStudents(parsed.data.rows);
  revalidatePath(STUDENTS_PATH);
  return result;
}