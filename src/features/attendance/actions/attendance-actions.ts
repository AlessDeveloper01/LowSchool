"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AuthService } from "@/features/auth/services/AuthService";
import { saveAttendance } from "@/features/attendance/services/AttendanceService";
import type { AttendanceActionResult, AttendanceTerm, AttendanceUpdateInput } from "@/features/attendance/types/attendance.types";

const updateSchema = z.object({
  inscriptionId: z.string().cuid("La inscripción no es válida."),
  materiaGrupoId: z.string().cuid("La materia no es válida."),
  trimestre: z.enum(["T1", "T2", "T3"]),
  asistencias: z.number().int("Las asistencias deben ser enteras.").min(0, "Las asistencias no pueden ser negativas.").max(366, "Las asistencias no pueden superar 366."),
  faltas: z.number().int("Las faltas deben ser enteras.").min(0, "Las faltas no pueden ser negativas.").max(366, "Las faltas no pueden superar 366."),
});

const inputSchema = z.object({ updates: z.array(updateSchema).max(5000) });

async function canManageAttendance(): Promise<boolean> {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
}

export async function saveAttendanceAction(input: unknown): Promise<AttendanceActionResult> {
  if (!(await canManageAttendance())) return { success: false, message: "No tienes permisos para administrar asistencias." };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los valores de asistencia capturados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await saveAttendance(parsed.data.updates as Array<AttendanceUpdateInput & { trimestre: AttendanceTerm }>);
    revalidatePath("/attendance");
    return { success: true, message: "Asistencias guardadas correctamente." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "No fue posible guardar las asistencias.",
    };
  }
}
